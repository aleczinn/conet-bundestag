import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import StoryblokProvider from '../components/StoryblokProvider';
import { Footer, Header } from '@/components/layout';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	title: {
		default: process.env.NEXT_PUBLIC_SITE_NAME || '',
		template: `${process.env.NEXT_PUBLIC_SITE_NAME || ''} - %s`,
	},
	description: 'Internetseite des Deutschen Bundestages: Informationen über das Parlament und die Abgeordneten, Tagesordnungen, Livestreams und Service-Angebote.',
	openGraph: {
		siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Deutscher Bundestag',
	}
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<StoryblokProvider>
			<html lang="en">
				<body className="bg-white subpixel-antialiased flex flex-col w-full min-h-screen">
					<Header/>
					{children}
					<Footer/>
				</body>
			</html>
		</StoryblokProvider>
	);
}
