import LocaleSwitcher from './LocaleSwitcher';
import { headers } from 'next/headers';
import { availableLanguages, Locale } from '@/lib/locale/locales';
import { getSlugMap, translatePath } from '@/lib/locale/slug-map';

interface Props { locale: Locale; }

export default async function LocaleSwitcherServer({ locale }: Props) {
	const h = await headers();
	const pathname = h.get('x-pathname') ?? `/${locale.language}`;
	const translatedPath = pathname.split('/').filter(Boolean).slice(1).join('/');

	const map = await getSlugMap();
	const realSlug = map.byTranslated[locale.language]?.get(translatedPath) ?? null;

	const alternates: Record<string, string> = {};
	for (const lang of availableLanguages) {
		const path =
			realSlug === null
				? '' // kein Match-> auf Startseite der Zielsprache
				: realSlug === 'home'
					? ''
					: translatePath(map.byReal, realSlug, lang);
		alternates[lang] = `/${lang}${path ? `/${path}` : ''}`;
	}

	return <LocaleSwitcher locale={locale} alternates={alternates} />;
}