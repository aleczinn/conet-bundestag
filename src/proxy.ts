import { NextRequest, NextResponse } from 'next/server';
import {
	COOKIE_LOCALE_KEY,
	COOKIE_LOCALE_SEGMENT,
	DEFAULT_LOCALE,
	isValidLocaleSegment,
	type LocaleKey,
	localeMap,
	resolveLocaleKey,
} from '@/lib/locale/locales';

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const segments = pathname.split('/').filter(Boolean);
	const firstSegment = segments[0];

	if (isValidLocaleSegment(firstSegment)) {
		const response = NextResponse.next();
		response.headers.set('x-pathname', pathname);

		// Regionale Variante: Cookie hat Vorrang, sonst Accept-Language
		const cookieKey = request.cookies.get(COOKIE_LOCALE_KEY)?.value;
		const localeKey =
			cookieKey && localeMap[cookieKey as LocaleKey]?.urlSegment === firstSegment
				? cookieKey
				: resolveLocaleKey(firstSegment, request.headers.get('accept-language') ?? '');

		if (localeKey) {
			response.headers.set('x-locale-key', localeKey);
			response.cookies.set(COOKIE_LOCALE_KEY, localeKey, {
				maxAge: 60 * 60 * 24 * 365,
				path: '/',
				sameSite: 'lax',
			});
		}

		response.cookies.set(COOKIE_LOCALE_SEGMENT, firstSegment, {
			maxAge: 60 * 60 * 24 * 365,
			path: '/',
			sameSite: 'lax',
		});

		return response;
	}

	// Keine Locale in URL -> Redirect zum richtigen Segment
	const cookieSegment = request.cookies.get(COOKIE_LOCALE_SEGMENT)?.value;
	const targetSegment = isValidLocaleSegment(cookieSegment)
		? cookieSegment
		: DEFAULT_LOCALE.urlSegment;

	const url = request.nextUrl.clone();
	url.pathname = `/${targetSegment}${pathname}`;
	return NextResponse.redirect(url, { status: 307 });
}

export const config = {
	matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)'],
};