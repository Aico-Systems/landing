import type { Locale } from "./locales";
import type { Messages } from "./types";
import { en } from "./en";
import { de } from "./de";

/** Every language's words; a locale in LOCALES without an entry here does
 *  not compile. Plain data: the server routes (sitemap, llms.txt) read it
 *  too. */
export const MESSAGES: Record<Locale, Messages> = { en, de };
