import rss from '@astrojs/rss';
import { SITE_TITLE_I18N, SITE_DESCRIPTION_I18N } from '../../consts';
import { getPublishedPosts, getPostPath } from '../../utils/posts';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({
	html: true,
	breaks: true,
	linkify: true,
});

export async function GET(context) {
	const posts = await getPublishedPosts('en');

	// Render full content for each post
	const rssItems = await Promise.all(
		posts.map(async (post) => {
			// Convert Markdown to HTML
			const html = parser.render(post.body);

			// Sanitize HTML
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

	return rss({
		title: SITE_TITLE_I18N.en,
		description: SITE_DESCRIPTION_I18N.en,
		site: context.site,
		items: rssItems,
		customData: `<language>en</language>`,
	});
}
