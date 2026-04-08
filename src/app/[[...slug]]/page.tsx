import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getLinks, getStory } from '@/lib/storyblok-queries';
import { BASE_URL, extractContentSlug, SITE_NAME } from '@/lib/site';
import Breadcrumbs, { buildBreadcrumbs } from '@/components/layout/Breadcrumbs';
import {
	availableLanguages,
	DEFAULT_LOCALE,
	getAlternateOgLocales,
	getOgLocale,
	Locale, locales, toLocaleTag,
} from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale/server';

interface PageProps {
	params: Promise<{
		slug?: string[];
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const contentSlug = extractContentSlug(slug);

	const locale = await getServerLocale();

	try {
		const { data } = await getStory(locale, contentSlug);
		const content = data.story.content;

		const path = contentSlug === 'home' ? '' : contentSlug;
		const canonicalUrl = content.seo_canonical || `${BASE_URL}/${locale.language}/${path}`.replace(/\/+$/, '');
		const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;
		const pageTitle = content.seo_title || data.story.name;

		// hreflang URLs für alle Locales + x-default
		const languages: Record<string, string> = {
			'x-default': `${BASE_URL}/${DEFAULT_LOCALE.language}/${path}`.replace(/\/+$/, ''),
			...Object.fromEntries(
				availableLanguages.map((lang) => [
					lang,
					`${BASE_URL}/${lang}/${path}`.replace(/\/+$/, ''),
				]),
			),
		};

		return {
			title: pageTitle,
			description: content.seo_description || '',
			alternates: {
				canonical: canonicalUrl,
				languages,
			},
			robots: {
				index: !content.seo_no_index,
				follow: !content.seo_no_index,
			},
			openGraph: {
				locale: getOgLocale(locale),
				alternateLocale: getAlternateOgLocales(locale),
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

const BLOCKED_SLUGS = ["config"];

export default async function Page({ params }: PageProps) {
	const { slug } = await params;
	const contentSlug = extractContentSlug(slug);
	const locale = await getServerLocale();

	const breadcrumbs = await buildBreadcrumbs(locale, contentSlug);

	// Config-Routen blocken (funktioniert mit und ohne Locale-Prefix)
	if (BLOCKED_SLUGS.some((blocked) => contentSlug === blocked || contentSlug.startsWith(`${blocked}/`))) {
		return notFound();
	}

	try {
		const { data } = await getStory(locale, contentSlug);

		if (!data?.story) {
			return notFound();
		}

		return (
			<main className="flex-1 flex flex-col">
				<Breadcrumbs locale={locale} slug={contentSlug} items={breadcrumbs} includeSchema={true} />
				<div className="flex-1">
					<StoryblokStory story={data.story} />
				</div>
				<Breadcrumbs locale={locale} slug={contentSlug} items={breadcrumbs} />
			</main>
		);
	} catch (error) {
		return notFound();
	}
}
