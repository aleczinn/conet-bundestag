import Link from 'next/link';
import { getLinks } from '@/lib/storyblok-queries';
import { BASE_URL } from '@/lib/site';
import { DEFAULT_LOCALE, extractLocaleAndSlug, Locale } from '@/lib/locale/locales';
import Container from '@/components/layout/Container';
import { t } from '@/lib/i18n';

interface BreadcrumbsProps {
	pathname: string;
	locale?: string;
}

interface BreadcrumbItem {
	name: string;
	href: string;
}

interface StoryblokLink {
	slug?: string;
	name?: string;
	is_folder?: boolean;
}

export async function buildBreadcrumbs(pathname: string, locale: Locale): Promise<BreadcrumbItem[]> {
	// Slug aus Pathname ableiten: "/" -> "home", "/a/b" -> "a/b"
	const segment = locale.urlSegment;
	const slugWithoutLocale = pathname.replace(new RegExp(`^\\/${segment}\\/?`), '') || 'home';

	const homeTitle = t(locale, 'home');
	const breadcrumbs: BreadcrumbItem[] = [
		{ name: homeTitle, href: `/${segment}` },
	];

	// Startseite hat nur einen Eintrag
	if (slugWithoutLocale === 'home') {
		return breadcrumbs;
	}

	const { data } = await getLinks();
	const links: Record<string, StoryblokLink> = data.links;

	const slugMap = new Map<string, string>();
	Object.values(links).forEach((link) => {
		if (link.slug && link.name) {
			slugMap.set(link.slug, link.name);
		}
	});

	// Kumulativen Pfad aufbauen: "a/b/c" -> ["a", "a/b", "a/b/c"]
	let cumulativePath = '';
	for (const segment of slugWithoutLocale.split('/').filter(Boolean)) {
		cumulativePath = cumulativePath ? `${cumulativePath}/${segment}` : segment;
		const name = slugMap.get(cumulativePath);

		if (name) {
			breadcrumbs.push({ name, href: `/${locale.urlSegment}/${cumulativePath}` });
		}
	}

	return breadcrumbs;
}

export function buildBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbs.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: `${BASE_URL}${item.href}`,
		})),
	};
}

export default async function Breadcrumbs({ pathname }: BreadcrumbsProps) {
	const segments = pathname.split('/').filter(Boolean);
	const { locale } = extractLocaleAndSlug(segments);
	const breadcrumbs = await buildBreadcrumbs(pathname, locale);

	return (
		<Container className="h-16 flex flex-row items-center bg-gray-10"
							 aria-label={t(locale, 'header.navigation.breadcrumb')}
		>
			<ol className="flex flex-wrap items-center gap-2">
				{breadcrumbs.map((item, index) => {
					const isLast = index === breadcrumbs.length - 1;

					return (
						<li key={item.href} className="flex items-center gap-2">
							{index > 0 && (
								<span className="text-sm text-gray-40" aria-hidden="true">|</span>
							)}

							{isLast ? (
								<span className="text-sm font-bold text-gray-90" aria-current="page">
										{item.name}
								</span>
							) : (
								<Link href={item.href} className="text-sm text-gray-90 hover:underline">
									{item.name}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</Container>
	);
}