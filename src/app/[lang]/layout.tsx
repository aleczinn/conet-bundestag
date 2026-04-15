import { availableLanguages, DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale/locales';
import { getGlobalConfig } from '@/lib/storyblok-queries';
import { ReactNode } from 'react';
import SkipLinks from '@/components/layout/SkipLinks';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { getActiveAnnouncementBar } from '@/lib/site';

interface LangLayoutProps {
	children: ReactNode;
	params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
	return availableLanguages.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params,}: LangLayoutProps) {
	const { lang } = await params;
	const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE;
	const config = await getGlobalConfig(locale);
	const activeBar = getActiveAnnouncementBar(config.announcement_bars ?? []);

	return (
		<>
			<SkipLinks locale={locale} />
			{activeBar && (
				<AnnouncementBar locale={locale} item={activeBar} />
			)}
			<Header locale={locale} />
			{children}
			<Footer />
		</>
	);
}