import localFont from 'next/font/local';


// Sans: nur regular + 700 preloaden (das reicht für Body + Bold)
export const notoSans = localFont({
	src: [
		{ path: '../../public/fonts/noto-sans-display-v30-latin_latin-ext-regular.woff2', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/noto-sans-display-v30-latin_latin-ext-700.woff2', weight: '700', style: 'normal' },
	],
	variable: '--font-sans',
	display: 'swap',
	preload: true,
});

// Serif: nur regular + 700 preloaden
export const notoSerif = localFont({
	src: [
		{ path: '../../public/fonts/noto-serif-v33-latin_latin-ext-regular.woff2', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/noto-serif-v33-latin_latin-ext-700.woff2', weight: '700', style: 'normal' },
	],
	variable: '--font-serif',
	display: 'swap',
	preload: true,
});

// Serif extra weights: verfügbar, aber nicht preloaded
// Nutzt dieselbe CSS-Variable, sodass font-medium/font-semibold funktionieren
export const notoSerifExtra = localFont({
	src: [
		{ path: '../../public/fonts/noto-serif-v33-latin_latin-ext-500.woff2', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/noto-serif-v33-latin_latin-ext-600.woff2', weight: '600', style: 'normal' },
	],
	variable: '--font-serif',
	display: 'swap',
	preload: false,
});