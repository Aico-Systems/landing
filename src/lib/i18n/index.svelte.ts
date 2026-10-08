import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";
import type { Messages } from "./types";
import { en } from "./en";
import { de } from "./de";

export { LOCALES, DEFAULT_LOCALE, type Locale } from "./locales";
export type * from "./types";

/** Every locale's words; a locale in LOCALES without an entry here does not compile. */
const MESSAGES: Record<Locale, Messages> = { en, de };

/**
 * The page's language. The page is built in the default one; once it runs,
 * it takes what app.html's head script settled on from the visitor's own
 * browser languages (`<html lang>`), before anything is shown.
 */
export const i18n = $state({ locale: DEFAULT_LOCALE as Locale });

/** The words of the current language. */
export const m = (): Messages => MESSAGES[i18n.locale];

/** Adopt the language the head script chose, and show the page. */
export function adoptDocumentLocale(): void {
	const lang = document.documentElement.lang;
	if (isLocale(lang)) i18n.locale = lang;
	delete document.documentElement.dataset.i18nPending;
}

/** A language's name in the page's language ("uk" is "Ukrainian", or "Ukrainisch"). */
export function languageName(code: string): string {
	return new Intl.DisplayNames([i18n.locale], { type: "language" }).of(code) ?? code;
}
