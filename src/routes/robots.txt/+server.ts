import { absolute } from "$lib/seo";

export const prerender = true;

/**
 * Everyone may read everything: search engines, the answer engines that
 * cite pages (OAI-SearchBot, Claude-SearchBot, PerplexityBot, …) and the
 * crawlers that train models. A new brand wants to be known, and an engine
 * can only cite or recommend what it has read.
 */
export const GET = () =>
	new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absolute("/sitemap.xml")}\n`, {
		headers: { "content-type": "text/plain; charset=utf-8" },
	});
