import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, isValidLocale, LOCALE_COOKIE_NAME } from '@/lib/locale/locales';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const segments = pathname.split('/').filter(Boolean);
	const firstSegment = segments[0];

	if (isValidLocale(firstSegment)) {
		// Locale in URL vorhanden → durchlassen + Header/Cookie setzen
		const response = NextResponse.next();
		response.headers.set('x-pathname', pathname);
		response.cookies.set(LOCALE_COOKIE_NAME, firstSegment, {
			maxAge: 60 * 60 * 24 * 365,
			path: '/',
			sameSite: 'lax',
		});
		return response;
	}

	// Keine Locale → Cookie prüfen, sonst Default
	const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
	const targetLocale = isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

	const url = request.nextUrl.clone();
	url.pathname = `/${targetLocale}${pathname}`;
	return NextResponse.redirect(url, { status: 307 });
}

export const config = {
	matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)'],
};