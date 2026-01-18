import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE_I18N, SITE_DESCRIPTION_I18N } from '../../consts';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({
	html: true,
	breaks: true,
	linkify: true,
});

export async function GET(context) {
	const posts = (await getCollection('blog', ({ data }) => {
		// Filter out drafts, only include English posts
		return data.draft !== true && data.lang === 'en';
	})).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	// Render full content for each post
	const rssItems = await Promise.all(
		posts.map(async (post) => {
			const date = new Date(post.data.pubDate);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			// Remove 'en/' prefix from post.id for English posts
			const slug = post.data.slug || post.id.replace(/^en\//, '');

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
				link: `/en/${year}/${month}/${slug}/`,
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
