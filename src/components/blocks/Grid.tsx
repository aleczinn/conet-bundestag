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
	<div className="max-w-bt mx-auto w-full px-4 md:px-8">
		<div {...storyblokEditable(blok)} className="grid grid-cols-3 gap-4">
			{blok.columns.map((nestedBlok) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</div>
	</div>
);

export default Grid;
