import { getCollection, type CollectionEntry } from 'astro:content';

export type PostLang = 'zh' | 'en';

/**
 * Published (non-draft) posts for a language, newest first.
 * 'zh' includes posts without a `lang` field (Chinese is the default).
 */
export async function getPublishedPosts(lang: PostLang): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog', ({ data }) => {
		if (data.draft === true) return false;
		if (lang === 'en') return data.lang === 'en';
		return data.lang === 'zh' || data.lang === undefined;
	});
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Site-relative path for a post, e.g. `/2025/07/slug/` or `/en/2025/07/slug/`. */
export function getPostPath(post: CollectionEntry<'blog'>): string {
	const date = new Date(post.data.pubDate);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const slug = post.data.slug || post.id.replace(/^en\//, '');
	const prefix = post.data.lang === 'en' ? '/en' : '';
	return `${prefix}/${year}/${month}/${slug}/`;
}
