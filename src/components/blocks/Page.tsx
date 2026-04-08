import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface PageProps {
	blok: SbBlokData & {
		body: SbBlokData[];
	};
}

const Page = ({ blok }: PageProps) => (
	<div className="flex flex-col" {...storyblokEditable(blok)}>
		{blok.body?.map((nestedBlok, index) => (
			<div key={nestedBlok._uid} className={index % 2 !== 0 ? 'bg-white' : ''}>
				<StoryblokServerComponent blok={nestedBlok} priority={index === 0} />
			</div>
		))}
	</div>
);

export default Page;
