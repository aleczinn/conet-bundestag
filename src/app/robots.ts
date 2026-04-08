import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [
				'/api/',
				'/_next/',
				'/config/' // Storyblok-Konfigurationsseiten, kein öffentlicher Inhalt
			],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}