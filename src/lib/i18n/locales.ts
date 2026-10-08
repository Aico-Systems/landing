/**
 * The languages the site speaks, the first the default. Plain data with no
 * Svelte in it: the server hook reads it too, to hand the list to the
 * detection script in app.html (one list, never two).
 */
export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = LOCALES[0];

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);
