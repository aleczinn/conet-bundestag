import { NextRequest, NextResponse } from 'next/server';
import {
	COOKIE_LOCALE,
	DEFAULT_LOCALE,
	findByTag,
	isValidLanguage,
	resolveLocale,
	toLocaleTag,
} from '@/lib/locale/locales';

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const segments = pathname.split('/').filter(Boolean);
	const language = segments[0];

	if (isValidLanguage(language)) {
		const response = NextResponse.next();
		response.headers.set('x-pathname', pathname);

		// Bestehenden Cookie prüfen, sonst Accept-Language
		const cookieTag = request.cookies.get(COOKIE_LOCALE)?.value;
		const existing = cookieTag ? findByTag(cookieTag) : undefined;

		const locale =
			existing?.language === language
				? existing
				: resolveLocale(language, request.headers.get('accept-language') ?? '');

		if (locale) {
			const tag = toLocaleTag(locale);
			response.headers.set('x-locale-tag', tag);
			response.cookies.set(COOKIE_LOCALE, tag, {
				maxAge: 60 * 60 * 24 * 365,
				path: '/',
				sameSite: 'lax',
			});
		}

		return response;
	}

	// Kein gültiges Segment → Redirect
	const cookieTag = request.cookies.get(COOKIE_LOCALE)?.value;
	const fallback = cookieTag ? findByTag(cookieTag) : undefined;
	const targetLanguage = fallback?.language ?? DEFAULT_LOCALE.language;

	const url = request.nextUrl.clone();
	url.pathname = `/${targetLanguage}${pathname}`;
	return NextResponse.redirect(url, { status: 308 });
}

export const config = {
	matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)'],
};