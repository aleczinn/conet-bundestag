import {
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import { Breadcrumbs } from '@/components/layout';

interface PageProps {
	blok: SbBlokData & {
		body: SbBlokData[];
	};
}

const Page = ({ blok }: PageProps) => (
	<main className="flex-1" {...storyblokEditable(blok)}>
		<Breadcrumbs/>

		<div className="flex flex-col gap-12">
			{blok.body?.map((nestedBlok) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</div>
	</main>
);

export default Page;
