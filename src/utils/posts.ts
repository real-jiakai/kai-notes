import { getCollection, type CollectionEntry } from 'astro:content';
import { getAlternateLocaleUrl } from '../i18n/utils';
import { POSTS_PER_PAGE } from '../consts';

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

/**
 * Alternate-language URL for the current page, or null when the counterpart
 * doesn't exist (untranslated post, out-of-range pagination page).
 */
export async function getAlternatePath(url: URL, targetLang: PostLang): Promise<string | null> {
	const path = getAlternateLocaleUrl(url, targetLang);
	const normalized = path.endsWith('/') ? path : `${path}/`;

	if (/^(?:\/en)?\/\d{4}\/\d{2}\/.+/.test(url.pathname)) {
		const posts = await getPublishedPosts(targetLang);
		return posts.some((post) => getPostPath(post) === normalized) ? normalized : null;
	}

	const pageMatch = url.pathname.match(/^(?:\/en)?\/(\d+)\/?$/);
	if (pageMatch) {
		const posts = await getPublishedPosts(targetLang);
		const lastPage = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
		return Number(pageMatch[1]) <= lastPage ? normalized : null;
	}

	return normalized;
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
