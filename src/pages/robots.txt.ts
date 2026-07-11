import type { APIContext } from 'astro';

export const prerender = true;

export function GET({ site }: APIContext) {
	if (!site) throw new Error('Astro site URL is required to generate robots.txt');

	const content = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${new URL('sitemap-index.xml', site).href}`,
		'',
	].join('\n');

	return new Response(content, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
