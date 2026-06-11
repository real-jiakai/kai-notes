import type { APIContext } from 'astro';
import { SITE_TITLE_I18N, SITE_DESCRIPTION_I18N } from '../consts';
import { getPublishedPosts, getPostPath } from '../utils/posts';

// llms.txt 规范见 https://llmstxt.org/ ：H1 + 引用块摘要 + 链接小节；
// 「## Optional」是规范关键字，LLM 在上下文紧张时可跳过该节。
export async function GET(context: APIContext) {
	const site = context.site!; // astro.config.mjs 中已配置 site
	const abs = (path: string) => new URL(path, site).href;

	const zhPosts = await getPublishedPosts('zh');
	const enPosts = await getPublishedPosts('en');

	const zhLines = zhPosts.map(
		(post) => `- [${post.data.title}](${abs(getPostPath(post))})：${post.data.description}`
	);
	const enLines = enPosts.map(
		(post) => `- [${post.data.title}](${abs(getPostPath(post))}): ${post.data.description}`
	);

	const content = [
		`# ${SITE_TITLE_I18N.zh} (${SITE_TITLE_I18N.en})`,
		'',
		`> ${SITE_DESCRIPTION_I18N.zh}。`,
		'> A bilingual (Chinese/English) personal blog about AI, tinkering, and personal growth.',
		'',
		'中文内容位于站点根路径；English content lives under the /en/ prefix.',
		'',
		'## 文章 (Chinese Posts)',
		'',
		...zhLines,
		'',
		'## English Posts',
		'',
		...enLines,
		'',
		'## 页面 (Pages)',
		'',
		`- [关于](${abs('/about/')})：关于本站与作者`,
		`- [About](${abs('/en/about/')}): About this site and the author`,
		'',
		'## Optional',
		'',
		`- [RSS Feed（中文）](${abs('/rss.xml')})`,
		`- [RSS Feed (English)](${abs('/en/rss.xml')})`,
		`- [Sitemap](${abs('/sitemap-index.xml')})`,
		'',
	].join('\n');

	return new Response(content, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
