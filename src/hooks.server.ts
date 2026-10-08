import type { Handle } from "@sveltejs/kit";
import { LOCALES } from "$lib/i18n/locales";

/** Hands the site's languages to the detection script in app.html, so the
 *  list lives in one place (src/lib/i18n/locales.ts). Runs at build time:
 *  every page is prerendered. */
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => html.replace("%aico.locales%", JSON.stringify(LOCALES)),
	});
