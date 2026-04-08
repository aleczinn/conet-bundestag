import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';

interface PageProps {
	blok: SbBlokData & {
		body: SbBlokData[];
	};
}

const Page = ({ blok }: PageProps) => (
	<div className="flex flex-col" {...storyblokEditable(blok)}>
		{/*{blok.body?.map((nestedBlok) => (*/}
		{/*	<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />*/}
		{/*))}*/}

		{blok.body?.map((nestedBlok, index) => (
			<div key={nestedBlok._uid} className={index % 2 !== 0 ? 'bg-white' : ''}>
				<StoryblokServerComponent blok={nestedBlok} />
			</div>
		))}
	</div>
);

export default Page;
