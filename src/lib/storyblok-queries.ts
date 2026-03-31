import { cache } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';
import { DEFAULT_LOCALE, Locale } from '@/lib/locale/locales';
import { draftMode } from 'next/headers';

const getVersion = async () => {
	if (process.env.NODE_ENV === 'development') {
		return 'draft' as const;
	}

	const draft = await draftMode();
	return draft.isEnabled ? 'draft' as const : 'published' as const;
};

/**
 * Lädt eine Storyblok Story anhand des Slugs.
 *
 * Wrapped mit React `cache()`, da `storyblokApi.get()` kein nativer `fetch()` ist
 * und daher nicht von Next.js' automatischer Request Memoization profitiert.
 * `cache()` stellt sicher, dass bei identischen Argumenten innerhalb eines
 * Server-Renders nur ein einziger Netzwerk-Request ausgeführt wird –
 * auch wenn `generateMetadata` und `Page` die Funktion beide aufrufen.
 *
 * @see https://react.dev/reference/react/cache
 */
export const getStory = cache(async (fullSlug: string, locale: Locale = DEFAULT_LOCALE) => {
	const storyblokApi = getStoryblokApi();
	const version = await getVersion();

	return storyblokApi.get(`cdn/stories/${fullSlug}`, {
		version,
		language: locale.storyblokCode,
	});
});

/**
 * Lädt alle Storyblok Links in einem einzigen Request.
 * `cache()` dedupliziert den Call innerhalb eines Server-Renders
 * (z.B. wenn mehrere Komponenten gleichzeitig rendern).
 * ISR-Revalidierung übernimmt `cachedFetch` in storyblok.ts (60s in prod).
 */
export const getLinks = cache(async (locale?: Locale) => {
	const storyblokApi = getStoryblokApi();
	const version = await getVersion();

	return storyblokApi.get('cdn/links', {
		version,
		...(locale && { language: locale.storyblokCode }),
	});
});