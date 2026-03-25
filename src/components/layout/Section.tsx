import { ElementType, ComponentPropsWithoutRef } from 'react';

type SectionProps<T extends ElementType> = {
	as?: T;
} & ComponentPropsWithoutRef<T>;

export default function Section<T extends ElementType = 'section'>({
																																		 as,
																																		 className,
																																		 children,
																																		 ...props
																																	 }: SectionProps<T>) {
	const Component = as || 'section';

	return (
		<Component className={`max-w-bt mx-auto w-full px-4 md:px-8 ${className || ''}`} {...props}>
			{children}
		</Component>
	);
}