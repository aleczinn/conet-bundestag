import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface FeatureProps {
	blok: SbBlokData & {
		name: string;
	};
}

const Feature = ({ blok }: FeatureProps) => {
	return (
		<div className="p-8 bg-blue-100 text-center rounded-3xl font-semibold" {...storyblokEditable(blok)}>
			<span>{blok.name}</span>
		</div>
	);
};

export default Feature;
