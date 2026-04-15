# AGENTS.md

## Project Snapshot

- Astro-based personal blog.
- Default language is Chinese (`zh`); English lives under the `/en/` URL prefix.
- Blog content is loaded from `src/content/blog/**/*.{md,mdx}` through `src/content.config.ts`.
- Post routes are generated from `pubDate` plus `slug` or file id.

## Main Commands

- `pnpm dev` - start the local Astro dev server
- `pnpm build` - run the production build and catch content/schema errors

## Key Paths

- `src/content/blog/` - Chinese source posts
- `src/content/blog/en/` - English posts
- `src/i18n/ui.ts` - UI string translations
- `src/pages/` - Chinese routes
- `src/pages/en/` - English routes

## i18n Workflow For Blog Posts

1. Treat the Chinese post in `src/content/blog/` as the source article unless the task says otherwise.
2. Validate the source frontmatter first. At minimum, keep `title`, `description`, `pubDate`, and valid frontmatter fences. Add or preserve a stable `slug` when the route must stay fixed.
3. Create the English counterpart under `src/content/blog/en/`.
4. Set `lang: 'en'` in the English post frontmatter.
5. Keep `pubDate`, `draft`, hero images, reference links, and the overall markdown structure aligned with the source article unless there is a clear editorial reason to diverge.
6. If the Chinese post uses a custom `slug`, keep the English URL aligned by using the same `slug` or an English filename that resolves to the same route.
7. Translate frontmatter, headings, body copy, image alt text, and callouts into natural English. Do not leave mixed-language sections behind unless the source requires it.
8. After adding or editing content, run `pnpm build` and fix any content collection, markdown, or route issues before finishing.
9. When committing repository changes, use a conventional commit message.

## Working Rules

- Do not revert unrelated user changes.
- Prefer small, targeted edits that match the existing Astro and markdown conventions in this repo.
