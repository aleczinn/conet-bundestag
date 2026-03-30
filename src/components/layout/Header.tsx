import Link from 'next/link';
import { Container, Navigation , ServiceBar} from '@/components/layout';
import { IconBundestagDesktop, IconBundestagMobile } from '@/components/icons';

export default function Header() {
	return (
		<header className="shadow-md shadow-gray-20">
			<ServiceBar />

			<Container className="py-5 bg-white">
				<div className="flex justify-center sm:justify-start">
					<Link href="/" className="hover:cursor-pointer" title="Startseite">
						<span role="img" aria-label="Deutscher Bundestag">
							<IconBundestagDesktop className="hidden sm:block" />
              <IconBundestagMobile className="block sm:hidden" />
						</span>
					</Link>
				</div>
			</Container>

			<Navigation />
		</header>
	);
}