export const languages = {
	zh: '中文',
	en: 'English',
};

export const defaultLang = 'zh';

export const ui = {
	zh: {
		// Site
		'site.title': '凯记',
		'site.description': '专注于分享AI、个人折腾、个人成长心得等方面的知识',

		// Navigation
		'nav.home': '首页',
		'nav.about': '关于',
		'nav.primary': '主导航',
		'nav.menu': '菜单',
		'skipToContent': '跳到主要内容',
		'theme.toggle': '切换深色/浅色模式',

		// Footer
		'footer.copyright': '版权所有',

		// Article list
		'article.list': '凯记文章列表',
		'article.list.page': '凯记文章列表 - 第{page}页',
		'article.reading': '文章阅读',
		'article.published': '发布时间',
		'article.updated': '更新时间',
		'article.prev': '上一篇',
		'article.next': '下一篇',
		'article.navigation': '文章导航',

		// Pagination
		'pagination.prev': '上一页',
		'pagination.next': '下一页',
		'pagination.label': '分页导航',
		'pagination.page': '第{page}页',

		// About page
		'about.title': '关于本站',
		'about.description': '这是顾佳凯的个人博客，使用 Astro 框架构建，采用 98.css 实现怀旧的 Windows 98 风格界面。',
		'about.techStack': '技术栈',
		'about.astro': 'Astro - 静态站点生成器',
		'about.98css': '98.css - Windows 98 风格的 CSS 框架',

		// Lightbox
		'lightbox.preview': '图片预览',
		'lightbox.close': '关闭',
		'lightbox.open': '打开图片预览：{alt}',

		// Not found page
		'notFound.title': '页面未找到',
		'notFound.description': '抱歉，你访问的页面不存在或已被移动。',
		'notFound.home': '返回首页',

		// Comments
		'comments.title': '评论',

		// Back to top
		'backToTop': '返回顶部',

		// Table of contents
		'toc.title': '本页目录',

		// Code blocks
		'code.copy': '复制代码',
		'code.copied': '已复制',
		'code.copyFailed': '复制失败',
	},
	en: {
		// Site
		'site.title': "Kai's Notes",
		'site.description': 'Sharing knowledge about AI, personal projects, and personal growth',

		// Navigation
		'nav.home': 'Home',
		'nav.about': 'About',
		'nav.primary': 'Primary navigation',
		'nav.menu': 'Menu',
		'skipToContent': 'Skip to main content',
		'theme.toggle': 'Toggle dark/light mode',

		// Footer
		'footer.copyright': 'All rights reserved',

		// Article list
		'article.list': "Kai's Notes - Articles",
		'article.list.page': "Kai's Notes - Page {page}",
		'article.reading': 'Reading',
		'article.published': 'Published',
		'article.updated': 'Updated',
		'article.prev': 'Previous',
		'article.next': 'Next',
		'article.navigation': 'Article navigation',

		// Pagination
		'pagination.prev': 'Previous',
		'pagination.next': 'Next',
		'pagination.label': 'Pagination',
		'pagination.page': 'Page {page}',

		// About page
		'about.title': 'About This Site',
		'about.description': "This is Jiakai Gu's personal blog, built with Astro framework, featuring a nostalgic Windows 98 style interface using 98.css.",
		'about.techStack': 'Tech Stack',
		'about.astro': 'Astro - Static Site Generator',
		'about.98css': '98.css - Windows 98 Style CSS Framework',

		// Lightbox
		'lightbox.preview': 'Image Preview',
		'lightbox.close': 'Close',
		'lightbox.open': 'Open image preview: {alt}',

		// Not found page
		'notFound.title': 'Page Not Found',
		'notFound.description': 'Sorry, the page you requested does not exist or has moved.',
		'notFound.home': 'Return Home',

		// Comments
		'comments.title': 'Comments',

		// Back to top
		'backToTop': 'Back to Top',

		// Table of contents
		'toc.title': 'On This Page',

		// Code blocks
		'code.copy': 'Copy code',
		'code.copied': 'Copied!',
		'code.copyFailed': 'Copy failed',
	},
} as const;
