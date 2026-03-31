import { SITE_SHORTCUT } from '@/lib/site';

export type LocaleKey = keyof typeof localeMap;

export interface Locale {
	/** Was in der URL steht (z.B. 'de', 'de-at', 'en') */
	urlSegment: string;
	/** Storyblok API language parameter */
	storyblokCode: string;
	/** Anzeigename */
	label: string;
}

// --- Zentrale Konfiguration ---

export const localeMap = {
	'de-DE': {
		urlSegment: 'de',
		storyblokCode: 'default',
		label: 'Deutsch',
	},
	'en-US': {
		urlSegment: 'en',
		storyblokCode: 'en',
		label: 'English',
	},
} as const satisfies Record<string, Locale>;

export const localeKeys = Object.keys(localeMap) as LocaleKey[];
export const DEFAULT_LOCALE_KEY: LocaleKey = 'de-DE';
export const DEFAULT_LOCALE: Locale = localeMap[DEFAULT_LOCALE_KEY];
export const LOCALE_COOKIE_NAME = `${SITE_SHORTCUT}_LANG`;

const segmentIndex = new Map<string, LocaleKey>(
	localeKeys.map((key) => [localeMap[key].urlSegment, key])
);

export function getLocale(key: LocaleKey) {
	return localeMap[key];
}

/** Aus dem Key abgeleitet: 'de-DE' → 'de' */
export function getLanguage(key: LocaleKey): string {
	return key.split('-')[0];
}

/** Aus dem Key abgeleitet: 'de-DE' → 'DE' */
export function getCountry(key: LocaleKey): string {
	return key.split('-')[1];
}

/** OpenGraph-Format: 'de-DE' → 'de_DE' */
export function getOgLocale(key: LocaleKey): string {
	return key.replace('-', '_');
}

export function getAlternateOgLocales(key: LocaleKey): string[] {
	return localeKeys.filter((k) => k !== key).map(getOgLocale);
}

export function getLocaleKeyFromSegment(segment: string): LocaleKey | undefined {
	return segmentIndex.get(segment);
}

export function isValidLocaleSegment(value: unknown): value is string {
	return typeof value === 'string' && segmentIndex.has(value);
}

export function extractLocaleAndSlug(slug?: string[]): {
	localeKey: LocaleKey;
	locale: Locale;
	fullSlug: string;
} {
	const first = slug?.[0] ?? '';
	const localeKey = getLocaleKeyFromSegment(first);

	if (localeKey) {
		const rest = slug!.slice(1);

		return {
			localeKey,
			locale: localeMap[localeKey],
			fullSlug: rest.length > 0 ? rest.join('/') : 'home',
		};
	}

	return {
		localeKey: DEFAULT_LOCALE_KEY,
		locale: DEFAULT_LOCALE,
		fullSlug: slug?.join('/') || 'home',
	};
}