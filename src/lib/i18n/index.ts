import { Locale, LocaleKey, localeMap } from '@/lib/locale/locales';
import { localeKeys } from '@/lib/locale/locales';

import deDE from './translations/de-DE.json';
import enUS from './translations/en-US.json';

const translationMap: Record<LocaleKey, Record<string, unknown>> = {
	'de-DE': deDE,
	'en-US': enUS,
};

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