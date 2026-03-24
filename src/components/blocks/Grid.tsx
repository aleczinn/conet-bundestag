import {
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface GridProps {
	blok: SbBlokData & {
		columns: SbBlokData[];
	};
}

const Grid = ({ blok }: GridProps) => (
		<div {...storyblokEditable(blok)} className="grid grid-cols-3 gap-4">
				 {blok.columns.map((nestedBlok) => (
					 <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
				 ))}
		</div>
);

export default Grid;
