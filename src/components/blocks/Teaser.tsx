import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface TeaserProps {
	blok: SbBlokData & {
		headline: string;
	};
}

const Teaser = ({ blok }: TeaserProps) => {
	return (
		<div className="max-w-bt mx-auto w-full px-4 md:px-8">
			<div className="bg-amber-100 rounded-3xl text-center p-16 text-2xl font-bold" {...storyblokEditable(blok)}>
				<h1>{blok.headline}</h1>
			</div>
		</div>
	);
};

export default Teaser;
