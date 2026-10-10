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

/** Where the contact form posts: the n8n workflow "Mandy Landing →
 *  Kontaktformular per E-Mail", which mails the team with the visitor as
 *  Reply-To. Public like any form endpoint: it accepts this site's origins
 *  only, drops what fills the hidden field, and refuses an invalid address. */
export const CONTACT_ENDPOINT = "https://pg2000.app.n8n.cloud/webhook/f83e46c7-4ddc-4062-bc68-4f2368613384";

/** The AICO platform the page talks to, by its domain: the build sets
 *  `PUBLIC_AICO_DOMAIN` (`just deploy`: the sandbox's); unset, the host
 *  plane on this machine (`just up`). Every address follows from it, as
 *  every plane serves the same hostnames (infrastructure/: `widget.`,
 *  `api.`). */
const PLATFORM: string = import.meta.env.PUBLIC_AICO_DOMAIN ?? "";

/** The assistant visitors can talk to, in the corner of every page: the AICO
 *  widget, served by the platform, on the DEMO organization's demo flow. */
export const ASSISTANT = {
	script: PLATFORM ? `https://widget.${PLATFORM}/widget.js` : "http://localhost:5174/widget.js",
	api: PLATFORM ? `https://api.${PLATFORM}` : "http://localhost:8000",
	org: "DEMO",
	flow: "demomesse",
};
