import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getStory } from '@/lib/storyblok-queries';

interface PageProps {
	params: Promise<{
		slug?: string[];
	}>;
}

const BASE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ||
	process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
	'http://localhost:3000';

function buildCanonicalUrl(base: string, fullSlug: string): string {
	const path = fullSlug === 'home' ? '' : fullSlug;
	return `${base}/${path}`.replace(/\/+$/, '');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const fullSlug = slug ? slug.join('/') : 'home';

	try {
		const { data } = await getStory(fullSlug);
		const content = data.story.content;
		const canonicalUrl = buildCanonicalUrl(BASE_URL, fullSlug);
		const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;

		return {
			title: content.seo_title || data.story.name,
			description: content.seo_description || '',
			alternates: {
				canonical: content.seo_canonical || canonicalUrl,
			},
			robots: {
				index: !content.seo_no_index,
				follow: !content.seo_no_index,
			},
			openGraph: {
				title: content.seo_title || data.story.name,
				description: content.seo_description || '',
				url: canonicalUrl,
				type: content.seo_og_type || 'website',
				images: [{ url: ogImage, width: 1200, height: 630 }],
			},
			twitter: {
				card: 'summary_large_image',
				title: content.seo_title || data.story.name,
				description: content.seo_description || '',
				images: [ogImage],
			},
		};
	} catch {
		return {
			title: 'Seite nicht gefunden',
			robots: { index: false, follow: false },
		};
	}
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params;
	const fullSlug = slug ? slug.join('/') : 'home';
	const storyblokApi = getStoryblokApi();

	try {
		const { data } = await getStory(fullSlug);

		if (!data?.story) {
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
