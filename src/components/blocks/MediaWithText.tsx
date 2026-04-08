import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText, SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import StoryblokMedia from '@/components/ui/StoryblokMedia';

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
	priority?: boolean;
}

const MediaWithText = ({ blok, priority = false }: MediaWithTextProps) => {
	const isMediaLeft = blok.layout === 'media_left';

	return (
		<Section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16" {...storyblokEditable(blok)}>
			<div className={`flex flex-col justify-center ${isMediaLeft ? 'order-1' : 'order-2'}`}>
				<StoryblokMedia asset={blok.media} width={800} priority={priority} className="rounded-2xl" />
			</div>

			<div className={`flex flex-col justify-center ${isMediaLeft ? 'order-2' : 'order-1'}`}>
				{blok.tagline && (
					<span className="font-serif text-gray-70">{blok.tagline}</span>
				)}

				{blok.headline && (
					<Headline as="h2" variant="h3" className="mb-4">{blok.headline}</Headline>
				)}

				{blok.text && (
					<span className="[&_p:not(:last-child)]:mb-2"
								dangerouslySetInnerHTML={{ __html: renderRichText(blok.text) ?? '' }}
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
