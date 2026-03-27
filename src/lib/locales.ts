import { cache } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';

export const DEFAULT_LOCALE = 'de';

// Regex für Sprachcode (Locale): 2-3 Buchstaben, z.B. de, en, fr, gsw
export const LOCALE_PATH_PATTERN = /^\/[a-z]{2,3}(\/|$)/;

// Regex prüft ob ein einzelnes Segment eine Locale ist (de, en, ...)
export const LOCALE_SEGMENT_PATTERN = /^[a-z]{2,3}$/;

interface StoryblokSpace {
	language_codes: string[];
}

export const getLocales = cache(async (): Promise<{
	locales: string[];
	defaultLocale: string;
}> => {
	try {
		const storyblokApi = getStoryblokApi();
		const { data } = await storyblokApi.get('cdn/spaces/me', {});
		const space: StoryblokSpace = data.space;

		const additionalLocales = space.language_codes ?? [];
		const defaultLocale = 'de';
		const locales = [defaultLocale, ...additionalLocales];

		return { locales, defaultLocale };
	} catch {
		// Fallback
		return { locales: ['de'], defaultLocale: 'de' };
	}
});

export function extractLocaleAndSlug(slug?: string[]): { locale: string; fullSlug: string } {
	const first = slug?.[0] ?? '';

	if (LOCALE_SEGMENT_PATTERN.test(first)) {
		const rest = slug!.slice(1);

		return {
			locale: first,
			fullSlug: rest.length > 0 ? rest.join('/') : 'home',
		};
	}

	return { locale: DEFAULT_LOCALE, fullSlug: slug?.join('/') || 'home' };
}