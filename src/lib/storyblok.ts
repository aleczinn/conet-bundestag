import Page from '@/components/blocks/Page';
import Feature from '@/components/blocks/Feature';
import Grid from '@/components/blocks/Grid';
import Teaser from '@/components/blocks/Teaser';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import Hero from '@/components/blocks/Hero';

const cachedFetch = (input: any, init?: any): Promise<Response> => {
	return fetch(input, {
		...init,
		cache: 'no-store',
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
