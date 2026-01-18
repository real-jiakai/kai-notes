# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based personal blog called "凯记" (Kai's Notes). The site is configured for `https://blog.gujiakai.me` and focuses on AI, personal development, and growth-related content. The site supports both Chinese and English languages.

## Development Commands

- `pnpm dev` - Start development server

## Tools

You can use the Context7 MCP Integration to access technical documentation for Astro, 98.css, pnpm, and more.

## Architecture

### Content Management
- Blog posts are stored in `src/content/blog/` as Markdown/MDX files
- Content collection uses Astro's new loader system with glob pattern for `**/*.{md,mdx}`
- Frontmatter schema includes: title, description, pubDate, slug, draft, lang (zh/en)

### Site Structure
- **Pages**: Dynamic routing with `[year]/[month]/[...slug].astro` for blog posts
- **Pagination**: Handled by `[...page].astro` for post listings
- **Components**: Modular Astro components in `src/components/`
- **Layouts**: `BlogPost.astro` for individual post layout
- **Styling**: Uses 98.css framework with custom styles in `src/styles/98-custom.css`

### Configuration
- Site URL: `https://blog.gujiakai.me`
- Integrations: MDX and Sitemap
- TypeScript: Strict configuration with null checks enabled
- RSS feed available at `/rss.xml`

### Internationalization (i18n)
- **Languages**: Chinese (default) and English
- **URL Structure**:
  - Chinese: `/` (no prefix, e.g., `/about/`, `/2025/07/post-slug/`)
  - English: `/en/` prefix (e.g., `/en/about/`, `/en/2025/07/post-slug/`)
- **Translation files**: `src/i18n/ui.ts` contains UI translations, `src/i18n/utils.ts` has helper functions
- **Post language**: Set `lang: 'en'` in frontmatter for English posts (default is Chinese)

### Constants
Site metadata defined in `src/consts.ts`:
- SITE_TITLE: '凯记'
- SITE_DESCRIPTION: '专注于分享AI、个人折腾、个人成长心得等方面的知识'

## Content Guidelines

Posts should include proper frontmatter with at least title, description, and pubDate. Optional fields include heroImage, slug, updatedDate, draft status for unpublished content, and lang for the post language.

Example frontmatter for an English post:
```yaml
---
title: 'My English Post'
description: 'A description of the post'
pubDate: 2025-01-17
lang: 'en'
---
```