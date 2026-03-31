import { cookies, headers } from 'next/headers';
import { getLocale, getLocaleKeyFromSegment } from './locales';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@/lib/locale/locales';
import type { Locale } from '@/lib/locale/locales';

/**
 * Liest die aktuelle Locale aus dem x-pathname Header (gesetzt von Middleware).
 * Kann in allen Server Components direkt aufgerufen werden.
 */
export async function getServerLocale(): Promise<Locale> {
	// Primär: URL-basiert (vom Proxy gesetzt)
	const headersList = await headers();
	const pathname = headersList.get('x-pathname');

	if (pathname) {
		const firstSegment = pathname.split('/').filter(Boolean)[0];
		const key = getLocaleKeyFromSegment(firstSegment);
		if (key) {
			return getLocale(key);
		}
	}

	// Fallback: Cookie
	const cookieStore = await cookies();
	const segment = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
	const key = segment ? getLocaleKeyFromSegment(segment) : undefined;
	return key ? getLocale(key) : DEFAULT_LOCALE;
}