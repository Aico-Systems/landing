import { VERTICALS, type VerticalId } from "$lib/verticals";
import { LOCALES } from "$lib/i18n/locales";
import { UPDATED } from "$lib/site";
import { absolute, alternates, pagePath } from "$lib/seo";

export const prerender = true;

/** Every page in every language, each with its siblings (hreflang). */
export const GET = () => {
	const pages: (VerticalId | undefined)[] = [undefined, ...VERTICALS.map((v) => v.id)];
	const url = (loc: string, vertical?: VerticalId) =>
		[
			"<url>",
			`<loc>${loc}</loc>`,
			`<lastmod>${UPDATED}</lastmod>`,
			...alternates(vertical).map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`),
			"</url>",
		].join("");
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		url(absolute("/")),
		...LOCALES.flatMap((l) => pages.map((v) => url(absolute(pagePath(l, v)), v))),
		"</urlset>",
	].join("\n");
	return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
