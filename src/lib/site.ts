import { AnnouncementBarItem } from '@/components/layout/AnnouncementBar';

export const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL ||
	process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
	'http://localhost:3000';

export const SITE_SHORTCUT = process.env.NEXT_PUBLIC_SITE_SHORTCUT || 'BT';
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Deutscher Bundestag';
export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '';

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

export function getActiveAnnouncementBar(items: AnnouncementBarItem[]): AnnouncementBarItem | null {
	if (!items?.length) {
		return null;
	}

	const now = new Date();

	return items.find((item) => {
		if (!item.enabled) {
			return false;
		}
		if (item.start_date && new Date(item.start_date) > now) {
			return false;
		}
		return !(item.end_date && new Date(item.end_date) < now);
	}) ?? null;
}