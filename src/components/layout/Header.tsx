import Link from 'next/link';
import { IconBundestagDesktop, IconBundestagMobile } from '@/components/icons';
import Container from '@/components/layout/Container';
import ServiceBar from '@/components/layout/ServiceBar';
import Navigation from '@/components/layout/Navigation';
import { getServerLocale } from '@/lib/locale/server';
import { t } from '@/lib/i18n';

export default async function Header() {
	const locale = await getServerLocale();

	return (
		<header className="shadow-md shadow-gray-20">
			<ServiceBar locale={locale} />

			<Container className="py-5 bg-white">
				<div className="flex justify-center sm:justify-start">
					<Link href="/" className="hover:cursor-pointer" title={t(locale, 'home')} aria-label={t(locale, 'home')}>
						<IconBundestagDesktop className="hidden sm:block" />
						<IconBundestagMobile className="block sm:hidden" />
					</Link>
				</div>
			</Container>

			<Navigation locale={locale} />
		</header>
	);
}