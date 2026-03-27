import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, LOCALE_PATH_PATTERN } from '@/lib/locales';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (LOCALE_PATH_PATTERN.test(pathname)) {
		// Wenn Locale vorhanden dann x-pathname setzen und durchlassen
		const response = NextResponse.next();
		response.headers.set('x-pathname', pathname);
		return response;
	}

	// Kein Locale-Prefix -> auf /DEFAULT_LOCALE umleiten
	const url = request.nextUrl.clone();
	url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
	return NextResponse.redirect(url, { status: 308 });
}

export const config = {
	matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)'],
};