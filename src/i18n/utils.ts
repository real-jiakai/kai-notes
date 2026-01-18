import { ui, defaultLang } from './ui';

export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
	const [, lang] = url.pathname.split('/');
	if (lang in ui) return lang as Lang;
	return defaultLang;
}

export function useTranslations(lang: Lang) {
	return function t(key: keyof (typeof ui)[typeof defaultLang], params?: Record<string, string | number>): string {
		let text = ui[lang][key] || ui[defaultLang][key];
		if (params) {
			Object.entries(params).forEach(([k, v]) => {
				text = text.replace(`{${k}}`, String(v));
			});
		}
		return text;
	};
}

export function getLocalePath(lang: Lang, path: string): string {
	if (lang === defaultLang) {
		return path;
	}
	return `/${lang}${path}`;
}

export function getAlternateLocaleUrl(currentUrl: URL, targetLang: Lang): string {
	const pathname = currentUrl.pathname;
	const currentLang = getLangFromUrl(currentUrl);

	// Remove current lang prefix if exists
	let basePath = pathname;
	if (currentLang !== defaultLang && pathname.startsWith(`/${currentLang}`)) {
		basePath = pathname.slice(currentLang.length + 1) || '/';
	}

	// Add target lang prefix if not default
	if (targetLang === defaultLang) {
		return basePath;
	}
	return `/${targetLang}${basePath}`;
}
