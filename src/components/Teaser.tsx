import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface TeaserProps {
	blok: SbBlokData & {
		headline: string;
	};
}

const Teaser = ({ blok }: TeaserProps) => {
	return (
		<div className="teaser" {...storyblokEditable(blok)}>
			<h1>{blok.headline}</h1>
		</div>
	);
};

export default Teaser;
