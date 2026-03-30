'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { isValidLocale, LOCALE_COOKIE_NAME, DEFAULT_LOCALE, type Locale } from './locales';

export async function setLocale(locale: Locale) {
	const cookieStore = await cookies();
	cookieStore.set(LOCALE_COOKIE_NAME, locale, {
		maxAge: 60 * 60 * 24 * 365,
		path: '/',
		sameSite: 'lax',
	});

	// Aktuellen Pfad aus Middleware-Header lesen und Locale tauschen
	const headersList = await headers();
	const pathname = headersList.get('x-pathname') ?? `/${DEFAULT_LOCALE}`;
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length > 0 && isValidLocale(segments[0])) {
		segments[0] = locale;
	} else {
		segments.unshift(locale);
	}

	redirect('/' + segments.join('/'));
}