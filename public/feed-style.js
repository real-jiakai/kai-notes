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
