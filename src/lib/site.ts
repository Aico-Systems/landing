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
 *  widget on the DEMO organization's demo flow. In development the widget's
 *  own dev server (the host plane's, :5174) and the local stack, so a widget
 *  change shows at once; on the site the bundle copied into static/aico/
 *  (tools/widget.ts) and the sandbox. */
export const ASSISTANT = {
	script: import.meta.env.DEV ? "http://localhost:5174/widget.js" : "/aico/widget.js",
	api: import.meta.env.DEV ? "http://localhost:8000" : "https://api.sandbox.aicoflow.com",
	org: "DEMO",
	flow: "demomesse",
};
