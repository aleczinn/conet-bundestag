'use client';

import { usePathname, useRouter } from 'next/navigation';
import { isValidLocale, LOCALE_COOKIE_NAME, type Locale } from '@/lib/locale/locales';
import { IconGlobe } from '@/components/icons';
import { useState } from 'react';

export default function LocaleSwitcher() {
	const pathname = usePathname();
	const router = useRouter();

	const segments = pathname.split('/').filter(Boolean);
	const currentLocale: Locale = isValidLocale(segments[0]) ? segments[0] : 'de';

	const [switching, setSwitching] = useState(false);

	function switchLocale() {
		if (switching) {
			return;
		}
		setSwitching(true);

		const newLocale: Locale = currentLocale === 'de' ? 'en' : 'de';

		document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

		// Locale-Segment in URL tauschen
		const newSegments = [...segments];
		if (isValidLocale(newSegments[0])) {
			newSegments[0] = newLocale;
		} else {
			newSegments.unshift(newLocale);
		}

		router.push('/' + newSegments.join('/'));

		setTimeout(() => {
			setSwitching(false);
		}, 500);
	}

	return (
		<button onClick={switchLocale}
						title={`Sprache wechseln zu ${currentLocale === 'de' ? 'English' : 'Deutsch'}`}
						aria-label={`Sprache wechseln zu ${currentLocale === 'de' ? 'English' : 'Deutsch'}`}
						className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
		>
			<IconGlobe />
			<span className="text-sm">{currentLocale.toUpperCase()}</span>
		</button>
	);
}