import Container from '@/components/layout/Container';
import { IconInstagram, IconLinkedIn, IconWhatsApp, IconYouTube } from '@/components/icons';
import IconMastodon from '@/components/icons/IconMastodon';
import Link from 'next/link';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="pb-24 w-full bg-white">
			<Container className="py-8">
				<div className="flex flex-col items-start md:flex-row justify-between gap-y-8 mb-4">
					<ul className="flex flex-row items-center gap-4 order-1">
						<li>
							<Link className="bt-link-bold" title="Hilfe" href="/services/hilfe">Hilfe</Link>
						</li>

						<li>
							<Link className="bt-link-bold" title="Kontakt" href="/services/kontakt">Kontakt</Link>
						</li>

						<li>
							<Link className="bt-link-bold" title="Inhaltsübersicht" href="/services/inhaltsuebersicht">Inhaltsübersicht</Link>
						</li>
					</ul>

					<ul className="flex flex-row items-center gap-8 font-bold md:order-2">
						<li>
							<button title="Instagram" className="text-sm flex flex-row items-center gap-2">
								<IconInstagram className="w-8 h-8" />
								<span className="hidden lg:block">Instagram</span>
							</button>
						</li>

						<li>
							<button title="LinkedIn" className="text-sm flex flex-row items-center gap-2">
								<IconLinkedIn className="w-8 h-8" />
								<span className="hidden lg:block">LinkedIn</span>
							</button>
						</li>

						<li>
							<button title="Mastodon" className="text-sm flex flex-row items-center gap-2">
								<IconMastodon className=" w-8 h-8" />
								<span className="hidden lg:block">Mastodon</span>
							</button>
						</li>

						<li>
							<button title="WhatsApp" className="text-sm flex flex-row items-center gap-2">
								<IconWhatsApp className="w-8 h-8" />
								<span className="hidden lg:block">WhatsApp</span>
							</button>
						</li>

						<li>
							<button title="YouTube" className="text-sm flex flex-row items-center gap-2">
								<IconYouTube className="w-8 h-8" />
								<span className="hidden lg:block">YouTube</span>
							</button>
						</li>
					</ul>
				</div>

				<div className="flex flex-col md:flex-row justify-between gap-y-3.5">
					<div className="text-sm order-1">© {currentYear} | Deutscher Bundestag</div>

					<ul className="flex flex-row items-center gap-4 md:order-2">
						<li>
							<Link className="bt-link" title="Barrierefreiheit" href="/services/barrierefreiheit">Barrierefreiheit</Link>
						</li>

						<li>
							<Link className="bt-link" title="Datenschutz" href="/services/datenschutz">Datenschutz</Link>
						</li>

						<li>
							<Link className="bt-link" title="Impressum" href="/services/impressum">Impressum</Link>
						</li>
					</ul>
				</div>
			</Container>
		</footer>
	);
}