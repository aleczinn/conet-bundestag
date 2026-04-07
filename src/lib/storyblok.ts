import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import Page from '@/components/blocks/Page';
import Feature from '@/components/blocks/Feature';
import Grid from '@/components/blocks/Grid';
import Teaser from '@/components/blocks/Teaser';
import Hero from '@/components/blocks/Hero';
import MediaWithText from '@/components/blocks/MediaWithText';

const cachedFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
	return fetch(input, {
		...init,
		next: {
			/** There is no cache in the development environment, so changes are visible immediately; in the production environment, Next.js revalidates every 60 seconds */
			revalidate: process.env.NODE_ENV === 'development' ? 0 : 60,
		},
	});
};

export const getStoryblokApi = storyblokInit({
	accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
	use: [apiPlugin],
	components: {
		page: Page,
		feature: Feature,
		grid: Grid,
		teaser: Teaser,
		hero: Hero,
		media_with_text: MediaWithText,
	},
	apiOptions: {
		/** Set the correct region for your space. Learn more: https://www.storyblok.com/docs/packages/storyblok-js#example-region-parameter */
		region: process.env.STORYBLOK_REGION || 'eu',
		/** The following code is only required when creating a Storyblok space directly via the Blueprints feature. */
		endpoint: process.env.STORYBLOK_API_BASE_URL
			? `${new URL(process.env.STORYBLOK_API_BASE_URL).origin}/v2`
			: undefined,
		fetch: cachedFetch,
	},
});
