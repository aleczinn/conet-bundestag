import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText, SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';

type Layout = 'media_left' | 'media_right';

interface MediaWithTextProps {
	blok: SbBlokData & {
		layout: Layout;
		media: any;
		tagline?: string;
		headline: string;
		text: any;
		button_text?: string;
		button_url?: any;
	};
}

const MediaWithText = ({ blok }: MediaWithTextProps) => {
	const isMediaLeft = blok.layout === 'media_left';

	return (
		<Section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8" {...storyblokEditable(blok)}>
			<div className={`flex flex-col justify-center ${isMediaLeft ? 'order-1' : 'order-2'}`}>
				<div className="w-full h-full bg-blue-300">media</div>
			</div>

			<div className={`flex flex-col justify-center ${isMediaLeft ? 'order-2' : 'order-1'}`}>
				{blok.tagline && (
					<span className="font-serif text-gray-70">{blok.tagline}</span>
				)}

				{blok.headline && (
					<h3 className="font-serif text-gray-90 text-3xl mb-4">{blok.headline}</h3>
					// <Headline></Headline>
				)}

				{blok.text && (
					<span className="[&_p:not(:last-child)]:mb-2"
								dangerouslySetInnerHTML={{ __html: renderRichText(blok.text) }}
					/>
				)}

				{blok.button_text && (
					<Button className="mt-4" variant="primary" mode="dark">
						{blok.button_text}
					</Button>
				)}
			</div>
		</Section>
	);
};

export default MediaWithText;
