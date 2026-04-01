import { cookies, headers } from 'next/headers';
import {
	COOKIE_LOCALE,
	DEFAULT_LOCALE,
	findByTag,
	getDefaultForLanguage,
	Locale,
} from '@/lib/locale/locales';

/**
 * Liest die aktuelle Locale aus Header → Cookie → Default.
 *
 * Der Proxy setzt x-locale-tag mit der exakten regionalen Variante
 * (z.B. 'de-AT'). Fallbacks greifen auf URL-Segment und Cookie zurück.
 */
export async function getServerLocale(): Promise<Locale> {
	const headersList = await headers();

	// Exakter Tag vom Proxy (enthält regionale Variante)
	const tag = headersList.get('x-locale-tag');
	if (tag) {
		const locale = findByTag(tag);
		if (locale) {
			return locale;
		}
	}

	// URL-Segment aus Proxy-Header
	const pathname = headersList.get('x-pathname');
	if (pathname) {
		const language = pathname.split('/').filter(Boolean)[0];
		const locale = getDefaultForLanguage(language);
		if (locale) {
			return locale;
		}
	}

	// Cookie
	const cookieStore = await cookies();
	const cookieTag = cookieStore.get(COOKIE_LOCALE)?.value;
	if (cookieTag) {
		const locale = findByTag(cookieTag);
		if (locale) {
			return locale;
		}

		// Cookie enthält nur die language (z.B. 'de' nach Migration)
		const fallback = getDefaultForLanguage(cookieTag);
		if (fallback) {
			return fallback;
		}
	}

	return DEFAULT_LOCALE;
}
