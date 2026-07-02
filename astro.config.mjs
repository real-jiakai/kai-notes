// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

// 文章图片均为远程直链，Astro 不会注入 loading/decoding，这里统一补上
function rehypeLazyImages() {
	/** @param {any} tree */
	return (tree) => {
		const walk = (/** @type {any} */ node) => {
			if (node.type === 'element' && node.tagName === 'img') {
				node.properties.loading ??= 'lazy';
				node.properties.decoding ??= 'async';
			}
			for (const child of node.children ?? []) walk(child);
		};
		walk(tree);
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.gujiakai.me',
	integrations: [mdx(), sitemap()],
	markdown: {
		// Astro 7 默认用 Sätteri 渲染 Markdown；显式走 unified 以复用 rehype 插件
		processor: unified({
			rehypePlugins: [rehypeLazyImages],
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
