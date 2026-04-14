import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface TeaserProps {
	blok: SbBlokData & {
		headline: string;
	};
}

export default function Teaser({ blok }: TeaserProps) {
	return (
		<div className="max-w-bt mx-auto w-full px-4 md:px-8">
			<div className="bg-gray-90 text-gray-10 rounded-3xl text-center p-16 text-2xl font-bold" {...storyblokEditable(blok)}>
				<h1>{blok.headline}</h1>
			</div>
		</div>
	);
};
