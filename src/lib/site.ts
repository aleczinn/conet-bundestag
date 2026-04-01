export const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL ||
	process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
	'http://localhost:3000';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Deutscher Bundestag';
export const SITE_SHORTCUT = process.env.NEXT_PUBLIC_SITE_SHORTCUT || 'BT';

/**
 * Entfernt das Locale-Prefix aus dem Catch-All-Slug und gibt den
 * reinen Content-Slug zurück, den Storyblok erwartet.
 *
 * Beispiele:
 *   ['de']           → 'home'
 *   ['de', 'about']  → 'about'
 *   ['en', 'a', 'b'] → 'a/b'
 *   undefined         → 'home'
 */
export function extractContentSlug(slug?: string[]): string {
	if (!slug || slug.length <= 1) {
		return 'home';
	}
	return slug.slice(1).join('/');
}