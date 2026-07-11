// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { readFileSync } from 'node:fs';

const DEFAULT_SITE_URL = 'https://blog.gujiakai.me';
const configuredSiteUrl = process.env.SITE_URL || process.env.DEPLOY_PRIME_URL || DEFAULT_SITE_URL;
const siteUrl = new URL(configuredSiteUrl);
const excludedSitemapPaths = new Set(['/404.html', '/en/404/']);

if (!['http:', 'https:'].includes(siteUrl.protocol)) {
	throw new Error(`SITE_URL must use http or https, received: ${configuredSiteUrl}`);
}

const remoteImageDimensions = JSON.parse(
	readFileSync(new URL('./scripts/remote-image-dimensions.json', import.meta.url), 'utf8'),
);

// Satteri's data bag is scoped to one document, so image priority resets for each post.
const remoteImageMetadata = {
	name: 'remote-image-metadata',
	element: {
		filter: ['img'],
		/** @param {any} node @param {any} ctx */
		visit(node, ctx) {
			const imageIndex = Number(ctx.data.kaiImageIndex ?? 0);
			ctx.data.kaiImageIndex = imageIndex + 1;

			if (node.properties?.loading == null) {
				ctx.setProperty(node, 'loading', imageIndex === 0 ? 'eager' : 'lazy');
			}
			if (node.properties?.decoding == null) ctx.setProperty(node, 'decoding', 'async');
			if (imageIndex === 0 && node.properties?.fetchPriority == null) {
				ctx.setProperty(node, 'fetchPriority', 'high');
			}

			const src = node.properties?.src;
			const dimensions = typeof src === 'string' ? remoteImageDimensions[src] : undefined;
			if (dimensions) {
				if (node.properties?.width == null) ctx.setProperty(node, 'width', dimensions.width);
				if (node.properties?.height == null) ctx.setProperty(node, 'height', dimensions.height);
			}
		},
	},
};

// The layout owns the page h1; demote any h1 that remains in Markdown content.
const demoteH1 = {
	name: 'demote-h1',
	element: {
		filter: ['h1'],
		/** @param {any} node */
		visit(node) {
			return { ...node, tagName: 'h2' };
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: siteUrl.href,
	integrations: [
		mdx(),
		sitemap({ filter: (page) => !excludedSitemapPaths.has(new URL(page).pathname) }),
	],
	markdown: {
		processor: satteri({
			hastPlugins: [remoteImageMetadata, demoteH1],
		}),
	},
	i18n: {
		locales: ['zh', 'en'],
		defaultLocale: 'zh',
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
