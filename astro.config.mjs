// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

// 文章图片均为远程直链，Astro 不会注入 loading/decoding，这里统一补上
const lazyImages = {
	name: 'lazy-images',
	element: {
		filter: ['img'],
		/** @param {any} node @param {any} ctx */
		visit(node, ctx) {
			if (node.properties?.loading == null) ctx.setProperty(node, 'loading', 'lazy');
			if (node.properties?.decoding == null) ctx.setProperty(node, 'decoding', 'async');
		},
	},
};

// 布局已渲染文章标题为 h1，正文里的 # 标题降级为 h2，避免一页双 h1
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
	site: 'https://blog.gujiakai.me',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Astro 7 原生 Sätteri 管线（Rust），插件用其 HAST visitor API
		processor: satteri({
			hastPlugins: [lazyImages, demoteH1],
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
