import { getServerLocale } from '@/lib/locale/server';

export default async function NotFound() {
	const locale = await getServerLocale();

	let headlineTitle = 'Seite nicht gefunden';
	let linkTitle = 'Zurück zur Startseite'

	if (locale?.urlSegment === 'en') {
		headlineTitle = 'Page not found';
		linkTitle = 'Back to home page';
	}

	return (
		<main className="flex-1 flex flex-col justify-center items-center">
			<h1 className="text-7xl mb-8"><span className="font-bold">404</span> – {headlineTitle}</h1>
			<a href="/" className="underline hover:text-blue-400">{linkTitle}]</a>
		</main>
	);
}