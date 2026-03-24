import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';

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
	let { data } = await storyblokApi.get(`cdn/stories/${fullSlug}`, sbParams);

	return <StoryblokStory story={data.story} />;
}
