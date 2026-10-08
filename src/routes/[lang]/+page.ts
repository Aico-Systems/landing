import { LOCALES } from "$lib/i18n/locales";
import type { EntryGenerator } from "./$types";

/** Every language's home page: /en/, /de/. */
export const entries: EntryGenerator = () => LOCALES.map((lang) => ({ lang }));
