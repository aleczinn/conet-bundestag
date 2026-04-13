import Link from 'next/link';
import { IconEasy, IconGlobe, IconSign } from '@/components/icons';
import LocaleSwitcher from '@/components/layout/LocaleSwitcher';
import { Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import Section from '@/components/layout/Section';

interface ServiceBarProps {
	locale: Locale;
}

export default function ServiceBar({ locale }: ServiceBarProps) {
	const isGebaerdensprache = false;
	const isLeichteSprache = false;
	const isPageGerman = locale.language === 'de';

	const titleSignLanguage = t(locale, 'header.sign_language');
	const titleSimpleLanguage = t(locale, 'header.simple_language');
	const titleBackToGerman = t(locale, 'header.back_to_german');

	return (
		<Section as="nav" variant="full" className="h-10 bg-gray-10" aria-label="Servicenavigation">
			<ul className="h-full flex flex-row justify-end items-center gap-8">
				{(isPageGerman || isLeichteSprache) && (
					<li>
						<Link href="/gebaerdensprache"
									title={titleSignLanguage}
									className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
						>
							<IconSign />
							<span className="hidden md:block text-sm underlineAnimation">{titleSignLanguage}</span>
						</Link>
					</li>
				)}

				{(isPageGerman || isGebaerdensprache) && (
					<li>
						<Link href="/leichte_sprache"
									title={titleSimpleLanguage}
									className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
						>
							<IconEasy />
							<span className="hidden md:block text-sm underlineAnimation">{titleSimpleLanguage}</span>
						</Link>
					</li>
				)}

				{(!isPageGerman || isGebaerdensprache || isLeichteSprache) && (
					<li>
						<a href="/de"
									title={titleBackToGerman}
									className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
						>
							<span className="hidden md:block text-sm underlineAnimation">{titleBackToGerman}</span>
						</a>
					</li>
				)}

				<li>
					<LocaleSwitcher locale={locale} />
				</li>
			</ul>
		</Section>
	);
}