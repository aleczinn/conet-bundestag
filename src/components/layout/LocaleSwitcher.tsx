'use client';

import { usePathname } from 'next/navigation';
import {
	isValidLocaleSegment,
	localeKeys,
	localeMap,
	Locale,
	COOKIE_LOCALE_SEGMENT,
	COOKIE_LOCALE_KEY,
} from '@/lib/locale/locales';
import { IconGlobe } from '@/components/icons';
import { t } from '@/lib/i18n';

interface LocaleSwitcherProps {
	locale: Locale;
}

// Eindeutige URL-Segments mit dem zugehörigen Default-Label
const uniqueSegments = [
	...new Map(localeKeys.map((k) => [localeMap[k].urlSegment, localeMap[k]])).values(),
];

export default function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
	const pathname = usePathname();

	const segments = pathname.split('/').filter(Boolean);
	const firstSegment = segments[0] ?? '';

	const currentIndex = uniqueSegments.findIndex(
		(l) => l.urlSegment === locale.urlSegment,
	);
	const nextLocale = uniqueSegments[(currentIndex + 1) % uniqueSegments.length];

	function switchLocale() {
		// Segment-Cookie setzen, Key-Cookie löschen damit der Proxy
		// die regionale Variante neu per Accept-Language auflöst
		document.cookie = `${COOKIE_LOCALE_SEGMENT}=${nextLocale.urlSegment};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
		document.cookie = `${COOKIE_LOCALE_KEY}=;path=/;max-age=0`;

		const newSegments = [...segments];
		if (isValidLocaleSegment(newSegments[0])) {
			newSegments[0] = nextLocale.urlSegment;
		} else {
			newSegments.unshift(nextLocale.urlSegment);
		}

		window.location.href = '/' + newSegments.join('/');
	}

	const titleChangeLanguageTo = t(locale, 'header.change_langauge_to');

	return (
		<button onClick={switchLocale}
						title={`${titleChangeLanguageTo} ${nextLocale.label}`}
						aria-label={`${titleChangeLanguageTo} ${nextLocale.label}`}
						className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
		>
			<IconGlobe />
			<span className="text-sm">{locale.urlSegment.toUpperCase()}</span>
		</button>
	);
}