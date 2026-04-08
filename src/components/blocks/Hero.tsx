import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface HeroProps {
	blok: SbBlokData & {
		headline: string;
		text: string;
	};
	priority?: boolean;
}

const Hero = ({ blok, priority = false }: HeroProps) => {
	return (
		<div className="bg-amber-600 w-full min-h-80 flex flex-col justify-center items-center" {...storyblokEditable(blok)}>
			<h1>{blok.headline}</h1>
			<p>{blok.text}</p>
		</div>
	);
};

export default Hero;
