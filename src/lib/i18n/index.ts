import {
	type Locale,
	type LocaleKey,
	localeKeys,
	localeMap,
	segmentDefaults,
} from '@/lib/locale/locales';

/**
 * Translations dynamisch laden – neue JSON-Dateien werden automatisch erkannt,
 * kein manueller Import nötig. Fehlende Dateien werden übersprungen.
 */
const translationMap: Partial<Record<LocaleKey, Record<string, unknown>>> = {};

for (const key of localeKeys) {
	try {
		translationMap[key] = require(`./translations/${key}.json`);
	} catch {
		// Keine JSON für diese Locale -> Fallback greift
	}
}

function resolve(obj: Record<string, unknown>, key: string): string | undefined {
	let current: unknown = obj;
	for (const part of key.split('.')) {
		if (current == null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === 'string' ? current : undefined;
}

function findLocaleKey(locale: Locale): LocaleKey | undefined {
	return localeKeys.find(
		(k) =>
			localeMap[k].urlSegment === locale.urlSegment &&
			localeMap[k].storyblokCode === locale.storyblokCode,
	);
}

/**
 * Übersetzt einen Key für die gegebene Locale.
 *
 * Fallback-Kette:
 *   1. Exakte Locale (z.B. de-AT.json)
 *   2. Segment-Default (z.B. de-DE.json als Fallback für alle /de/-Varianten)
 *   3. App-Default (erster Eintrag in localeKeys, normalerweise de-DE)
 *   4. Key selbst (macht fehlende Übersetzungen sofort sichtbar)
 */
export function t(locale: Locale, key: string): string {
	const localeKey = findLocaleKey(locale);

	// Exakte Locale
	if (localeKey && translationMap[localeKey]) {
		const value = resolve(translationMap[localeKey]!, key);
		if (value) {
			return value;
		}
	}

	// Segment-Default (de-AT -> de-DE)
	const fallbackKey = segmentDefaults[locale.urlSegment];
	if (fallbackKey && fallbackKey !== localeKey && translationMap[fallbackKey]) {
		const value = resolve(translationMap[fallbackKey]!, key);
		if (value) {
			return value;
		}
	}

	// App-Default
	const defaultKey = localeKeys[0];
	if (defaultKey !== fallbackKey && defaultKey !== localeKey && translationMap[defaultKey]) {
		const value = resolve(translationMap[defaultKey]!, key);
		if (value) {
			return value;
		}
	}

	// Key selbst
	return key;
}