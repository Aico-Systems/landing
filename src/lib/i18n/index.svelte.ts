import { DEFAULT_LOCALE, type Locale } from "./locales";
import type { Messages } from "./types";
import { MESSAGES } from "./messages";

export { LOCALES, DEFAULT_LOCALE, type Locale } from "./locales";
export type * from "./types";

/** The page's language: the first segment of its address (/de/...), set by
 *  the page before it renders, on the server and in the browser alike. */
export const i18n = $state({ locale: DEFAULT_LOCALE as Locale });

/** The words of the current language. */
export const m = (): Messages => MESSAGES[i18n.locale];

/** A language's name in the page's language ("uk" is "Ukrainian", or "Ukrainisch"). */
export function languageName(code: string): string {
	return new Intl.DisplayNames([i18n.locale], { type: "language" }).of(code) ?? code;
}
