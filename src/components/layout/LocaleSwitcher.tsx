'use client';

import { IconGlobe } from '@/components/icons';
import { t } from '@/lib/i18n';
import { COOKIE_LOCALE, availableLanguages, locales, Locale } from '@/lib/locale/locales';

interface LocaleSwitcherProps {
	locale: Locale;
	alternates: Record<string, string>; // lang -> href
}

const uniqueLanguages = availableLanguages.map(
	(lang) => locales.find((l) => l.language === lang)!,
);

export default function LocaleSwitcher({ locale, alternates }: LocaleSwitcherProps) {
	const currentIndex = uniqueLanguages.findIndex((l) => l.language === locale.language);
	const nextLocale = uniqueLanguages[(currentIndex + 1) % uniqueLanguages.length];

	function switchLocale() {
		document.cookie = `${COOKIE_LOCALE}=;path=/;max-age=0`;
		window.location.href = alternates[nextLocale.language] ?? `/${nextLocale.language}`;
	}

	const title = `${t(locale, 'header.change_langauge_to')} ${nextLocale.label}`;

	return (
		<button onClick={switchLocale}
						title={title}
						aria-label={title}
						className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
		>
			<IconGlobe />
			<span className="text-sm">{locale.language.toUpperCase()}</span>
		</button>
	);
}