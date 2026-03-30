import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import StoryblokProvider from '../components/StoryblokProvider';
import { Footer, Header } from '@/components/layout';
import { BASE_URL, SITE_NAME } from '@/lib/site';
import { getLocale } from '@/lib/i18n/server';

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
	const locale = await getLocale();

	return (
		<StoryblokProvider>
			<html lang={locale}>
				<body className="bg-white subpixel-antialiased flex flex-col w-full min-h-screen">
					<Header/>
					{children}
					<Footer/>
				</body>
			</html>
		</StoryblokProvider>
	);
}
