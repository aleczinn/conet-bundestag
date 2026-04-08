import Image from 'next/image';
import { ComponentPropsWithoutRef, CSSProperties } from 'react';
import YouTubeFacade from '@/components/ui/YouTubeFacade';

interface StoryblokAsset {
	filename: string;
	alt?: string | null;
	title?: string | null;
	is_external_url?: boolean;
}

interface StoryblokMediaProps {
	asset: StoryblokAsset;
	width?: number;
	height?: number;
	className?: string;
	priority?: boolean;
	imgProps?: Omit<ComponentPropsWithoutRef<typeof Image>,'src' | 'alt' | 'width' | 'height' | 'fill' | 'loader'>;
	videoProps?: Omit<ComponentPropsWithoutRef<'video'>, 'src'>;
	iframeProps?: Omit<ComponentPropsWithoutRef<'iframe'>, 'src' | 'title'>;
}

type MediaType = 'image' | 'video' | 'embed';
type EmbeddedType = 'youtube' | 'vimeo' | 'other';

function detectMediaType(filename: string, isExternal?: boolean): MediaType {
	if (isExternal) {
		return 'embed';
	}
	const ext = filename.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
	return ['mp4', 'webm', 'ogg', 'mov'].includes(ext) ? 'video' : 'image';
}

/**
 * Parst WIDTHxHEIGHT aus dem Storyblok-Pfad.
 * z. B. /f/123/1920x1080/abc/bild.jpg → { width: 1920, height: 1080 }
 */
function parseStoryblokDimensions(url: string): { width: number; height: number } | null {
	const match = url.match(/\/(\d+)x(\d+)\//);
	if (!match) {
		return null;
	}
	const w = parseInt(match[1], 10);
	const h = parseInt(match[2], 10);
	return w > 0 && h > 0 ? { width: w, height: h } : null;
}

/**
 * Löst die finalen Render-Dimensionen auf.
 *
 * Beispiel: Original 1920×1080, prop width=1280 -> height = round(1280 × (1080 / 1920)) = 720
 */
function resolveDimensions(propWidth?: number, propHeight?: number, intrinsic?: {
	width: number;
	height: number
} | null): { width: number; height: number } | null {
	// Beide Props gesetzt → direkt verwenden
	if (propWidth && propHeight) return { width: propWidth, height: propHeight };

	const ratio = intrinsic ? intrinsic.height / intrinsic.width : null;

	// Nur width → height aus Ratio errechnen
	if (propWidth && ratio) {
		return { width: propWidth, height: Math.round(propWidth * ratio) };
	}

	// Nur height → width aus Ratio errechnen
	if (propHeight && ratio && intrinsic) {
		return { width: Math.round(propHeight / ratio), height: propHeight };
	}

	// Nichts angegeben → intrinsische Dimensionen aus URL
	if (intrinsic) return intrinsic;

	return null;
}

function getEmbeddedUrl(url: string): { url: string, type: EmbeddedType, videoId?: string } {
	// YouTube: watch?v=ID -> embed/ID
	const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
	if (ytMatch) {
		return {
			url: `https://www.youtube.com/embed/${ytMatch[1]}`,
			type: 'youtube',
			videoId: ytMatch[1],
		};
	}

	// Vimeo: vimeo.com/ID -> player.vimeo.com/video/ID
	const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
	if (vimeoMatch) {
		return {
			url: `https://player.vimeo.com/video/${vimeoMatch[1]}`	,
			type: 'vimeo',
		}
	}

	// Andere externe URLs direkt als iframe-src verwenden
	return {url, type: 'other'};
}

function buildAspectStyle(w?: number, h?: number): CSSProperties {
	return w && h ? { aspectRatio: `${w} / ${h}` } : {};
}

export default function StoryblokMedia({
																				 asset,
																				 width,
																				 height,
																				 className,
																				 priority = false,
																				 imgProps,
																				 videoProps,
																				 iframeProps,
																			 }: StoryblokMediaProps) {
	if (!asset?.filename) {
		return null;
	}

	const mediaType = detectMediaType(asset.filename, asset.is_external_url);

	// BILD
	if (mediaType === 'image') {
		const intrinsic = parseStoryblokDimensions(asset.filename);
		const dims = resolveDimensions(width, height, intrinsic);
		const alt = asset.alt ?? asset.title ?? '';

		if (dims) {
			return (
				<Image src={asset.filename}
							 alt={alt}
							 width={dims.width}
							 height={dims.height}
							 priority={priority}
							 style={{ width: '100%', height: 'auto' }}
							 // sizes erklärt dem Browser welche Breite das Bild im Layout hat.
							 // next/image nutzt das um das optimale srcset-Element zu wählen.
							 // Überschreiben via imgProps falls man andere Breakpoints brauchst.
							 sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
							 className={className}
							 {...imgProps}
				/>
			)
		}

		// Fallback: Keine Dimensionen ermittelbar -> fill-Modus
		// Container braucht definierte Höhe (per className von außen)
		return (
			<div className={`relative overflow-hidden ${className ?? ''}`}>
				<Image src={asset.filename}
							 alt={alt}
							 fill
							 priority={priority}
							 sizes="100vw"
							 style={{ objectFit: 'cover' }}
							 {...imgProps}
				/>
			</div>
		)
	}

	// VIDEO
	const aspectStyle = buildAspectStyle(width, height);
	const wrapperStyle: CSSProperties = Object.keys(aspectStyle).length > 0 ? aspectStyle : { aspectRatio: '16 / 9' };

	if (mediaType === 'video') {
		const hasAutoplay = videoProps?.autoPlay === true;

		return (
			<div className={`overflow-hidden ${className ?? ''}`} style={wrapperStyle}>
				<video src={asset.filename}
							 controls
							 playsInline
							 preload={hasAutoplay ? 'auto' : 'metadata'}
							 style={{ width: '100%', height: '100%' }}
							 {...videoProps}
				/>
			</div>
		);
	}

	// EXTERNAL VIDEOS
	if (mediaType === 'embed') {
		const { url, type, videoId } = getEmbeddedUrl(asset.filename);
		const label = asset.title ?? asset.alt ?? 'Eingebettetes Video';

		// YOUTUBE
		if (type === 'youtube' && videoId) {
			return (
				<div className={`bg-gray-20 overflow-hidden ${className ?? ''}`} style={wrapperStyle}>
					<YouTubeFacade videoId={videoId} title={label} />
				</div>
			);
		}

		// Vimeo / andere -> normaler iframe
		return (
			<div className={`bg-gray-20 overflow-hidden ${className ?? ''}`} style={wrapperStyle}>
				<a href={asset.filename}
					 target="_blank"
					 rel="noopener noreferrer"
					 className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:px-2 focus:py-1 focus:text-sm focus-visible-facelift">
					{label} auf {new URL(asset.filename).hostname} öffnen
				</a>

				<iframe src={url}
								title={label}
								tabIndex={-1}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								loading="lazy"
								sandbox="allow-scripts allow-same-origin allow-presentation"
								style={{ width: '100%', height: '100%', border: 'none' }}
								{...iframeProps}
				/>
			</div>
		);
	}

	return (
		<div>no media type found</div>
	);
}