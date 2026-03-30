import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getStory } from '@/lib/storyblok-queries';
import { Breadcrumbs } from '@/components/layout';
import { BASE_URL, SITE_NAME } from '@/lib/site';
import { buildBreadcrumbs, buildBreadcrumbSchema } from '@/components/layout/Breadcrumbs';
import { extractLocaleAndSlug } from '@/lib/i18n/locales';

interface PageProps {
	params: Promise<{
		slug?: string[];
	}>;
}

function buildCanonicalUrl(base: string, locale: string, fullSlug: string): string {
	const path = fullSlug === 'home' ? '' : fullSlug;
	return `${base}/${locale}/${path}`.replace(/\/+$/, '');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const { locale, fullSlug } = extractLocaleAndSlug(slug);
	const language = locale === 'de' ? 'default' : locale;

	try {
		const { data } = await getStory(fullSlug, language);
		const content = data.story.content;
		const canonicalUrl = buildCanonicalUrl(BASE_URL, locale, fullSlug);
		const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;

		const pageTitle = content.seo_title || data.story.name;

		return {
			title: pageTitle,
			description: content.seo_description || '',
			alternates: {
				canonical: content.seo_canonical || canonicalUrl,
			},
			robots: {
				index: !content.seo_no_index,
				follow: !content.seo_no_index,
			},
			openGraph: {
				siteName: SITE_NAME,
				title: `${SITE_NAME} - ${pageTitle}`,
				description: content.seo_description || '',
				url: canonicalUrl,
				type: content.seo_og_type || 'website',
				images: [{ url: ogImage, width: 1200, height: 630 }],
			},
			twitter: {
				card: 'summary_large_image',
				title: `${SITE_NAME} - ${pageTitle}`,
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
	const { locale, fullSlug } = extractLocaleAndSlug(slug);
	const language = locale === 'de' ? 'default' : locale;
	const pathname = `/${locale}/${fullSlug === 'home' ? '' : fullSlug}`.replace(/\/$/, '') || `/${locale}`;

	// Breadcrumbs
	const breadcrumbs = await buildBreadcrumbs(pathname, locale);
	const schema = buildBreadcrumbSchema(breadcrumbs);

	try {
		const { data } = await getStory(fullSlug, language);

		if (!data?.story) {
			return notFound();
		}

		return (
			<main className="flex-1">
				<script type="application/ld+json"
								dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>

				<Breadcrumbs pathname={pathname} />
				<StoryblokStory story={data.story} />
			</main>
		);
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Storyblok error:', error);
		}

		return notFound();
	}
}
