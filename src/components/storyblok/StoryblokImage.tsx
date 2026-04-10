import Image from 'next/image';
import { StoryblokMediaProps } from '@/components/storyblok/StoryblokMedia';
import { parseStoryblokDimensions, resolveDimensions } from '@/components/storyblok/utils';
import { FadeImage } from '@/components/ui/FadeImage';

type Props = Pick<StoryblokMediaProps, 'asset' | 'width' | 'height' | 'priority' | 'className'>;

export function StoryblokImage({ asset, width, height, priority, className }: Props) {
	const intrinsic = parseStoryblokDimensions(asset.filename);
	const dims = resolveDimensions(width, height, intrinsic);
	const alt = asset.alt ?? asset.title ?? '';

	if (dims) {
		const SharedProps = {
			src: asset.filename,
			alt,
			width: dims.width,
			height: dims.height,
			style: { width: '100%', height: 'auto' } as const,
			className,
		};

		// Priority-Bilder: kein Fade nötig, Server Component reicht
		if (priority) {
			return (
				<Image {...SharedProps}
							 priority={priority}
							 className={`skeleton-pulse ${className ?? ''}`}
				/>
			);
		}

		return <FadeImage {...SharedProps} />;
	}

	// Fallback: Keine Dimensionen -> fill-Modus
	return (
		<div className={`relative overflow-hidden skeleton-pulse ${className ?? ''}`}
				 style={{ aspectRatio: '16 / 9', width: '100%' }}
		>
			<Image src={asset.filename}
						 alt={alt}
						 fill
						 priority={priority}
						 sizes="(max-width: 768px) 100vw, 50vw"
						 style={{ objectFit: 'cover' }}
			/>
		</div>
	);
}