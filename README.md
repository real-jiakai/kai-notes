# Kai's Notes (凯记)

A bilingual personal blog about AI, projects, and personal growth. It is built with Astro 7; Chinese is the default language and English pages live under `/en/`.

## Requirements

- Node.js 24.18.0
- pnpm 10.34.5

The exact versions are also recorded in `package.json`, Netlify configuration, and CI. Install dependencies with:

```sh
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install --frozen-lockfile
```

## Development

```sh
pnpm dev       # sync generated public assets and start Astro
pnpm check     # verify remote-image metadata and run astro check
pnpm build     # run checks, sync assets, build, and finalize CSP hashes
pnpm preview   # preview the completed dist directory
```

The asset sync is implemented in Node.js and works on Windows, macOS, and Linux.

## Content

Posts are Markdown or MDX files in `src/content/blog/`. English translations belong in `src/content/blog/en/` and must set `lang: 'en'`. Keep a translation's publication date and slug aligned with its Chinese source so language switching can find the counterpart.

Remote Markdown images use a committed intrinsic-dimension map to prevent layout shift without network access during builds. After adding, removing, or replacing an image URL, refresh and commit the map:

```sh
pnpm images:refresh
pnpm check:images
```

`images:refresh` downloads image headers/content to read metadata; ordinary checks and builds are fully offline with respect to those images.

## Site URL and deployment

Canonical URLs and the sitemap use `SITE_URL`. Local builds default to `https://blog.gujiakai.me`; deploy previews use Netlify's `DEPLOY_PRIME_URL`, while production is pinned in `netlify.toml`.

```sh
SITE_URL=https://example.com pnpm build
```

On PowerShell:

```powershell
$env:SITE_URL = 'https://example.com'
pnpm build
```

Netlify's build command and publish directory are committed in `netlify.toml`. Security and caching policy lives in `public/_headers`; the final build step replaces the temporary inline-script CSP allowance with deterministic SHA-256 hashes in `dist/_headers`.

## License and acknowledgements

Original code and content are not licensed for redistribution; see `LICENSE`. Notices for bundled third-party assets are in `THIRD_PARTY_NOTICES.md`.

Built with Astro, 98.css, and assistance from GitHub Copilot, Trae SOLO, Claude Code, and Codex.
