import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			scale: 1.2,
			cdn: 'https://esm.sh/',
		}),
	],
	theme: {
		colors: {
			win98: {
				gray: '#c0c0c0',
				darkgray: '#808080',
				blue: '#000080',
			},
		},
	},
});
