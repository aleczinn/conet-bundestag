import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import StoryblokProvider from '../components/StoryblokProvider';
import { BASE_URL, SITE_NAME } from '@/lib/site';
import { getServerLocale } from '@/lib/locale/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { getGlobalConfig } from '@/lib/storyblok-queries';

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	title: {
		default: SITE_NAME,
		template: `${SITE_NAME} - %s`,
	},
};

interface RootLayoutProps {
	children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
	const locale = await getServerLocale();
	const config = await getGlobalConfig();

	return (
		<StoryblokProvider>
			<html lang={locale.language} data-scroll-behavior="smooth">
				<body className="bg-white subpixel-antialiased flex flex-col w-full min-h-screen">
					<AnnouncementBar items={config.announcement_bars ?? []} />
					<Header/>
					{children}
					<Footer/>
				</body>
			</html>
		</StoryblokProvider>
	);
}
