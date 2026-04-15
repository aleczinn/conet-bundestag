import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import StoryblokProvider from '../components/StoryblokProvider';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
};

interface RootLayoutProps {
	children: ReactNode;
}

// Root-Layout ist absichtlich minimal: <html> und <body> kommen aus [lang]/layout.tsx
// damit das lang-Attribut aus der URL kommt (statisch, kein headers()-Aufruf nötig).
export default function RootLayout({ children }: RootLayoutProps) {
	return <StoryblokProvider>{children}</StoryblokProvider>;
}

// export default function RootLayout({ children }: RootLayoutProps) {
// 	return (
// 		<html data-scroll-behavior="smooth">
// 			<body className="bg-white subpixel-antialiased flex flex-col w-full min-h-screen">
// 				<StoryblokProvider>{children}</StoryblokProvider>
// 			</body>
// 		</html>
// 	);
// }

// export default async function RootLayout({ children }: RootLayoutProps) {
// 	const locale = await getServerLocale();
// 	const config = await getGlobalConfig();
// 	const siteMeta = await getSiteMeta();
// 	const activeAnnouncementBar = getActiveAnnouncementBar(config.announcement_bars ?? []);
//
// 	return (
// 		<StoryblokProvider>
// 			<html lang={locale.language} className={`${notoSans.variable} ${notoSerif.variable} ${notoSerifExtra.variable}`} data-scroll-behavior="smooth">
// 				<body className="bg-white subpixel-antialiased flex flex-col w-full min-h-screen">
// 					<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
// 							'@context': 'https://schema.org',
// 							'@type': 'Organization',
// 							name: siteMeta.name,
// 							url: BASE_URL,
// 							logo: `${BASE_URL}/logo.png`,
// 							sameAs: [
// 								'https://www.instagram.com/bundestag/',
// 								'https://www.linkedin.com/company/deutscher-bundestag-verwaltung',
// 							],
// 						}) }} />
// 					<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
// 							'@context': 'https://schema.org',
// 							'@type': 'WebSite',
// 							name: siteMeta.name,
// 							url: BASE_URL,
// 							inLanguage: 'de-DE'
// 						}) }} />
// 				  <SkipLinks locale={locale} />
// 					{activeAnnouncementBar && <AnnouncementBar locale={locale} item={activeAnnouncementBar} />}
// 					<Header/>
// 					{children}
// 					<Footer/>
// 				</body>
// 			</html>
// 		</StoryblokProvider>
// 	);
// }
