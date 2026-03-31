'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
	isValidLocaleSegment,
	getLocaleKeyFromSegment,
	getLocale,
	localeKeys,
	localeMap,
	DEFAULT_LOCALE,
	LOCALE_COOKIE_NAME, Locale,
} from '@/lib/locale/locales';
import { IconGlobe } from '@/components/icons';
import { t } from '@/lib/i18n';

interface LocaleSwitcherProps {
	locale: Locale;
}

export default function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
	const pathname = usePathname();

	const segments = pathname.split('/').filter(Boolean);
	const firstSegment = segments[0] ?? '';

	const localeKey = isValidLocaleSegment(firstSegment)
		? getLocaleKeyFromSegment(firstSegment)
		: undefined;

	const currentLocale = localeKey ? getLocale(localeKey) : DEFAULT_LOCALE;

	// Nächste Locale im Zyklus (funktioniert mit 2+ Sprachen)
	const currentIndex = localeKeys.findIndex((k) => localeMap[k].urlSegment === currentLocale.urlSegment);
	const nextIndex = (currentIndex + 1) % localeKeys.length;
	const nextLocale = localeMap[localeKeys[nextIndex]];

	function switchLocale() {
		document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale.urlSegment};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

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
			<span className="text-sm">{currentLocale.urlSegment.toUpperCase()}</span>
		</button>
	);
}