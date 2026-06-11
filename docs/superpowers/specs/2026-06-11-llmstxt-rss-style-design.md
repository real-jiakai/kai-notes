# llms.txt + Styled RSS Feeds Design — 凯记 (Kai's Notes)

Date: 2026-06-11
Status: approved

## Goal

Two related discoverability improvements:

1. **`/llms.txt`** — an auto-generated, spec-compliant ([llmstxt.org](https://llmstxt.org/)) Markdown index of the site so AI assistants can navigate it efficiently.
2. **Styled RSS feeds** — when a human opens `/rss.xml` or `/en/rss.xml` in a browser, render a friendly Win98-themed preview page instead of raw XML, following the JavaScript approach from [rss.style](https://www.rss.style/). Feed readers are unaffected.

## Decisions (made during brainstorming)

- **llms.txt only** — no `/llms-full.txt`, no per-post `.md` endpoints. The index links to existing HTML pages.
- **Custom self-hosted feed script** — adapted from rss.style's MIT-licensed `rss-style.js`, not hotlinked and not used verbatim. Reasons: no external runtime dependency (rss.style may be slow/unreachable for readers in China), bilingual UI text, and a preview page that matches the blog's 98.css theme.
- **No XSLT** — Chrome removes XSLT in v158 (Nov 2026); Firefox/WebKit follow ([source](https://developer.chrome.com/docs/web-platform/deprecating-xslt)). The classic `<?xml-stylesheet?>` approach is a dead end.
- **Feed preview supports dark mode** — via the site's existing `data-theme` mechanism; `theme.css` moves to `public/` so the feed page can reuse it (see §4).
- Design approved by user 2026-06-11 (all four sections, no revisions).

## 1. `/llms.txt` endpoint

New file: `src/pages/llms.txt.ts` (static endpoint, same pattern as `rss.xml.js`).

Output structure (per llmstxt.org spec: H1 → blockquote summary → link sections; `## Optional` is a spec keyword meaning "skippable when context is tight"):

```markdown
# 凯记 (Kai's Notes)

> 专注于分享AI、个人折腾、个人成长心得等方面的知识。
> A bilingual (Chinese/English) personal blog about AI, tinkering, and personal growth.

中文内容位于站点根路径；English content lives under the /en/ prefix.

## 文章 (Chinese Posts)

- [标题](https://blog.gujiakai.me/2025/07/slug/)：description

## English Posts

- [Title](https://blog.gujiakai.me/en/2025/07/slug/): description

## 页面 (Pages)

- [关于](https://blog.gujiakai.me/about/)：关于本站与作者
- [About](https://blog.gujiakai.me/en/about/): About this site and the author

## Optional

- [RSS Feed（中文）](https://blog.gujiakai.me/rss.xml)
- [RSS Feed (English)](https://blog.gujiakai.me/en/rss.xml)
- [Sitemap](https://blog.gujiakai.me/sitemap-index.xml)
```

Details:

- Posts sorted newest-first; drafts excluded; descriptions from frontmatter.
- Absolute URLs built from `context.site` + the shared `getPostPath()` helper (§2).
- Titles/descriptions are plain Markdown text (no escaping concerns beyond what frontmatter already contains).
- Returned as `text/plain; charset=utf-8`; in the static build Netlify serves `.txt` as `text/plain` regardless.
- Site title/description come from `SITE_TITLE_I18N` / `SITE_DESCRIPTION_I18N` in `src/consts.ts`.

## 2. Shared post-URL helper

New file: `src/utils/posts.ts`. The `year/month/slug` URL logic is currently duplicated in 8 files (`index.astro` ×2, `[...page].astro` ×2, `[year]/[month]/[...slug].astro` ×2, `rss.xml.js` ×2); llms.txt would make 9.

```ts
import type { CollectionEntry } from 'astro:content';

/** Published (non-draft) posts for a language, newest first. */
export async function getPublishedPosts(lang: 'zh' | 'en'): Promise<CollectionEntry<'blog'>[]>;

/** Site-relative path for a post, e.g. /2025/07/slug/ or /en/2025/07/slug/. */
export function getPostPath(post: CollectionEntry<'blog'>): string;
```

- `getPublishedPosts('zh')` matches the existing feed filter exactly: `draft !== true && (lang === 'zh' || lang === undefined)` — posts without a `lang` field are Chinese. `getPublishedPosts('en')` requires `lang === 'en'`.
- `getPostPath` derives lang from `post.data.lang` (`'en'` → `/en/` prefix, else root), year/month from `pubDate`, slug from `post.data.slug || post.id` with the `en/` id prefix stripped — byte-for-byte the same URLs as today.
- Consumers in this change: `llms.txt.ts`, both `rss.xml.js`. The 6 `.astro` pages keep their inline copies (follow-up refactor, out of scope).

## 3. Styled RSS feeds

### 3a. Feed preview script — `public/feed-style.js`

Self-contained vanilla JS (~180 lines), MIT license header crediting rss.style/Andrew Marcuse as the basis. Served unbundled from `public/` so the feed XML can reference it at a stable URL.

Behavior (runs only when a browser renders the XML document; feed readers never execute it):

1. On `document.readyState === 'complete'`, bail unless the document root element is `rss`.
2. Read from the feed DOM: `channel > title`, `description`, `link` (home URL), `language`, and all `item`s (`title`, `link`, `pubDate`, `description`).
3. UI language: `<language>` starts with `zh` → Chinese strings, else English. (Both feeds already emit `<language>` via `customData`.)
4. Theme: replicate BaseHead's resolution exactly — `localStorage.getItem('theme')` (`'light'`/`'dark'`), else `prefers-color-scheme`; wrapped in try/catch. Set `data-theme` on the generated `<html>` element before insertion (no FOUC).
5. Build an XHTML DOM via `createElementNS('http://www.w3.org/1999/xhtml', …)`:
   - `<head>`: `<meta viewport>`, `<title>`, `<link href="/98.css">`, `<link href="/theme.css">`, small inline `<style>` for layout only (centered window on `var(--desktop)` background, spacing) — no color values, all colors come from theme.css variables.
   - `<body>`: one 98.css `.window`:
     - `.title-bar` with feed title + decorative title-bar-controls.
     - `.window-body`:
       - Explanation paragraph: "这是本站的 RSS 订阅源，供 RSS 阅读器使用。把下面的链接复制到你的阅读器即可订阅。" / English equivalent.
       - Feed URL row: readonly `<input>` with `window.location.href` + **复制/Copy** button (`navigator.clipboard.writeText`, fallback to select+`document.execCommand('copy')`; button label flips to 已复制/Copied! briefly) + **访问网站/Visit Website →** button navigating to the channel home link.
       - Post list ("最近更新" / "Recent Posts"): every feed item as linked title + localized date (`toLocaleDateString('zh-CN' | 'en-US')`) + description text.
     - `.status-bar` with a `.status-bar-field` showing the post count (e.g. "17 篇文章" / "17 posts").
6. Replace `document.documentElement` with the generated tree. (`view-source` still shows XML; inspect shows HTML — same trick as rss.style.)
7. All feed-derived strings inserted via `createTextNode`/`textContent` — XSS-safe by construction.

### 3b. Feed endpoint changes — both `src/pages/rss.xml.js` and `src/pages/en/rss.xml.js`

- Switch `rss(opts)` → `await getRssString(opts)` (same options object otherwise).
- Inject the script element by inserting before `<channel>` (first occurrence — it appears immediately after the `<rss …>` opening tag, the exact placement rss.style uses on its own feed):
  `<script src="/feed-style.js" xmlns="http://www.w3.org/1999/xhtml"></script>`
- Add the validator-recommended self link: `xmlns` option `{ atom: 'http://www.w3.org/2005/Atom' }` + `<atom:link href="…rss.xml" rel="self" type="application/rss+xml"/>` in `customData`.
- Return `new Response(styledXml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })`.
- Post filtering/sorting moves to `getPublishedPosts()`; link building to `getPostPath()`. Item content rendering (markdown-it + sanitize-html) is unchanged.
- Live verification already done: the deployed feed serves `content-type: application/xml`, which the script approach requires (rss.style: must be `text/xml`/`application/xml`).

### Accepted trade-offs

- W3C feed validator warns about the foreign `<script>` element (rss.style's own feed has the same warning). Feed readers ignore namespaced foreign elements; curl/non-browser consumers see valid XML.
- First-ever visit may flash unstyled briefly while `/98.css` + `/theme.css` load (same behavior as upstream rss.style; both files are cacheable).
- JS disabled → raw XML, same as today.

## 4. theme.css moves to `public/`

To let the feed preview reuse the site's full Win98 light/dark recoloring without duplication:

- Move `src/styles/theme.css` → `public/theme.css` (content unchanged; update its header comment path reference).
- `src/components/BaseHead.astro`: remove `import '../styles/theme.css'`; add `<link rel="stylesheet" href="/theme.css" />` immediately after the existing `/98.css` link.
- Why safe: theme.css's selectors are deliberately `html`-prefixed to beat 98.css "无论加载顺序如何" (per its own comment), so load order doesn't change behavior. The pre-paint `data-theme` inline script in BaseHead runs before either stylesheet, exactly as before.
- Trade-off: theme.css (~4 KB) is no longer minified/bundled by Astro; it gains a stable URL and is shared by the site and the feed page. Site-specific selectors in it (nav, article, lightbox) simply don't match on the feed page — harmless.

## Edge cases

- `localStorage` unavailable on feed page (private mode) → falls back to `prefers-color-scheme`, mirroring BaseHead.
- Feed with zero items (e.g. hypothetical new language) → preview still renders header/explanation; empty list is acceptable.
- Posts with custom `slug` frontmatter and en-prefixed ids → handled by `getPostPath` identically to current logic.
- `<language>` missing → script defaults to English strings (defensive; both feeds do emit it).
- Browsers without `navigator.clipboard` (http/old) → execCommand fallback.

## Out of scope

- `/llms-full.txt` and per-post `.md` endpoints (explicitly declined).
- Refactoring the 6 `.astro` pages onto `getPostPath` (follow-up).
- Atom feed variant; feed pagination/item caps (feeds keep including all posts).
- Linking llms.txt from HTML `<head>` (no established convention).

## Acceptance criteria

1. `pnpm build` succeeds; `dist/llms.txt` exists, starts with `# 凯记`, contains every published post's absolute URL and no draft posts.
2. `dist/rss.xml` and `dist/en/rss.xml` contain the `feed-style.js` script element directly before `<channel>`, an `atom:link rel="self"`, and parse as valid XML.
3. Feed URLs are byte-identical to current production URLs (helper introduces no URL drift).
4. In a browser via `pnpm preview`: `/rss.xml` shows the Chinese Win98 preview window, `/en/rss.xml` the English one; both follow light/dark per the site toggle's stored preference; copy button works.
5. Site pages look identical to before the theme.css move (light and dark).
6. A feed reader (or `npx rss-parser`-style smoke check) still parses both feeds and sees identical items to before.

## Testing approach

Build-output assertions via `pnpm build` + grep for criteria 1–3; manual browser pass for 4–5 (light/dark × zh/en matrix); any RSS parsing library for 6. No test framework exists in this repo — verification is scripted checks + manual, matching how the dark-mode work was verified.
