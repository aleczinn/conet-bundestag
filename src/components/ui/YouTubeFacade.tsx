// src/components/ui/YouTubeFacade.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IconYouTube } from '@/components/icons';

interface YouTubeFacadeProps {
	videoId: string;
	title: string;
}

export default function YouTubeFacade({ videoId, title }: YouTubeFacadeProps) {
	const [loaded, setLoaded] = useState(false);

	if (loaded) {
		return (
			<iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
							title={title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
				// Kein tabIndex={-1} wenn geladen – Nutzer soll mit Tastatur bedienen können
							style={{ width: '100%', height: '100%', border: 'none' }}
			/>
		);
	}

	return (
		<button onClick={() => setLoaded(true)}
			// relative ist nötig damit focus-visible-facelift ::before/::after funktioniert
						className="relative w-full h-full cursor-pointer group focus-visible-facelift"
						aria-label={`${title} auf YouTube abspielen`}
			// Verhindert doppeltes Abspielen bei schnellem Doppelklick
						type="button"
		>
			{/* Vorschaubild */}
			<Image src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
						 alt="" // leer – der Button-Label beschreibt den Inhalt bereits
						 fill
						 style={{ objectFit: 'cover' }}
						 sizes="(max-width: 768px) 100vw, 80vw"
			/>

			{/* Play-Button Overlay */}
			<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20">
				<IconYouTube className="w-full h-full text-gray-90/80 transition-colors duration-200 hover:text-youtube-red" />
			</span>

			{/* Sichtbares Label für Screenreader (visuell versteckt, aber nicht sr-only
          da der Button selbst aria-label hat – das reicht) */}
		</button>
	);
}