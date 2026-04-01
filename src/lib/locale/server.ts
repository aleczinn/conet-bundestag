import { cookies, headers } from 'next/headers';
import {
	COOKIE_LOCALE_KEY,
	COOKIE_LOCALE_SEGMENT,
	DEFAULT_LOCALE,
	getLocale,
	getLocaleKeyFromSegment,
	localeMap,
	type Locale,
	type LocaleKey,
} from './locales';

/**
 * Liest die aktuelle Locale – nutzt den vom Proxy gesetzten x-locale-key
 * (enthält die regionale Variante, z.B. 'de-AT'), mit Fallbacks auf
 * URL-Segment und Cookie.
 */
export async function getServerLocale(): Promise<Locale> {
	const headersList = await headers();

	// Exakter LocaleKey aus Proxy (enthält regionale Variante)
	const localeKey = headersList.get('x-locale-key') as LocaleKey | null;
	if (localeKey && localeMap[localeKey]) {
		return localeMap[localeKey];
	}

	// URL-basiert (Default für das Segment)
	const pathname = headersList.get('x-pathname');
	if (pathname) {
		const segment = pathname.split('/').filter(Boolean)[0];
		const key = getLocaleKeyFromSegment(segment);
		if (key) return getLocale(key);
	}

	// Cookie
	const cookieStore = await cookies();
	const cookieKey = cookieStore.get(COOKIE_LOCALE_KEY)?.value as LocaleKey | undefined;
	if (cookieKey && localeMap[cookieKey]) {
		return localeMap[cookieKey];
	}

	const segment = cookieStore.get(COOKIE_LOCALE_SEGMENT)?.value;
	const key = segment ? getLocaleKeyFromSegment(segment) : undefined;
	return key ? getLocale(key) : DEFAULT_LOCALE;
}
