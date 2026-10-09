/**
 * Facts about the site itself, in one place. Text a visitor reads lives in
 * src/lib/i18n; these are addresses and dates.
 */

/** Where the site lives: canonical URLs, hreflang, the sitemap and the
 *  structured data are built on it. */
export const SITE_URL = "https://mandy.insight-proglove.com";

/** Mandy's parent company. Mandy is a brand of its own: the parent is named
 *  only in the structured data, never in the page's words. */
export const PARENT = { name: "ProGlove", url: "https://www.proglove.com" };

/** When the facts on the site were last checked (ISO date); shown under the
 *  cards and given to search engines. Change it when the content changes. */
export const UPDATED = "2026-10-08";

/** Where "Book a demo" leads. The button stays hidden until it is set. */
export const DEMO_URL = "";

/** The assistant visitors can talk to, in the corner of every page: the AICO
 *  widget (static/aico/, tools/widget.ts) on the DEMO organization's demo
 *  flow, on the local stack in development and on the sandbox on the site. */
export const ASSISTANT = {
	api: import.meta.env.DEV ? "http://localhost:8000" : "https://api.sandbox.aicoflow.com",
	org: "DEMO",
	flow: "demomesse",
};
