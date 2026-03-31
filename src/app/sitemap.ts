import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';
import { getLinks } from '@/lib/storyblok-queries';
import { localeKeys, localeMap } from '@/lib/locale/locales';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { data } = await getLinks();

	return Object.values(data.links)
		.filter((link: any) => !link.is_folder)
		.flatMap((link: any) => {
			const path = link.slug === 'home' ? '' : link.slug;

			return localeKeys.map((key) => ({
				url: `${BASE_URL}/${localeMap[key].urlSegment}/${path}`.replace(/\/+$/, ''),
				lastModified: link.published_at,
				changeFrequency: 'weekly' as const,
				priority: link.slug === 'home' ? 1 : 0.8,
				alternates: {
					languages: Object.fromEntries(
						localeKeys.map((k) => [
							localeMap[k].urlSegment,
							`${BASE_URL}/${localeMap[k].urlSegment}/${path}`.replace(/\/+$/, ''),
						])
					),
				},
			}));
		});
}