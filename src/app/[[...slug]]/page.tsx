import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getLinks, getStory } from '@/lib/storyblok-queries';
import { BASE_URL, extractContentSlug, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';
import Breadcrumbs, { buildBreadcrumbs } from '@/components/layout/Breadcrumbs';
import {
	availableLanguages,
	DEFAULT_LOCALE,
	getAlternateOgLocales,
	getOgLocale,
} from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale/server';

const BLOCKED_SLUGS = ["config"];

interface PageProps {
	params: Promise<{
		slug?: string[];
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const contentSlug = extractContentSlug(slug);
	const locale = await getServerLocale();

	const result = await getStory(locale, contentSlug);

	if (!result?.data?.story) {
		return {
			title: t(locale, '404.title'),
			robots: { index: false, follow: false },
		};
	}

	const story = result.data.story;
	const content = story.content;

	const path = contentSlug === 'home' ? '' : contentSlug;
	const isHomepage = contentSlug === 'home';
	const description = content.seo_description || SITE_DESCRIPTION || '';
	const canonicalUrl = content.seo_canonical || `${BASE_URL}/${locale.language}/${path}`.replace(/\/+$/, '');
	const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;

	const browserTitle = content.title || story.name; // Browser-Tab: kurz, UI-orientiert
	const socialTitle = content.seo_title || content.title || story.name; // Social Sharing: ausführlich, SEO-optimiert (Fallback auf title)

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

	const metadata: Metadata = {
		description: description,
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
			title: socialTitle,
			siteName: SITE_NAME,
			description: description,
			url: canonicalUrl,
			type: content.seo_og_type || 'website',
			images: [{ url: ogImage, width: 1200, height: 630 }],
		},
		twitter: {
			card: 'summary_large_image',
			title: socialTitle,
			description: description,
			images: [ogImage],
		},
	}

	// Titel nur setzen, wenn NICHT Homepage -> Home erbt vom layout default
	if (!isHomepage) {
		metadata.title = browserTitle;
	}

	return metadata;
}

/**
 * Was macht diese Methode (SSG - Static Site Generation):
 *
 * Next.js rendert Seiten mit [[...slug]] standardmäßig on-demand – der Server generiert die HTML erst wenn jemand
 * die URL aufruft (SSR). Mit generateStaticParams sagst du Next.js beim Build: "Diese URLs existieren, rendere sie
 * jetzt als statisches HTML."
 *
 * Das Ergebnis landet als fertige HTML-Datei auf dem Server/CDN -> kein Datenbankzugriff bei jedem Request mehr.
 * SSR:  Request → Server fragt Storyblok → rendert HTML → Response        (langsamer)
 * SSG:  Build → alle Seiten vorgerendert → Request bekommt fertiges HTML  (schneller)
 */
export async function generateStaticParams() {
	const { data } = await getLinks(undefined, true);
	const links = data.links ?? {};

	return Object.values(links)
		.filter((link: any) => !link.is_folder)
		.flatMap((link: any) => {
			const path = link.slug === 'home' ? '' : link.slug;

			return availableLanguages.map((lang) => ({
				slug: path ? [lang, ...path.split('/')] : [lang],
			}));
		});
}

function isBlockedSlug(slug: string): boolean {
	return BLOCKED_SLUGS.some(
		(blocked) => slug === blocked || slug.startsWith(`${blocked}/`),
	);
}

export default async function Page({ params }: PageProps) {
	const { slug } = await params;
	const contentSlug = extractContentSlug(slug);

	if (isBlockedSlug(contentSlug)) {
		return notFound();
	}

	const locale = await getServerLocale();
	const result = await getStory(locale, contentSlug);

	if (!result?.data?.story) {
		return notFound();
	}

	const breadcrumbs = await buildBreadcrumbs(locale, contentSlug);

	return (
		<main id="main-content" className="flex-1 flex flex-col">
			<Breadcrumbs locale={locale} slug={contentSlug} items={breadcrumbs} includeSchema={true} />
			<div className="flex-1">
				<StoryblokStory story={result.data.story} />
			</div>
			<Breadcrumbs locale={locale} slug={contentSlug} items={breadcrumbs} />
		</main>
	)
}
