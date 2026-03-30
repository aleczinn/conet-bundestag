import { cookies } from 'next/headers';
import { isValidLocale, type Locale } from './locales';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@/lib/locale/locales';

/**
 * Liest die aktuelle Locale aus dem x-pathname Header (gesetzt von Middleware).
 * Kann in allen Server Components direkt aufgerufen werden.
 */
export async function getLocale(): Promise<Locale> {
	const cookieStore = await cookies();
	const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
	return isValidLocale(value) ? value : DEFAULT_LOCALE;
}