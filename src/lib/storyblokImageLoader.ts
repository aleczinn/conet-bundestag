export default function storyblokImageLoader({ src, width, quality }: {
	src: string;
	width: number;
	quality?: number;
}): string {
	const match = src.match(/\/(\d+)x(\d+)\//);
	const originalWidth = match ? parseInt(match[1], 10) : Infinity;

	// Nie größer als das Original anfordern
	const cappedWidth = Math.min(width, originalWidth);

	return `${src}/m/${cappedWidth}x0/filters:format(webp):quality(${quality ?? 75})`;
}