import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import StoryblokProvider from '../components/StoryblokProvider';
import { Footer, Header } from '@/components/layout';
import { BASE_URL, SITE_NAME } from '@/lib/site';
import { headers } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_SEGMENT_PATTERN } from '@/lib/locales';

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
	const headersList = await headers();
	const pathname = headersList.get('x-pathname') ?? `/${DEFAULT_LOCALE}`;

	const localeSegment = pathname.split('/')[1] ?? DEFAULT_LOCALE;
	const lang = LOCALE_SEGMENT_PATTERN.test(localeSegment) ? localeSegment : DEFAULT_LOCALE;

	return (
		<StoryblokProvider>
			<html lang={lang}>
				<body className="bg-white subpixel-antialiased flex flex-col w-full min-h-screen">
					<Header/>
					{children}
					<Footer/>
				</body>
			</html>
		</StoryblokProvider>
	);
}
