import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = new URL('../', import.meta.url);
const outputDirectory = fileURLToPath(new URL('dist/', projectRoot));
const headersFile = join(outputDirectory, '_headers');

async function listHtmlFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await listHtmlFiles(path)));
		else if (extname(entry.name) === '.html') files.push(path);
	}
	return files;
}

function inlineScriptHashes(html) {
	const hashes = [];
	for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
		const [, attributes, source] = match;
		if (/\bsrc\s*=/i.test(attributes) || source.length === 0) continue;
		const digest = createHash('sha256').update(source, 'utf8').digest('base64');
		hashes.push(`'sha256-${digest}'`);
	}
	return hashes;
}

const hashes = new Set();
for (const file of await listHtmlFiles(outputDirectory)) {
	for (const hash of inlineScriptHashes(await readFile(file, 'utf8'))) hashes.add(hash);
}

let headers = await readFile(headersFile, 'utf8');
const cspPattern = /^(\s*Content-Security-Policy:\s*)(.+)$/m;
const cspMatch = headers.match(cspPattern);
if (!cspMatch) throw new Error('dist/_headers does not contain a Content-Security-Policy header.');

const directives = cspMatch[2].split(';').map((directive) => directive.trim()).filter(Boolean);
const scriptIndex = directives.findIndex((directive) => directive.startsWith('script-src '));
if (scriptIndex === -1) throw new Error('Content-Security-Policy does not contain script-src.');

const scriptSources = directives[scriptIndex]
	.split(/\s+/)
	.slice(1)
	.filter((source) => source !== "'unsafe-inline'" && !source.startsWith("'sha256-"));
directives[scriptIndex] = ['script-src', ...scriptSources, ...[...hashes].sort()].join(' ');

const finalizedCsp = `${directives.join('; ')};`;
headers = headers.replace(cspPattern, `${cspMatch[1]}${finalizedCsp}`);
await writeFile(headersFile, headers, 'utf8');

if (finalizedCsp.length > 12_000) {
	throw new Error(`Generated CSP is unexpectedly large (${finalizedCsp.length} characters).`);
}

console.log(`Finalized CSP with ${hashes.size} unique inline-script hashes.`);
