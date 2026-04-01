'use client';

import { usePathname } from 'next/navigation';
import { IconGlobe } from '@/components/icons';
import { t } from '@/lib/i18n';
import {
	COOKIE_LOCALE,
	availableLanguages,
	locales,
	isValidLanguage,
	Locale,
} from '@/lib/locale/locales';

interface LocaleSwitcherProps {
	locale: Locale;
}

/**
 * Eindeutige Sprachen mit der jeweils ersten Locale als Repräsentant.
 * de -> Deutsch, en -> English (unabhängig von regionalen Varianten)
 */
const uniqueLanguages = availableLanguages.map(
	(lang) => locales.find((l) => l.language === lang)!,
);

export default function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
	const pathname = usePathname();
	const segments = pathname.split('/').filter(Boolean);

	const currentIndex = uniqueLanguages.findIndex(
		(l) => l.language === locale.language,
	);
	const nextLocale = uniqueLanguages[(currentIndex + 1) % uniqueLanguages.length];

	function switchLocale() {
		// Cookie löschen, damit der Proxy die regionale Variante
		// für die neue Sprache per Accept-Language neu auflöst
		document.cookie = `${COOKIE_LOCALE}=;path=/;max-age=0`;

		const newSegments = [...segments];
		if (isValidLanguage(newSegments[0])) {
			newSegments[0] = nextLocale.language;
		} else {
			newSegments.unshift(nextLocale.language);
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
			<span className="text-sm">{locale.language.toUpperCase()}</span>
		</button>
	);
}