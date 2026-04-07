import Image from 'next/image';

interface StoryblokAsset {
	filename: string;
	alt?: string | null;
	title?: string | null;
	is_external_url?: boolean;
}

interface StoryblokMediaProps {
	asset: StoryblokAsset;
	className?: string;
	sizes?: string;
}

function getMediaType(filename: string): 'image' | 'video' {
	const ext = filename.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
	return ['mp4', 'webm', 'ogg', 'mov'].includes(ext) ? 'video' : 'image';
}

function toEmbedUrl(url: string): string | null {
	// YouTube: watch?v=ID → embed/ID
	const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
	if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

	// Vimeo: vimeo.com/ID → player.vimeo.com/video/ID
	const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
	if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

	// Andere externe URLs direkt als iframe-src verwenden
	return url;
}

export default function StoryblokMedia({
																				 asset,
																				 className,
																				 sizes = '(max-width: 768px) 100vw, 50vw',
																			 }: StoryblokMediaProps) {
	if (!asset?.filename) return null;

	// Externer Link (YouTube, Vimeo etc.)
	if (asset.is_external_url) {
		const embedUrl = toEmbedUrl(asset.filename);
		if (!embedUrl) return null;

		return (
			<iframe src={embedUrl}
							className={className}
							allowFullScreen
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							title={asset.title ?? asset.alt ?? 'Video'}
			/>
		);
	}

	const type = getMediaType(asset.filename);

	if (type === 'video') {
		return (
			<video src={asset.filename}
						 className={className}
						 controls
						 playsInline
						 aria-label={asset.alt ?? ''}
			/>
		);
	}

	// Bild — fill braucht einen relativen Parent-Container
	return (
		<div className={`relative overflow-hidden ${className ?? ''}`}>
			<Image src={asset.filename}
						 alt={asset.alt ?? ''}
						 title={asset.title ?? undefined}
						 fill
						 sizes={sizes}
						 className="object-cover"
			/>
		</div>
	);
}