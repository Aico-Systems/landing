import { error } from "@sveltejs/kit";
import { LOCALES, isLocale } from "$lib/i18n/locales";
import { MESSAGES } from "$lib/i18n/messages";
import { VERTICALS } from "$lib/verticals";
import { verticalBySlug } from "$lib/seo";
import type { EntryGenerator, PageLoad } from "./$types";

/** Every vertical under its own name in every language: /en/warehouse/, /de/lager/. */
export const entries: EntryGenerator = () =>
	LOCALES.flatMap((lang) => VERTICALS.map((v) => ({ lang, slug: MESSAGES[lang].home.verticals[v.id].slug })));

export const load: PageLoad = ({ params }) => {
	const vertical = isLocale(params.lang) ? verticalBySlug(params.lang, params.slug) : undefined;
	if (!vertical) error(404);
	return { vertical: vertical.id };
};
