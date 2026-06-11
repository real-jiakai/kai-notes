# llms.txt + Styled RSS Feeds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an auto-generated `/llms.txt` index for AI assistants, and make `/rss.xml` + `/en/rss.xml` render as Win98-themed preview pages when opened in a browser (rss.style JavaScript approach — no XSLT).

**Architecture:** A new `src/utils/posts.ts` centralizes post filtering/URL building (currently copy-pasted in 8 files) and feeds three static endpoints: the two existing RSS endpoints (refactored, then extended to inject a `<script>` element into the XML via `getRssString`) and a new `llms.txt.ts`. A self-contained `public/feed-style.js` (adapted from rss.style's MIT script) runs only when a browser renders the feed XML and replaces it with a 98.css window; it reuses the site's theming by moving `theme.css` from the Astro bundle to `public/`.

**Tech Stack:** Astro 6 static endpoints, `@astrojs/rss` (`getRssString`, `xmlns`, `customData`), vanilla JS with `createElementNS` (XHTML-in-XML), 98.css + existing `theme.css` CSS variables.

**Spec:** `docs/superpowers/specs/2026-06-11-llmstxt-rss-style-design.md` (approved 2026-06-11)

**Verification model:** No test framework exists in this repo (matches dark-mode work). Each task verifies via `pnpm build` output assertions (diff/grep/python3 XML parse) against a baseline captured in Task 1; final task does a browser pass with the webapp-testing skill (Playwright) or manual checklist.

**Working directory:** `/Users/jiakai/Documents/project/astro-blog` (all commands run from here).

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/utils/posts.ts` | Create | `getPublishedPosts(lang)` + `getPostPath(post)` — single source of truth for post filtering and URLs |
| `src/pages/llms.txt.ts` | Create | `/llms.txt` static endpoint (llmstxt.org format) |
| `public/feed-style.js` | Create | Browser-only feed preview renderer (Win98 window, zh/en, light/dark) |
| `src/pages/rss.xml.js` | Modify | Use helpers; then `getRssString` + script injection + `atom:link` self |
| `src/pages/en/rss.xml.js` | Modify | Same as above, English variant |
| `src/styles/theme.css` → `public/theme.css` | Move | Stable URL so the feed page can load the site's theme variables |
| `src/components/BaseHead.astro` | Modify | Swap bundled import for `<link href="/theme.css">` |

Task order matters: Task 4 (theme.css move) must precede Task 5 (`feed-style.js` links `/theme.css`); Task 5 must precede Task 6 (feeds reference `/feed-style.js`).

---

### Task 1: Capture baseline feed output

Captures current build output so later refactors can prove "no URL drift" (spec acceptance criterion 3). No commit — `/tmp` artifacts only.

- [ ] **Step 1.1: Build and snapshot the feeds**

```bash
pnpm build
mkdir -p /tmp/feed-baseline
cp dist/rss.xml /tmp/feed-baseline/rss.xml
cp dist/en/rss.xml /tmp/feed-baseline/en-rss.xml
grep -o '<link>[^<]*</link>' /tmp/feed-baseline/rss.xml > /tmp/feed-baseline/zh-links.txt
grep -o '<link>[^<]*</link>' /tmp/feed-baseline/en-rss.xml > /tmp/feed-baseline/en-links.txt
wc -l /tmp/feed-baseline/zh-links.txt /tmp/feed-baseline/en-links.txt
```

Expected: build succeeds; `wc -l` prints N+1 lines per feed (N posts + 1 channel home `<link>`). As of writing: 17 zh posts → 18, 12 en posts → 13 (counts may grow if posts were added — that's fine, just note the numbers for later comparison).

---

### Task 2: Extract shared post helpers, refactor both RSS endpoints (zero output change)

**Files:**
- Create: `src/utils/posts.ts`
- Modify: `src/pages/rss.xml.js`
- Modify: `src/pages/en/rss.xml.js`

- [ ] **Step 2.1: Create `src/utils/posts.ts`** with exactly:

```ts
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
```

Notes for the implementer:
- The `replace(/^en\//, '')` is a no-op for Chinese post ids (they never start with `en/` — verified: every file under `src/content/blog/en/` declares `lang: 'en'`), so this single expression reproduces both endpoints' current slug logic byte-for-byte.
- Don't "improve" the filter or sort — byte-identical output is the acceptance test.

- [ ] **Step 2.2: Rewrite `src/pages/rss.xml.js`** to exactly:

```js
import rss from '@astrojs/rss';
import { SITE_TITLE_I18N, SITE_DESCRIPTION_I18N } from '../consts';
import { getPublishedPosts, getPostPath } from '../utils/posts';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({
	html: true,
	breaks: true,
	linkify: true,
});

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

	return rss({
		title: SITE_TITLE_I18N.zh,
		description: SITE_DESCRIPTION_I18N.zh,
		site: context.site,
		items: rssItems,
		customData: `<language>zh-CN</language>`,
	});
}
```

- [ ] **Step 2.3: Rewrite `src/pages/en/rss.xml.js`** to exactly:

```js
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
```

- [ ] **Step 2.4: Build and diff against baseline**

```bash
pnpm build
diff dist/rss.xml /tmp/feed-baseline/rss.xml && echo ZH-IDENTICAL
diff dist/en/rss.xml /tmp/feed-baseline/en-rss.xml && echo EN-IDENTICAL
```

Expected: no diff output, both `ZH-IDENTICAL` and `EN-IDENTICAL` printed. Any diff at all = the helper changed behavior → fix the helper, don't proceed.

- [ ] **Step 2.5: Commit**

```bash
git add src/utils/posts.ts src/pages/rss.xml.js src/pages/en/rss.xml.js
git commit -m "refactor(rss): extract shared post filter and url helpers

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: `/llms.txt` endpoint

**Files:**
- Create: `src/pages/llms.txt.ts` (Astro strips the final `.ts` → route `/llms.txt`)

- [ ] **Step 3.1: Create `src/pages/llms.txt.ts`** with exactly:

```ts
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
```

- [ ] **Step 3.2: Build and verify content**

```bash
pnpm build
head -8 dist/llms.txt
```

Expected output (post lines follow after):

```
# 凯记 (Kai's Notes)

> 专注于分享AI、个人折腾、个人成长心得等方面的知识。
> A bilingual (Chinese/English) personal blog about AI, tinkering, and personal growth.

中文内容位于站点根路径；English content lives under the /en/ prefix.

## 文章 (Chinese Posts)
```

- [ ] **Step 3.3: Cross-check every feed post URL appears in llms.txt**

```bash
sed 's/<\/\?link>//g' /tmp/feed-baseline/zh-links.txt | grep '/20' | while read u; do grep -qF "($u)" dist/llms.txt || echo "MISSING: $u"; done; echo zh-check-done
sed 's/<\/\?link>//g' /tmp/feed-baseline/en-links.txt | grep '/20' | while read u; do grep -qF "($u)" dist/llms.txt || echo "MISSING: $u"; done; echo en-check-done
```

(`grep '/20'` keeps only post URLs — they contain `/20xx/` — and drops the channel home link.)

Expected: only `zh-check-done` and `en-check-done` printed, no `MISSING:` lines.

Note: there are currently no `draft: true` posts in the repo, so the draft-exclusion path can't be data-verified; it's covered by reusing `getPublishedPosts`, which Task 2 proved byte-identical to the old filter.

- [ ] **Step 3.4: Commit**

```bash
git add src/pages/llms.txt.ts
git commit -m "feat: add llms.txt index for ai assistants

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Move theme.css to `public/`

**Files:**
- Move: `src/styles/theme.css` → `public/theme.css` (content unchanged — no `url()` refs, selectors are deliberately `html`-prefixed/load-order-independent; its header comment references the dark-mode spec path, which stays valid)
- Modify: `src/components/BaseHead.astro` (lines 4–6 imports, line ~50 stylesheet links)

- [ ] **Step 4.1: Move the file**

```bash
git mv src/styles/theme.css public/theme.css
```

- [ ] **Step 4.2: Update `src/components/BaseHead.astro`** — two edits.

Edit 1 — remove the bundled import. Old:

```astro
import '../styles/global.css';
import '../styles/98-custom.css';
import '../styles/theme.css';
```

New:

```astro
import '../styles/global.css';
import '../styles/98-custom.css';
```

Edit 2 — link it right after 98.css (theme.css must be reachable at a stable URL for the feed preview page). Old:

```astro
<!-- 98.css Framework -->
<link rel="stylesheet" href="/98.css" />
```

New:

```astro
<!-- 98.css Framework -->
<link rel="stylesheet" href="/98.css" />
<!-- 主题变量与 98.css 重新着色：放在 public/ 以便 RSS 预览页（feed-style.js）复用 -->
<link rel="stylesheet" href="/theme.css" />
```

- [ ] **Step 4.3: Build and verify**

```bash
pnpm build
ls dist/theme.css
grep -c 'href="/theme.css"' dist/index.html dist/en/index.html dist/about/index.html
grep -rn "styles/theme.css" src && echo "STALE-IMPORT-FOUND" || echo "no-stale-imports"
```

Expected: `dist/theme.css` exists; each grep count is `1`; `no-stale-imports`.

- [ ] **Step 4.4: Commit**

```bash
git add -A
git commit -m "refactor(theme): serve theme.css from public for reuse

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Feed preview script `public/feed-style.js`

**Files:**
- Create: `public/feed-style.js`

Design constraints (from spec §3a): vanilla JS, no dependencies; only acts when the document root is `rss`; UI language from `<language>` (zh prefix → Chinese, else English); theme resolution identical to BaseHead's pre-paint script; all feed-derived strings inserted via `textContent`/`createTextNode` (XSS-safe); inline CSS is layout-only — every color comes from a `var(--…)` defined in `/theme.css`.

- [ ] **Step 5.1: Create `public/feed-style.js`** with exactly:

```js
/*!
 * feed-style.js — renders this site's RSS feeds as a human-friendly page in browsers.
 * Based on rss-style.js by Andrew Marcuse, https://www.rss.style/ (MIT License).
 * Adapted for blog.gujiakai.me: Win98 look via /98.css + /theme.css, zh/en UI, light/dark theme.
 * Feed readers ignore this script element; it only runs when a browser renders the XML.
 */
(function () {
	'use strict';

	var NS = 'http://www.w3.org/1999/xhtml';

	var STRINGS = {
		zh: {
			pageTitle: 'RSS 订阅源',
			intro: '这是本站的 RSS 订阅源，供 RSS 阅读器使用，不是普通网页。把下面的链接复制到你的 RSS 阅读器即可订阅本站更新。',
			copy: '复制',
			copied: '已复制！',
			visit: '访问网站 →',
			recent: '最近更新',
			count: function (n) { return n + ' 篇文章'; },
			dateLocale: 'zh-CN',
			htmlLang: 'zh-CN',
		},
		en: {
			pageTitle: 'RSS Feed',
			intro: 'This is the RSS feed for this site, meant for RSS readers rather than browsers. Copy the link below into your news reader to subscribe.',
			copy: 'Copy',
			copied: 'Copied!',
			visit: 'Visit Website →',
			recent: 'Recent Posts',
			count: function (n) { return n + (n === 1 ? ' post' : ' posts'); },
			dateLocale: 'en-US',
			htmlLang: 'en',
		},
	};

	/* 仅排版；所有颜色来自 /theme.css 的变量，跟随站点亮暗主题 */
	var PAGE_CSS = [
		'html, body { margin: 0; padding: 0; }',
		'body { background: var(--desktop); display: flex; justify-content: center; padding: 2em 0.5em; box-sizing: border-box; min-height: 100vh; }',
		'.feed-window { width: 100%; max-width: 720px; height: fit-content; }',
		'.window-body a { color: var(--link); }',
		'.window-body a:hover { color: var(--link-hover); }',
		'.window-body h2 { color: var(--heading); font-size: 1.1em; margin: 1.25em 0 0.5em; }',
		'.feed-url-row { display: flex; gap: 6px; margin: 1em 0; }',
		'.feed-url-row input { flex: 1; min-width: 0; }',
		'.post-list { list-style: none; margin: 0; padding: 0; }',
		'.post-list li { padding: 0.75em 0; border-bottom: 1px solid var(--border); }',
		'.post-list li:last-child { border-bottom: none; }',
		'.post-date { color: var(--text-muted); font-size: 0.9em; margin: 0.15em 0; }',
		'.post-desc { color: var(--text-secondary); margin: 0.25em 0 0; }',
	].join('\n');

	function el(tag, attrs, children) {
		var node = document.createElementNS(NS, tag);
		if (attrs) {
			for (var key in attrs) node.setAttribute(key, attrs[key]);
		}
		if (children) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
			}
		}
		return node;
	}

	function textOf(parent, selector) {
		var node = parent.querySelector(selector);
		return node ? node.textContent : '';
	}

	/* 与 BaseHead.astro 的预绘制脚本保持一致 */
	function resolveTheme() {
		var theme = null;
		try {
			theme = localStorage.getItem('theme');
		} catch (e) {}
		if (theme !== 'light' && theme !== 'dark') {
			theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return theme;
	}

	function formatDate(rfc822, locale) {
		var date = new Date(rfc822);
		if (isNaN(date.getTime())) return rfc822;
		return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function render() {
		/* 只处理 RSS 文档，避免被其他页面误用 */
		if (!document.documentElement || document.documentElement.nodeName !== 'rss') return;
		var channel = document.querySelector('channel');
		if (!channel) return;

		var language = textOf(document, 'channel > language').toLowerCase();
		var t = language.indexOf('zh') === 0 ? STRINGS.zh : STRINGS.en;

		var feedTitle = textOf(document, 'channel > title') || 'RSS';
		var feedDescription = textOf(document, 'channel > description');
		/* RSS 的 <link> 无属性；atom:link 带 rel="self"，据此区分 */
		var homeLinkEl = document.querySelector('channel > link:not([rel])');
		var homeLink = homeLinkEl ? homeLinkEl.textContent : '';
		var items = document.querySelectorAll('channel > item');
		var pageTitle = feedTitle + ' — ' + t.pageTitle;

		var htmlRoot = el('html', { 'data-theme': resolveTheme(), lang: t.htmlLang });

		htmlRoot.appendChild(
			el('head', null, [
				el('meta', { charset: 'utf-8' }),
				el('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
				el('title', null, [pageTitle]),
				el('link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }),
				el('link', { rel: 'stylesheet', href: '/98.css' }),
				el('link', { rel: 'stylesheet', href: '/theme.css' }),
				el('style', null, [PAGE_CSS]),
			])
		);

		var windowBody = el('div', { class: 'window-body' });
		windowBody.appendChild(el('p', null, [t.intro]));
		if (feedDescription) {
			windowBody.appendChild(el('p', { class: 'post-desc' }, [feedDescription]));
		}

		var urlInput = el('input', { type: 'text', readonly: 'readonly', value: window.location.href });
		var copyBtn = el('button', { type: 'button' }, [t.copy]);
		copyBtn.addEventListener('click', function () {
			function done() {
				copyBtn.textContent = t.copied;
				setTimeout(function () {
					copyBtn.textContent = t.copy;
				}, 2000);
			}
			function fallback() {
				urlInput.focus();
				urlInput.select();
				try {
					document.execCommand('copy');
					done();
				} catch (e) {}
			}
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(urlInput.value).then(done, fallback);
			} else {
				fallback();
			}
		});
		var urlRow = el('div', { class: 'feed-url-row' }, [urlInput, copyBtn]);
		if (homeLink) {
			var visitBtn = el('button', { type: 'button' }, [t.visit]);
			visitBtn.addEventListener('click', function () {
				window.location.href = homeLink;
			});
			urlRow.appendChild(visitBtn);
		}
		windowBody.appendChild(urlRow);

		windowBody.appendChild(el('h2', null, [t.recent]));
		var list = el('ul', { class: 'post-list' });
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			list.appendChild(
				el('li', null, [
					el('a', { href: textOf(item, 'link') }, [el('strong', null, [textOf(item, 'title')])]),
					el('p', { class: 'post-date' }, [formatDate(textOf(item, 'pubDate'), t.dateLocale)]),
					el('p', { class: 'post-desc' }, [textOf(item, 'description')]),
				])
			);
		}
		windowBody.appendChild(list);

		htmlRoot.appendChild(
			el('body', null, [
				el('div', { class: 'window feed-window' }, [
					el('div', { class: 'title-bar' }, [
						el('div', { class: 'title-bar-text' }, [pageTitle]),
						el('div', { class: 'title-bar-controls' }, [
							el('button', { 'aria-label': 'Minimize', tabindex: '-1' }),
							el('button', { 'aria-label': 'Maximize', tabindex: '-1' }),
							el('button', { 'aria-label': 'Close', tabindex: '-1' }),
						]),
					]),
					windowBody,
					el('div', { class: 'status-bar' }, [
						el('p', { class: 'status-bar-field' }, [t.count(items.length)]),
					]),
				]),
			])
		);

		document.replaceChild(htmlRoot, document.documentElement);
		document.title = pageTitle;
	}

	if (document.readyState === 'complete') {
		render();
	} else {
		document.onreadystatechange = function () {
			if (document.readyState === 'complete') render();
		};
	}
})();
```

Implementation notes:
- The title-bar control buttons are decorative (standard 98.css chrome); `tabindex="-1"` keeps them out of tab order.
- `channel > link:not([rel])` matters once Task 6 adds `<atom:link rel="self">` — both have localName `link` in the XML DOM.
- The double readyState handling covers the script executing before or after the XML document finishes parsing.

- [ ] **Step 5.2: Syntax-check and verify it ships in the build**

```bash
node --check public/feed-style.js && echo SYNTAX-OK
pnpm build
ls dist/feed-style.js
```

Expected: `SYNTAX-OK`; `dist/feed-style.js` listed.

- [ ] **Step 5.3: Commit**

```bash
git add public/feed-style.js
git commit -m "feat(rss): add win98-styled feed preview script

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Inject the script + `atom:link` self into both feeds

**Files:**
- Modify: `src/pages/rss.xml.js`
- Modify: `src/pages/en/rss.xml.js`

Changes vs Task 2 state: import `getRssString` instead of `rss`, add `xmlns` + `atom:link` in options, insert the script element immediately before `<channel>` (first occurrence — it directly follows the `<rss …>` opening tag; this is the placement rss.style uses on its own feed), return an explicit `Response`.

- [ ] **Step 6.1: Rewrite `src/pages/rss.xml.js`** to exactly:

```js
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
```

- [ ] **Step 6.2: Rewrite `src/pages/en/rss.xml.js`** to exactly:

```js
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
```

- [ ] **Step 6.3: Build and verify the XML**

```bash
pnpm build
head -c 500 dist/rss.xml; echo
grep -c 'feed-style.js' dist/rss.xml dist/en/rss.xml
grep -c '<atom:link ' dist/rss.xml dist/en/rss.xml
grep -o '<link>[^<]*</link>' dist/rss.xml | diff - /tmp/feed-baseline/zh-links.txt && echo ZH-LINKS-OK
grep -o '<link>[^<]*</link>' dist/en/rss.xml | diff - /tmp/feed-baseline/en-links.txt && echo EN-LINKS-OK
python3 -c "
import xml.etree.ElementTree as ET
for f in ['dist/rss.xml', 'dist/en/rss.xml']:
    root = ET.parse(f).getroot()
    print(f, root.tag, len(root.findall('.//item')), 'items')
"
```

Expected:
- `head` shows `<?xml version="1.0" encoding="UTF-8"?><rss … xmlns:atom="http://www.w3.org/2005/Atom"><script src="/feed-style.js" xmlns="http://www.w3.org/1999/xhtml"></script><channel>…`
- `feed-style.js` count: `1` per file; `<atom:link ` count: `1` per file
- `ZH-LINKS-OK` and `EN-LINKS-OK` (post URLs unchanged → acceptance criterion 3)
- python3 parses both files without error (strict XML parser = criterion 2's "valid XML") and item counts match the Task 1 baseline numbers

- [ ] **Step 6.4: Commit**

```bash
git add src/pages/rss.xml.js src/pages/en/rss.xml.js
git commit -m "feat(rss): render feeds as styled pages in browsers

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: End-to-end verification (browser + acceptance criteria sweep)

No code changes expected. If a fix is needed, make it, re-run the relevant task verification, and commit the fix separately.

- [ ] **Step 7.1: Serve the built site**

```bash
pnpm preview
```

(Runs on http://localhost:4321 — leave running in background.)

- [ ] **Step 7.2: Browser checks via webapp-testing skill (Playwright), or manually if unavailable.** Check matrix:

| URL | Expect |
|---|---|
| `/rss.xml` | Win98 window titled `凯记 — RSS 订阅源`; Chinese intro; URL input + 复制 + 访问网站 → buttons; post list with Chinese dates (e.g. 2025年7月30日); status bar `17 篇文章` (current count) |
| `/en/rss.xml` | Same window in English: `Kai's Notes — RSS Feed`, Copy / Visit Website →, English dates, `12 posts` (current count) |
| `/rss.xml` with `localStorage.theme = 'dark'` (set via homepage toggle or devtools) | Black desktop background, dark window colors (theme.css `data-theme='dark'` vars applied) |
| `/rss.xml` with localStorage cleared + dark OS preference (Playwright: `colorScheme: 'dark'`) | Dark theme via `prefers-color-scheme` fallback |
| `/` and `/about/`, light + dark | Site looks unchanged after the theme.css move (criterion 5) |

Functional clicks: 复制/Copy button → input URL lands on clipboard and label flips to 已复制！/Copied! for ~2s; 访问网站/Visit Website → navigates to the site home.

Playwright notes for the executor: drive `page.goto('http://localhost:4321/rss.xml')`, assert `div.title-bar-text` text, count `ul.post-list li`, screenshot light/dark for the user. Clipboard needs `--grant-permissions clipboard-write` or just assert the label flip.

- [ ] **Step 7.3: Feed-reader smoke test (criterion 6)** — strict XML parse + item titles/links identical to baseline:

```bash
python3 -c "
import xml.etree.ElementTree as ET

def items(path):
    return [(i.findtext('title'), i.findtext('link')) for i in ET.parse(path).getroot().findall('.//item')]

for new, old in [('dist/rss.xml', '/tmp/feed-baseline/rss.xml'), ('dist/en/rss.xml', '/tmp/feed-baseline/en-rss.xml')]:
    assert items(new) == items(old), f'{new} items differ from baseline'
    print(new, 'items identical to baseline')
"
```

Expected: both `items identical to baseline` lines, no assertion error.

- [ ] **Step 7.4: Acceptance criteria sweep** — re-read spec §Acceptance criteria 1–6 and confirm each is now demonstrated (1: Task 3.2/3.3; 2: Task 6.3; 3: Task 6.3 links diff; 4: Step 7.2; 5: Step 7.2; 6: Step 7.3). Record any deviation in the spec's addendum section.

---

## Out of Scope (from spec)

- `/llms-full.txt`, per-post `.md` endpoints
- Refactoring the 6 `.astro` pages onto `getPostPath` (follow-up)
- Feed item caps / Atom variant / `<head>` link to llms.txt

## Known Accepted Trade-offs (don't "fix" these)

- W3C feed validator warns about the foreign `<script>` element — rss.style's own feed has the same warning; feed readers ignore namespaced foreign elements.
- Brief unstyled flash on first-ever feed page load while `/98.css` + `/theme.css` fetch (cacheable; same as upstream rss.style).
- theme.css is no longer minified by Astro (~4 KB, load-order-independent selectors).
