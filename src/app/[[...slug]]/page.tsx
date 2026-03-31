import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getStory } from '@/lib/storyblok-queries';
import { BASE_URL, SITE_NAME } from '@/lib/site';
import Breadcrumbs, { buildBreadcrumbs, buildBreadcrumbSchema } from '@/components/layout/Breadcrumbs';
import {
	DEFAULT_LOCALE,
	extractLocaleAndSlug,
	getAlternateOgLocales,
	getOgLocale,
	Locale,
	localeKeys,
	localeMap,
} from '@/lib/locale/locales';

interface PageProps {
	params: Promise<{
		slug?: string[];
	}>;
}

function buildCanonicalUrl(locale: Locale, fullSlug: string): string {
	const path = fullSlug === 'home' ? '' : fullSlug;
	return `${BASE_URL}/${locale.urlSegment}/${path}`.replace(/\/+$/, '');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const { localeKey, locale, fullSlug } = extractLocaleAndSlug(slug);

	try {
		const { data } = await getStory(fullSlug, locale);
		const content = data.story.content;
		const canonicalUrl = buildCanonicalUrl(locale, fullSlug);
		const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;
		const pageTitle = content.seo_title || data.story.name;

		// hreflang URLs für alle Locales + x-default
		const path = fullSlug === 'home' ? '' : fullSlug;
		const languages: Record<string, string> = {
			'x-default': `${BASE_URL}/${DEFAULT_LOCALE.urlSegment}/${path}`.replace(/\/+$/, ''),
			...Object.fromEntries(
				localeKeys.map((key) => [
					key.toLowerCase(),
					`${BASE_URL}/${localeMap[key].urlSegment}/${path}`.replace(/\/+$/, ''),
				])
			)
		};

		return {
			title: pageTitle,
			description: content.seo_description || '',
			alternates: {
				canonical: content.seo_canonical || canonicalUrl,
				languages,
			},
			robots: {
				index: !content.seo_no_index,
				follow: !content.seo_no_index,
			},
			openGraph: {
				locale: getOgLocale(localeKey),
				alternateLocale: getAlternateOgLocales(localeKey),
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
	const pathname = `/${locale.urlSegment}/${fullSlug === 'home' ? '' : fullSlug}`.replace(/\/$/, '') || `/${locale.urlSegment}`;

	// Breadcrumbs
	const breadcrumbs = await buildBreadcrumbs(pathname, locale);
	const schema = buildBreadcrumbSchema(breadcrumbs);

	try {
		const { data } = await getStory(fullSlug, locale);

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
			console.error('[DEV] Storyblok error:', error);
		}

		return notFound();
	}
}
