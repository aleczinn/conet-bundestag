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

export const localeMap = {
	'de-DE': {
		urlSegment: 'de',
		storyblokCode: 'default',
		label: 'Deutsch',
	},
	'de-AT': {
		urlSegment: 'de',
		storyblokCode: 'de-at',
		label: 'Deutsch (Österreich)',
	},
	'en-US': {
		urlSegment: 'en',
		storyblokCode: 'en',
		label: 'English',
	},
} as const satisfies Record<string, Locale>;

/** Default-LocaleKey pro URL-Segment (Fallback wenn kein exakter Match) */
export const segmentDefaults: Record<string, LocaleKey> = {
	'de': 'de-DE',
	'en': 'en-US',
};

export const localeKeys = Object.keys(localeMap) as LocaleKey[];
export const DEFAULT_LOCALE_KEY: LocaleKey = 'de-DE';
export const DEFAULT_LOCALE: Locale = localeMap[DEFAULT_LOCALE_KEY];

export const COOKIE_LOCALE_KEY = `${SITE_SHORTCUT}_KEY`;
export const COOKIE_LOCALE_SEGMENT = `${SITE_SHORTCUT}_LANG`;

// Segment-Gruppen (welche LocaleKeys teilen sich ein URL-Segment?)
const segmentGroups = new Map<string, LocaleKey[]>();
for (const key of localeKeys) {
	const seg = localeMap[key].urlSegment;
	const group = segmentGroups.get(seg) ?? [];
	group.push(key);
	segmentGroups.set(seg, group);
}

export function getLocale(key: LocaleKey): Locale {
	return localeMap[key];
}

export function isValidLocaleSegment(value: unknown): value is string {
	return typeof value === 'string' && segmentGroups.has(value);
}

/**
 * Gibt den Default-LocaleKey für ein URL-Segment zurück.
 * Wird für URL-basierte Auflösung genutzt (ohne Accept-Language).
 */
export function getLocaleKeyFromSegment(segment: string): LocaleKey | undefined {
	return segmentDefaults[segment];
}

/**
 * Findet den besten LocaleKey für ein URL-Segment anhand des
 * Accept-Language Headers. Fallback: Default für das Segment.
 */
export function resolveLocaleKey(segment: string, acceptLanguage?: string): LocaleKey | undefined {
	const group = segmentGroups.get(segment);
	if (!group) return undefined;
	if (group.length === 1) return group[0];

	if (acceptLanguage) {
		const preferred = acceptLanguage
			.split(',')
			.map((part) => {
				const [lang, q] = part.trim().split(';q=');
				return { lang: lang.trim(), q: q ? parseFloat(q) : 1 };
			})
			.sort((a, b) => b.q - a.q);

		for (const { lang } of preferred) {
			const normalized = lang.replace('_', '-');
			const match = group.find((k) => k.toLowerCase() === normalized.toLowerCase());
			if (match) return match;
		}
	}

	return segmentDefaults[segment] ?? group[0];
}

export function getOgLocale(key: LocaleKey): string {
	return key.replace('-', '_');
}

export function getAlternateOgLocales(key: LocaleKey): string[] {
	return localeKeys.filter((k) => k !== key).map(getOgLocale);
}