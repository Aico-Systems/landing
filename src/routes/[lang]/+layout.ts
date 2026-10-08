import { error } from "@sveltejs/kit";
import { isLocale } from "$lib/i18n/locales";
import type { LayoutLoad } from "./$types";

/** A language's pages live under its code: /en/, /de/. */
export const load: LayoutLoad = ({ params }) => {
	if (!isLocale(params.lang)) error(404);
	return { locale: params.lang };
};
