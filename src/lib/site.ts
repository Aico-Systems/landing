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

/** The flow a visitor talks to on the web glove, over the anonymous web
 *  channel: the backend, the organization, the flow's slug. */
export interface TryFlow {
	api: string;
	org: string;
	flow: string;
}

/** The web glove's flow. The local stack in development; on the site once
 *  its public demo flow is up (until then the glove stays hidden there). */
export const TRY: TryFlow | null = import.meta.env.DEV
	? { api: "http://localhost:8000", org: "TEST", flow: "konsultation-hauptflow" }
	: null;
