import Container from '@/components/layout/Container';
import Link from 'next/link';
import { IconMenuOff, IconSearch } from '@/components/icons';

export default function Navigation() {
	return (
			<Container as="nav" className="h-16 bg-gray-20" aria-label="Flyout-Navigation">
				<ul className="flex flex-row gap-6 justify-end items-center h-full lg:justify-between lg:gap-0">
					<li className="hidden lg:flex flex-col items-center">
						<Link href="/" className="text-gray-90 text-lg hover:cursor-pointer">
							template
						</Link>
					</li>

					<li className="flex flex-col items-center">
						<button title="Suche" className="text-gray-90 text-lg hover:cursor-pointer">
							<span className="sr-only">Suche</span>
							<IconSearch />
						</button>
					</li>

					<li className="flex lg:hidden flex-col items-center">
						<button title="Suche" className="text-gray-90 text-lg hover:cursor-pointer">
							<span className="sr-only">Menü</span>
							<IconMenuOff />
						</button>
					</li>
				</ul>
			</Container>
	);
}