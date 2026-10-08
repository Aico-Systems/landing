import { VERTICALS, type Vertical, type VerticalId } from "$lib/verticals";
import { LOCALES, type Locale } from "$lib/i18n/locales";
import { MESSAGES } from "$lib/i18n/messages";
import { PARENT, SITE_URL, UPDATED } from "$lib/site";

/**
 * Addresses and machine-readable descriptions of every page, built from the
 * same words the page shows (one source for the HTML, the search snippets,
 * the structured data, the sitemap and llms.txt).
 *
 * A page is a language and, optionally, a vertical: /en/ is the home page,
 * /en/warehouse/ a vertical. Every address ends in a slash, as the static
 * build writes it (a folder with an index.html).
 */
export const pagePath = (locale: Locale, vertical?: VerticalId): string =>
	vertical ? `/${locale}/${MESSAGES[locale].home.verticals[vertical].slug}/` : `/${locale}/`;

export const absolute = (path: string): string => new URL(path, SITE_URL).href;

/** The vertical a language's slug names, if any. */
export const verticalBySlug = (locale: Locale, slug: string): Vertical | undefined =>
	VERTICALS.find((v) => MESSAGES[locale].home.verticals[v.id].slug === slug);

/** The same page in every language, and "/" for everyone else (x-default). */
export function alternates(vertical?: VerticalId): { hreflang: string; href: string }[] {
	return [
		...LOCALES.map((l) => ({ hreflang: l, href: absolute(pagePath(l, vertical)) })),
		{ hreflang: "x-default", href: absolute("/") },
	];
}

/** Title and description of a page, as search results show them. */
export function meta(locale: Locale, vertical?: VerticalId): { title: string; description: string } {
	const m = MESSAGES[locale];
	const seo = vertical ? m.home.verticals[vertical].seo : m.site.seo;
	return { title: `${seo.title} | ${m.site.brand}`, description: seo.description };
}

const id = (fragment: string) => `${SITE_URL}/#${fragment}`;

/**
 * schema.org for a page: Mandy as an organization (with its parent company,
 * which the page's words leave out), Mandy as a product, the site, and the
 * page itself with its place in the site.
 */
export function structuredData(locale: Locale, vertical?: VerticalId): object {
	const m = MESSAGES[locale];
	const url = absolute(pagePath(locale, vertical));
	const home = absolute(pagePath(locale));
	const words = vertical ? m.home.verticals[vertical] : undefined;
	const { title, description } = meta(locale, vertical);
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": id("org"),
				name: m.site.brand,
				url: absolute("/"),
				parentOrganization: { "@type": "Organization", name: PARENT.name, url: PARENT.url },
			},
			{
				"@type": "Product",
				"@id": id("mandy"),
				name: m.site.brand,
				description: m.home.mandy.answer[0],
				category: m.site.seo.title,
				brand: { "@type": "Brand", name: m.site.brand },
				manufacturer: { "@id": id("org") },
				url: home,
			},
			{
				"@type": "WebSite",
				"@id": id("site"),
				name: m.site.brand,
				url: absolute("/"),
				publisher: { "@id": id("org") },
				inLanguage: [...LOCALES],
			},
			{
				"@type": "WebPage",
				"@id": url,
				url,
				name: title,
				description,
				inLanguage: locale,
				isPartOf: { "@id": id("site") },
				about: { "@id": id("mandy") },
				dateModified: UPDATED,
				...(words && {
					breadcrumb: {
						"@type": "BreadcrumbList",
						itemListElement: [
							{ "@type": "ListItem", position: 1, name: m.site.brand, item: home },
							{ "@type": "ListItem", position: 2, name: words.name, item: url },
						],
					},
				}),
			},
			...(vertical
				? []
				: [
						{
							"@type": "FAQPage",
							"@id": `${url}#faq`,
							inLanguage: locale,
							mainEntity: m.home.mandy.faq.map((f) => ({
								"@type": "Question",
								name: f.q,
								acceptedAnswer: { "@type": "Answer", text: f.a },
							})),
						},
					]),
		],
	};
}

/** A date as the language writes it ("8 October 2026", "8. Oktober 2026"). */
export const longDate = (locale: Locale, iso: string): string =>
	new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso));

/** The share card of a page: one image per language and vertical (and the
 *  home page), drawn by tools/og.py. */
export const ogImage = (locale: Locale, vertical?: VerticalId): string => `/og/${locale}-${vertical ?? "home"}.png`;
