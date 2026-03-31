import { getServerLocale } from '@/lib/locale/server';
import { t } from '@/lib/i18n';

export default async function NotFound() {
	const locale = await getServerLocale();

	const headlineTitle = t(locale, 'notFound.title');
	const linkTitle = t(locale, 'notFound.backhome');

	return (
		<main className="flex-1 flex flex-col justify-center items-center">
			<h1 className="text-7xl mb-8"><span className="font-bold">404</span> – {headlineTitle}</h1>
			<a href="/" className="underline hover:text-blue-400">{linkTitle}</a>
		</main>
	);
}