import { getRssString } from '@astrojs/rss';
import { SITE_TITLE_I18N, SITE_DESCRIPTION_I18N } from '../../consts';
import { getPublishedPosts, getPostPath } from '../../utils/posts';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({
	html: true,
	breaks: true,
	linkify: true,
});

// Renders a Win98 preview page when the feed is opened in a browser;
// feed readers ignore this XHTML-namespaced element.
const FEED_STYLE_SCRIPT = '<script src="/feed-style.js" xmlns="http://www.w3.org/1999/xhtml"></script>';

export async function GET(context) {
	const posts = await getPublishedPosts('en');

	// Render full content for each post
	const rssItems = await Promise.all(
		posts.map(async (post) => {
			// Convert Markdown to HTML
			const html = parser.render(post.body);

			// Sanitize HTML; links keep http(s) only, target is left to the reader
			const sanitizedHtml = sanitizeHtml(html, {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					img: ['src', 'alt', 'title', 'width', 'height'],
					a: ['href', 'title'],
				},
				allowedSchemes: ['http', 'https', 'mailto'],
				allowProtocolRelative: false,
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
		title: SITE_TITLE_I18N.en,
		description: SITE_DESCRIPTION_I18N.en,
		site: context.site,
		items: rssItems,
		xmlns: { atom: 'http://www.w3.org/2005/Atom' },
		customData: [
			'<language>en</language>',
			`<atom:link href="${new URL('en/rss.xml', context.site).href}" rel="self" type="application/rss+xml"/>`,
		].join(''),
	});

	return new Response(rssString.replace('<channel>', `${FEED_STYLE_SCRIPT}<channel>`), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}
