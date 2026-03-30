import { Container } from '@/components/layout';
import Link from 'next/link';
import { IconEasy, IconGlobe, IconSign } from '@/components/icons';
import { getLocale } from '@/lib/i18n/server';

export default async function ServiceBar() {
	const locale = await getLocale();

	const isGebaerdensprache = false;
	const isLeichteSprache = false;

	return (
		<Container as="nav" className="h-10 bg-gray-10" aria-label="Servicenavigation">
			<ul className="h-full flex flex-row justify-end items-center gap-8">
				<li>
					<Link href="/gebaerdensprache"
								title="Gebärdensprache"
								className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
					>
						<IconSign />
						<span className="hidden md:block text-sm underlineAnimation">Gebärdensprache</span>
					</Link>
				</li>

				<li>
					<Link href="/leichte_sprache"
								title="Leichte Sprache"
								className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
					>
						<IconEasy />
						<span className="hidden md:block text-sm underlineAnimation">Leichte Sprache</span>
					</Link>
				</li>

				{/*<li>*/}
				{/*	<Link href="/"*/}
				{/*				title="Zur deutschen Startseite"*/}
				{/*				className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"*/}
				{/*	>*/}
				{/*		<IconSign />*/}
				{/*		<span className="hidden md:block text-sm underlineAnimation">Zur deutschen Startseite</span>*/}
				{/*	</Link>*/}
				{/*</li>*/}

				<li>
					<button title="Sprachmenü öffnen"
									aria-label="Sprachmenü öffnen"
									className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
					>
						<IconGlobe />
						<span className="text-sm">{locale.toUpperCase()}</span>
					</button>
				</li>
			</ul>
		</Container>
	);
}