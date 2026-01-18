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

		// Pagination
		'pagination.prev': '上一页',
		'pagination.next': '下一页',

		// About page
		'about.title': '关于本站',
		'about.description': '这是顾佳凯的个人博客，使用 Astro 框架构建，采用 98.css 实现怀旧的 Windows 98 风格界面。',
		'about.techStack': '技术栈',
		'about.astro': 'Astro - 静态站点生成器',
		'about.98css': '98.css - Windows 98 风格的 CSS 框架',

		// Lightbox
		'lightbox.preview': '图片预览',
		'lightbox.close': '关闭',
	},
	en: {
		// Site
		'site.title': "Kai's Notes",
		'site.description': 'Sharing knowledge about AI, personal projects, and personal growth',

		// Navigation
		'nav.home': 'Home',
		'nav.about': 'About',

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

		// Pagination
		'pagination.prev': 'Previous',
		'pagination.next': 'Next',

		// About page
		'about.title': 'About This Site',
		'about.description': "This is Jiakai Gu's personal blog, built with Astro framework, featuring a nostalgic Windows 98 style interface using 98.css.",
		'about.techStack': 'Tech Stack',
		'about.astro': 'Astro - Static Site Generator',
		'about.98css': '98.css - Windows 98 Style CSS Framework',

		// Lightbox
		'lightbox.preview': 'Image Preview',
		'lightbox.close': 'Close',
	},
} as const;
