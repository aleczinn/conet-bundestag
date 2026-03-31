'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
	isValidLocaleSegment,
	getLocaleKeyFromSegment,
	getLocale,
	localeKeys,
	localeMap,
	DEFAULT_LOCALE,
	LOCALE_COOKIE_NAME,
} from '@/lib/locale/locales';
import { IconGlobe } from '@/components/icons';
import { useState } from 'react';

export default function LocaleSwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const [switching, setSwitching] = useState(false);

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
		if (switching) {
			return;
		}
		setSwitching(true);

		document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale.urlSegment};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

		const newSegments = [...segments];
		if (isValidLocaleSegment(newSegments[0])) {
			newSegments[0] = nextLocale.urlSegment;
		} else {
			newSegments.unshift(nextLocale.urlSegment);
		}

		router.push('/' + newSegments.join('/'));

		setTimeout(() => {
			setSwitching(false);
		}, 500);
	}

	return (
		<button onClick={switchLocale}
						disabled={switching}
						title={`Sprache wechseln zu ${nextLocale.label}`}
						aria-label={`Sprache wechseln zu ${nextLocale.label}`}
						className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
		>
			<IconGlobe />
			<span className="text-sm">{currentLocale.urlSegment.toUpperCase()}</span>
		</button>
	);
}