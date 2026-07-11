import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = new URL('../', import.meta.url);
const contentDirectory = fileURLToPath(new URL('src/content/', projectRoot));
const dimensionsFile = new URL('scripts/remote-image-dimensions.json', projectRoot);
const mode = process.argv[2] ?? '--check';
const MAX_REMOTE_IMAGE_BYTES = 32 * 1024 * 1024;

if (!['--check', '--refresh'].includes(mode)) {
	throw new Error('Usage: node scripts/image-dimensions.mjs [--check|--refresh]');
}

async function listMarkdownFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await listMarkdownFiles(path)));
		else if (['.md', '.mdx'].includes(extname(entry.name))) files.push(path);
	}
	return files;
}

function findRemoteImages(markdown) {
	const urls = [];
	const markdownImage = /!\[[^\]]*\]\(\s*<?(https?:\/\/[^>\s)]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/gi;
	const htmlImage = /<img\b[^>]*\bsrc\s*=\s*["'](https?:\/\/[^"']+)["'][^>]*>/gi;

	for (const match of markdown.matchAll(markdownImage)) urls.push(match[1]);
	for (const match of markdown.matchAll(htmlImage)) urls.push(match[1]);
	return urls;
}

async function collectRemoteImages() {
	const urls = new Set();
	for (const file of await listMarkdownFiles(contentDirectory)) {
		for (const url of findRemoteImages(await readFile(file, 'utf8'))) urls.add(url);
	}
	return [...urls].sort((a, b) => a.localeCompare(b));
}

async function readDimensions() {
	try {
		return JSON.parse(await readFile(dimensionsFile, 'utf8'));
	} catch (error) {
		if (error?.code === 'ENOENT') return {};
		throw error;
	}
}

function isValidDimensions(value) {
	return (
		Number.isInteger(value?.width) &&
		value.width > 0 &&
		Number.isInteger(value?.height) &&
		value.height > 0
	);
}

async function readResponseWithLimit(response, url) {
	const declaredLength = Number(response.headers.get('content-length'));
	if (Number.isFinite(declaredLength) && declaredLength > MAX_REMOTE_IMAGE_BYTES) {
		await response.body?.cancel();
		throw new Error(`${url}: response exceeds the 32 MiB limit`);
	}

	if (!response.body) throw new Error(`${url}: response has no body`);
	const reader = response.body.getReader();
	const chunks = [];
	let totalLength = 0;

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			totalLength += value.byteLength;
			if (totalLength > MAX_REMOTE_IMAGE_BYTES) {
				await reader.cancel();
				throw new Error(`${url}: response exceeds the 32 MiB limit`);
			}
			chunks.push(Buffer.from(value));
		}
	} finally {
		reader.releaseLock();
	}

	return Buffer.concat(chunks, totalLength);
}

async function fetchDimensions(url) {
	let lastError;
	for (let attempt = 1; attempt <= 3; attempt += 1) {
		try {
			const response = await fetch(url, {
				headers: { 'user-agent': 'Kai-Notes image metadata refresh' },
				signal: AbortSignal.timeout(30_000),
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const metadata = await sharp(await readResponseWithLimit(response, url), {
				animated: true,
			}).metadata();
			if (!metadata.width || !metadata.height) throw new Error('image has no intrinsic dimensions');
			return { width: metadata.width, height: metadata.height };
		} catch (error) {
			lastError = error;
			if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
		}
	}
	throw new Error(`${url}: ${lastError?.message ?? lastError}`);
}

async function mapWithConcurrency(items, concurrency, callback) {
	const results = new Array(items.length);
	let nextIndex = 0;
	async function worker() {
		while (nextIndex < items.length) {
			const index = nextIndex;
			nextIndex += 1;
			results[index] = await callback(items[index], index);
		}
	}
	await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
	return results;
}

const urls = await collectRemoteImages();
const dimensions = await readDimensions();

if (mode === '--check') {
	const missing = urls.filter((url) => !isValidDimensions(dimensions[url]));
	const stale = Object.keys(dimensions).filter((url) => !urls.includes(url));
	if (missing.length || stale.length) {
		if (missing.length) console.error(`Missing/invalid image dimensions:\n${missing.join('\n')}`);
		if (stale.length) console.error(`Stale image-dimension entries:\n${stale.join('\n')}`);
		console.error('Run "pnpm images:refresh" and commit the updated map.');
		process.exitCode = 1;
	} else {
		console.log(`Verified intrinsic dimensions for ${urls.length} remote images.`);
	}
} else {
	console.log(`Refreshing intrinsic dimensions for ${urls.length} remote images...`);
	const values = await mapWithConcurrency(urls, 6, async (url, index) => {
		const value = await fetchDimensions(url);
		console.log(`[${index + 1}/${urls.length}] ${value.width}x${value.height} ${url}`);
		return value;
	});
	const refreshed = Object.fromEntries(urls.map((url, index) => [url, values[index]]));
	await writeFile(dimensionsFile, `${JSON.stringify(refreshed, null, 2)}\n`, 'utf8');
	console.log(`Updated ${fileURLToPath(dimensionsFile)}.`);
}
