import { Container } from '@/components/layout';
import Link from 'next/link';

export default function Breadcrumbs() {
	return (
		<Container as="nav" className="h-16 flex flex-row items-center bg-gray-10" aria-label="Brotkrumennavigation">
			<ol className="flex flex-wrap items-center gap-2">
				<li className="flex items-center gap-2">
					<span className="text-sm text-gray-40" aria-hidden="true">|</span>

					<Link href="" className="text-sm text-gray-90 hover:underline hover:cursor-pointer">
						asd
					</Link>

					<span className="text-sm font-bold text-gray-90">
						text
					</span>
				</li>
			</ol>
		</Container>
	);
}