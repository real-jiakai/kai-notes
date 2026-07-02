import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				description: z.string(),
				// Transform string to Date object
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				heroImage: z.union([image(), z.string()]).optional(), // 支持本地图片或远程URL
				slug: z.string().optional(), // 自定义slug
				draft: z.boolean().default(false), // 草稿标记
				lang: z.enum(['zh', 'en']).default('zh'), // 文章语言，默认为中文
			})
			.refine((data) => !data.updatedDate || data.updatedDate >= data.pubDate, {
				message: 'updatedDate must not be before pubDate',
				path: ['updatedDate'],
			}),
});

export const collections = { blog };
