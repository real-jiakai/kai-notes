import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const projectRoot = new URL('../', import.meta.url);
const publicDirectory = new URL('public/', projectRoot);
const dependencyAssets = [
	'98.css',
	'98.css.map',
	'ms_sans_serif.woff',
	'ms_sans_serif.woff2',
	'ms_sans_serif_bold.woff',
	'ms_sans_serif_bold.woff2',
];

await Promise.all(
	dependencyAssets.map((asset) =>
		copyFile(
			new URL(`node_modules/98.css/dist/${asset}`, projectRoot),
			new URL(asset, publicDirectory),
		),
	),
);

await build({
	entryPoints: [fileURLToPath(new URL('scripts/feed-style.js', projectRoot))],
	outfile: fileURLToPath(new URL('feed-style.js', publicDirectory)),
	bundle: false,
	minify: true,
	platform: 'browser',
});

console.log('Synced 98.css assets and the RSS preview script.');
