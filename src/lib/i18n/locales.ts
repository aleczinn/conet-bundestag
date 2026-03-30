import { SITE_SHORTCUT } from '@/lib/site';

export const locales = ['de', 'en'] as const;
export type Locale = typeof locales[number];
export const DEFAULT_LOCALE: Locale = 'de';

export const LOCALE_COOKIE_NAME = `${SITE_SHORTCUT}_LANG`;

export function isValidLocale(value: unknown): value is Locale {
	return locales.includes(value as Locale);
}

export function extractLocaleAndSlug(slug?: string[]): { locale: Locale; fullSlug: string } {
	const first = slug?.[0] ?? '';

	if (isValidLocale(first)) {
		const rest = slug!.slice(1);

		return {
			locale: first,
			fullSlug: rest.length > 0 ? rest.join('/') : 'home',
		};
	}

	return { locale: DEFAULT_LOCALE, fullSlug: slug?.join('/') || 'home' };
}