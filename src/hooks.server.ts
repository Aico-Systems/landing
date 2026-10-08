import type { Handle } from "@sveltejs/kit";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "$lib/i18n/locales";

/**
 * Fills app.html's two blanks at build time (every page is prerendered):
 * the page's language from its address, and the site's languages for the
 * script that sends a visitor from "/" to theirs. Both come from
 * src/lib/i18n/locales.ts.
 */
export const handle: Handle = ({ event, resolve }) => {
	const lang = event.params.lang && isLocale(event.params.lang) ? event.params.lang : DEFAULT_LOCALE;
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace("%aico.lang%", lang).replace("%aico.locales%", JSON.stringify(LOCALES)),
	});
};
