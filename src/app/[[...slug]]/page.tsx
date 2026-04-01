import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getStory } from '@/lib/storyblok-queries';
import { BASE_URL, extractContentSlug, SITE_NAME } from '@/lib/site';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import {
	DEFAULT_LOCALE,
	getAlternateOgLocales,
	getOgLocale,
	Locale,
	localeKeys,
	localeMap,
} from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale/server';

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
	const slugWithoutLocale = extractContentSlug(slug);

	const locale = await getServerLocale();
	const localeKey = 'de-DE'; // TODO : adjust

	try {
		const { data } = await getStory(locale, slugWithoutLocale);
		const content = data.story.content;
		const canonicalUrl = buildCanonicalUrl(locale, slugWithoutLocale);
		const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;
		const pageTitle = content.seo_title || data.story.name;

		// hreflang URLs für alle Locales + x-default
		const languages: Record<string, string> = {
			'x-default': `${BASE_URL}/${DEFAULT_LOCALE.urlSegment}/${slugWithoutLocale}`.replace(/\/+$/, ''),
			...Object.fromEntries(
				localeKeys.map((key) => [
					key.toLowerCase(),
					`${BASE_URL}/${localeMap[key].urlSegment}/${slugWithoutLocale}`.replace(/\/+$/, ''),
				]),
			),
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
			title: t(locale, '404.title'),
			robots: { index: false, follow: false },
		};
	}
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params;
	const slugWithoutLocale = extractContentSlug(slug);
	const locale = await getServerLocale();

	try {
		const { data } = await getStory(locale, slugWithoutLocale);

		if (!data?.story) {
			return notFound();
		}

		return (
			<main className="flex-1">
				<Breadcrumbs locale={locale} slug={slugWithoutLocale} />
				<StoryblokStory story={data.story} />
			</main>
		);
	} catch (error) {
		return notFound();
	}
}
