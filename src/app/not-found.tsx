import { DEFAULT_LOCALE } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import Link from 'next/link';

export default async function NotFound() {
	const locale = DEFAULT_LOCALE;

	return (
		<main className="flex-1 flex flex-col justify-center items-center">
			<h1 className="text-7xl mb-8">
				<span className="font-bold">404</span> – {t(locale, '404.title')}
			</h1>
			<Link href="/" className="underline hover:text-blue-400">
				{t(locale, '404.backhome')}
			</Link>
		</main>
	);
}