import { ElementType, ComponentPropsWithoutRef } from 'react';

type ContainerProps<T extends ElementType> = {
	as?: T;
} & ComponentPropsWithoutRef<T>;

export default function Container<T extends ElementType = 'div'>({
																																	 as,
																																	 className,
																																	 children,
																																	 ...props
																																 }: ContainerProps<T>) {
	const Component = as || 'div';

	return (
		<Component className={`px-4 md:px-8 ${className || ''}`} {...props}>
			{children}
		</Component>
	);
}