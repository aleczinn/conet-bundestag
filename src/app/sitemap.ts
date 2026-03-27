import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';
import { getLinks } from '@/lib/storyblok-queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { data } = await getLinks();

	console.log("sitemap");

	return Object.values(data.links)
		.filter((link: any) => !link.is_folder)
		.map((link: any) => ({
			url: `${BASE_URL}/${link.slug === 'home' ? '' : link.slug}`,
			lastModified: link.published_at,
			changeFrequency: 'weekly' as const,
			priority: link.slug === 'home' ? 1 : 0.8,
		}));
}