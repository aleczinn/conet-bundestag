import Container from '@/components/layout/Container';
import Link from 'next/link';
import { IconMenuOff, IconSearch } from '@/components/icons';
import { Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';

interface NavigationProps {
	locale: Locale;
}

export default function Navigation({ locale }: NavigationProps) {
	const titleSearch = t(locale, 'generic.search');
	const titleMenu = t(locale, 'generic.menu');

	return (
			<Container as="nav" className="h-16 bg-gray-20" aria-label={t(locale, 'header.navigation.flyout')}>
				<ul className="flex flex-row gap-6 justify-end items-center h-full lg:justify-between lg:gap-0">
					<li className="hidden lg:flex flex-col items-center">
						<Link href="/" className="text-gray-90 text-lg hover:cursor-pointer">
							template
						</Link>
					</li>

					<li className="flex flex-col items-center">
						<button title={titleSearch} className="text-gray-90 text-lg hover:cursor-pointer">
							<span className="sr-only">{titleSearch}</span>
							<IconSearch />
						</button>
					</li>

					<li className="flex lg:hidden flex-col items-center">
						<button title={titleMenu} className="text-gray-90 text-lg hover:cursor-pointer">
							<span className="sr-only">{titleMenu}</span>
							<IconMenuOff />
						</button>
					</li>
				</ul>
			</Container>
	);
}