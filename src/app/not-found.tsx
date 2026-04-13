import { getServerLocale } from '@/lib/locale/server';
import { t } from '@/lib/i18n';
import Link from 'next/link';

export default async function NotFound() {
	const locale = await getServerLocale();

	const headlineTitle = t(locale, '404.title');
	const linkTitle = t(locale, '404.backhome');

	return (
		<main className="flex-1 flex flex-col justify-center items-center">
			<h1 className="text-7xl mb-8"><span className="font-bold">404</span> – {headlineTitle}</h1>
			<Link href="/" className="underline hover:text-blue-400">
				{linkTitle}
			</Link>
		</main>
	);
}