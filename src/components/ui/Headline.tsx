import { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

type HeadlineTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

type HeadlineProps<T extends HeadlineTag = 'h2'> = {
	as?: T;
	design?: HeadlineTag;
} & ComponentPropsWithoutRef<T>;

const designClasses: Record<HeadlineTag, string> = {
	h1: 'font-serif text-5xl font-bold',
	h2: 'font-serif text-4xl font-bold',
	h3: 'font-serif text-3xl font-bold pt-1 border-t-2 border-solid border-gray-90',
	h4: 'font-serif text-2xl font-semibold',
	h5: 'font-serif text-xl font-semibold',
	h6: 'font-serif text-lg font-semibold',
	p:  'font-sans text-base',
};

export function Headline({
													 as,
													 design,
													 className,
													 children,
													 ...props
												 }: HeadlineProps) {
	const Tag = (as ?? 'h2') as ElementType;

	return (
		<Tag className={cn('w-fit text-gray-90', designClasses[design ?? (as ?? 'h2')], className)} {...props}>
			{children}
		</Tag>
	);
}