import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';
import { getLinks } from '@/lib/storyblok-queries';
import { availableLanguages } from '@/lib/locale/locales';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { data } = await getLinks();
	const links = data.links ?? {};

	return Object.values(links)
		.filter((link: any) => !link.is_folder && !link.slug?.startsWith('config'))
		.flatMap((link: any) => {
			const path = link.slug === 'home' ? '' : link.slug;
			const lastModified = toDate(link.published_at);

			return availableLanguages.map((lang) => ({
				url: `${BASE_URL}/${lang}/${path}`.replace(/\/+$/, ''),
				...(lastModified && { lastModified }),
				changeFrequency: 'weekly' as const,
				priority: link.slug === 'home' ? 1 : 0.8,
				alternates: {
					languages: Object.fromEntries(
						availableLanguages.map((alt) => [
							alt,
							`${BASE_URL}/${alt}/${path}`.replace(/\/+$/, ''),
						]),
					),
				},
			}));
		});
}

function toDate(value: unknown): Date | undefined {
	if (!value || typeof value !== 'string') return undefined;
	const date = new Date(value);
	return isNaN(date.getTime()) ? undefined : date;
}