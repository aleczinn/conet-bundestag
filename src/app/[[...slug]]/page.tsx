import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';
import { notFound } from 'next/navigation';

interface PageProps {
	params: Promise<{
		slug?: string[];
	}>;
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params;

	let fullSlug = slug ? slug.join('/') : 'home';

	const sbParams = {
		version: 'draft' as const,
	};

	const storyblokApi = getStoryblokApi();

	try {
		let { data } = await storyblokApi.get(`cdn/stories/${fullSlug}`, sbParams);

		if (!data) {
			return notFound();
		}

		return <StoryblokStory story={data.story} />;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Storyblok error:', error);
		}

		return notFound();
	}
}
