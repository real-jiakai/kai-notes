# Dark Mode Design — 凯记 (Kai's Notes)

**Date:** 2026-06-11
**Status:** Approved by user (brainstorming session with visual mockups)

## Goal

Add a dark mode to the Astro blog while preserving its Windows 98 aesthetic. The dark
theme is **High Contrast Black** — inspired by Win98's built-in High Contrast scheme:
pure black surfaces, white text, cyan links, with the classic navy title bar gradient
kept in both modes.

## Decisions (made during brainstorming)

| Decision | Choice |
|---|---|
| Dark palette | High Contrast Black (pure black, white text, cyan links) |
| Theme selection | System preference on first visit; manual toggle overrides; choice persisted in `localStorage` |
| Toggle placement | Nav bar button (desktop `nav-right` + mobile hamburger menu entry) |
| Implementation | CSS custom properties refactor (no override-stylesheet, no filter inversion) |

## Architecture

### Theme variables (`src/styles/theme.css`, new file)

Defines the palette once. `:root` carries light values (pixel-identical to the current
site); `html[data-theme="dark"]` redefines them. Imported in `BaseHead.astro` so every
page gets it. Its 98.css re-skin rules must take precedence over the `/98.css` `<link>`
— via load order, or a minimal specificity bump (e.g. `html .window`) if Astro's style
injection order can't guarantee it; verified during implementation.

| Variable | Light (current) | Dark (HC Black) |
|---|---|---|
| `--desktop` (page bg) | `#c0c0c0` | `#000000` |
| `--surface` (window/button face) | `#c0c0c0` | `#000000` |
| `--text` | `#000000` | `#ffffff` |
| `--text-secondary` (descriptions) | `#404040` | `#b3b3b3` |
| `--text-muted` (dates) | `#666666` | `#999999` |
| `--heading` | `#000080` | `#ffffff` |
| `--link` | `#000080` | `#5ad1ff` |
| `--link-hover` | `#0000ff` | `#8ee0ff` |
| `--bevel-dark-outer` | `#0a0a0a` | `#000000` |
| `--bevel-dark` | `#808080` (grey) | `#444444` |
| `--bevel-light` | `#dfdfdf` | `#aaaaaa` |
| `--bevel-light-outer` | `#ffffff` | `#ffffff` |
| `--border` | `#808080` | `#666666` |
| `--content-bg` (table cells, inputs) | `#ffffff` | `#0d0d0d` |
| `--code-bg` | `#f0f0f0` | `#121212` |
| `--tooltip-bg` (lightbox caption) | `#ffffcc` | `#1a1a00` |
| `--tooltip-text` | `#000000` | `#ffff99` |
| `--titlebar-1` → `--titlebar-2` | `#000080` → `#1084d0` | same (kept for identity) |

The title bar gradient, and the white-on-navy title text, are intentionally identical in
both modes (per the approved mockup).

### 98.css framework re-skin

The shipped `public/98.css` (v0.1.21) contains zero CSS variables. `theme.css` therefore
re-declares the framework rules the site actually uses, expressed with the variables
above: `body` text color, `.window` face + bevel shadows, `.title-bar`, `button` (raised
+ active states), `pre`, `a`, and WebKit scrollbar colors. Light values reproduce the
current rendering exactly, so this is a no-op until dark mode is active. 98.css itself
is not edited.

### Component refactor (color → `var()`)

Mechanical replacement of hardcoded hexes in:

- `src/components/Navigation.astro` (nav bg, links, hamburger, mobile menu)
- `src/components/Footer.astro`
- `src/components/BackToTop.astro`
- `src/layouts/BlogPost.astro` (article header/content/nav links, code, blockquote, comments title)
- `src/pages/index.astro`, `src/pages/[...page].astro` + `en/` twins (article list, pagination)
- `src/pages/about.astro` + `en/` twin
- `src/styles/98-custom.css` (article tables, lightbox window/caption)

Astro-scoped styles keep their scoping; only the color values move into variables, so
specificity is unaffected.

### Images in dark mode

`html[data-theme="dark"]` applies `filter: brightness(0.9)` to `.article-content img`
and the lightbox image so photos don't glare against pure black. No change in light mode.

## Toggle mechanics

### Pre-paint theme resolution (no FOUC)

An inline `is:inline` script at the top of `BaseHead.astro`'s output (inside `<head>`),
before any stylesheet paints content:

```js
(function () {
  let theme = null;
  try { theme = localStorage.getItem('theme'); } catch (e) {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
})();
```

`data-theme` is always set explicitly (`light` or `dark`); CSS only branches on
`[data-theme="dark"]`.

### Nav bar toggle button

- A `<button>` styled like the existing `.nav-link` outset bevel, in desktop `nav-right`
  (after the language link) and as a row in the mobile hamburger menu.
- Icon shows the **target** mode: 🌙 while light ("switch to dark"), ☀️ while dark.
- Click: flip `data-theme`, `try`-persist to `localStorage.theme`, swap icon, update
  `theme-color` meta, notify utterances iframe.
- Accessibility: `aria-label` from new i18n keys in `src/i18n/ui.ts` —
  `theme.toggle` = `切换深色/浅色模式` (zh) / `Toggle dark/light mode` (en).

### `theme-color` meta

`<meta name="theme-color">` in `BaseHead`, set to `#c0c0c0` (light) / `#000000` (dark)
by the inline script and updated on toggle.

## Comments (utterances)

The hardcoded `theme="github-light"` script tag in `BlogPost.astro` is replaced by a
small script that injects the utterances `<script>` with the initial theme matching the
current mode (`github-light` / `github-dark`). The toggle button additionally posts

```js
iframe.contentWindow.postMessage(
  { type: 'set-theme', theme: 'github-dark' /* or github-light */ },
  'https://utteranc.es'
);
```

so already-loaded comments flip live.

## Edge cases

- **`localStorage` unavailable** (private browsing / blocked): all reads/writes wrapped
  in `try/catch`; theme falls back to system preference per page load; toggle still
  works for the current page view.
- **No JavaScript:** no `data-theme` is set → light theme. Accepted limitation.
- **RSS / sitemap:** untouched (no HTML styling involved).
- **Lightbox overlay:** already dark (`rgba(0,0,0,.7)`); its window chrome follows the
  variables like everything else.

## Out of scope

- Additional palettes (charcoal / slate) or a theme picker — variables make this easy
  later, but not now.
- Live `matchMedia` change listener (preference re-evaluated per page load only).
- Dark theme for no-JS visitors.
- Editing `public/98.css` itself.

## Acceptance criteria

1. `pnpm build` succeeds.
2. With OS set to dark and no stored choice, first paint is dark — no light flash.
3. Toggle flips the theme instantly and persists across reloads and page navigation.
4. Light mode renders pixel-identical to the current site.
5. Both themes correct on: home list, pagination pages, article page (headings, links,
   tables, code blocks, blockquote, images, lightbox + caption, prev/next buttons),
   about page, nav (desktop + mobile menu), footer, back-to-top button.
6. Utterances comments load matching the active theme and flip live on toggle.
7. Both language trees (`/` and `/en/`) behave identically; toggle aria-label localized.
8. Private-browsing visit (no `localStorage`) renders by system preference without
   console errors.

## Testing approach

No test infrastructure exists in the repo. Verification is `pnpm build` plus a manual /
Playwright-driven pass over the acceptance criteria in both themes and both languages.
