import { Locale, LocaleKey, localeMap } from '@/lib/locale/locales';
import { localeKeys } from '@/lib/locale/locales';

type Translations = Record<string, string>;

// Alle Übersetzungen beim Build/Start einmalig laden
const translationMap: Record<LocaleKey, Translations> = {} as any;

for (const key of localeKeys) {
	// Dynamic import geht hier nicht synchron – stattdessen require-style
	// Da die JSONs statisch sind, werden sie vom Bundler inline aufgelöst
	translationMap[key] = require(`./translations/${key}.json`);
}

function resolveLocaleKey(locale: Locale): LocaleKey {
	const found = localeKeys.find((k) => localeMap[k].urlSegment === locale.urlSegment);
	return found ?? localeKeys[0];
}

function resolve(obj: Record<string, unknown>, key: string): string | undefined {
	const parts = key.split('.');
	let current: unknown = obj;

	for (const part of parts) {
		if (current == null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}

	return typeof current === 'string' ? current : undefined;
}

/**
 * Übersetzt einen Key für die gegebene Locale.
 * Fallback: Key selbst (macht fehlende Übersetzungen sofort sichtbar).
 */
export function t(locale: Locale, key: string): string {
	const localeKey = resolveLocaleKey(locale);

	return resolve(translationMap[localeKey], key)
		?? resolve(translationMap[localeKeys[0]], key)
		?? key;
}