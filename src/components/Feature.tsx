import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface FeatureProps {
	blok: SbBlokData & {
		name: string;
	};
}

const Feature = ({ blok }: FeatureProps) => {
	return (
		<div className="feature" {...storyblokEditable(blok)}>
			<span>{blok.name}</span>
		</div>
	);
};

export default Feature;
