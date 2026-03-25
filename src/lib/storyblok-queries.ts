import { cache } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';

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
export const getStory = cache(async (fullSlug: string) => {
	const storyblokApi = getStoryblokApi();

	return storyblokApi.get(`cdn/stories/${fullSlug}`, {
		version: 'draft' as const,
	});
});