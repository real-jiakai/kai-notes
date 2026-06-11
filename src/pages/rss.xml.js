import { getRssString } from '@astrojs/rss';
import { SITE_TITLE_I18N, SITE_DESCRIPTION_I18N } from '../consts';
import { getPublishedPosts, getPostPath } from '../utils/posts';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({
	html: true,
	breaks: true,
	linkify: true,
});

// 浏览器打开订阅源时渲染 Win98 预览页；RSS 阅读器会忽略此元素（XHTML 命名空间）
const FEED_STYLE_SCRIPT = '<script src="/feed-style.js" xmlns="http://www.w3.org/1999/xhtml"></script>';

export async function GET(context) {
	const posts = await getPublishedPosts('zh');

	// 渲染每篇文章的完整内容
	const rssItems = await Promise.all(
		posts.map(async (post) => {
			// 将Markdown转换为HTML
			const html = parser.render(post.body);

			// 清理和净化HTML
			const sanitizedHtml = sanitizeHtml(html, {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'video', 'audio']),
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					img: ['src', 'alt', 'title', 'width', 'height'],
					a: ['href', 'title', 'target'],
				},
			});

			return {
				title: post.data.title,
				description: post.data.description,
				content: sanitizedHtml,
				pubDate: post.data.pubDate,
				link: getPostPath(post),
			};
		})
	);

	const rssString = await getRssString({
		title: SITE_TITLE_I18N.zh,
		description: SITE_DESCRIPTION_I18N.zh,
		site: context.site,
		items: rssItems,
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
		customData: [
			'<language>zh-CN</language>',
			`<atom:link href="${new URL('rss.xml', context.site).href}" rel="self" type="application/rss+xml"/>`,
		].join(''),
	});

	return new Response(rssString.replace('<channel>', `${FEED_STYLE_SCRIPT}<channel>`), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}
