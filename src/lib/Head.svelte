<script lang="ts">
	import type { VerticalId } from "$lib/verticals";
	import { i18n, LOCALES, m } from "$lib/i18n/index.svelte";
	import { absolute, alternates, meta, ogImage, pagePath, structuredData } from "$lib/seo";

	/**
	 * Everything a search engine, an answer engine or a link preview reads
	 * about a page: title, description, its address and its addresses in
	 * the other languages, the share card, and the structured data. Built
	 * with the page and kept in step as the visitor scrolls on.
	 */
	let { vertical }: { vertical?: VerticalId } = $props();

	const locale = $derived(i18n.locale);
	const info = $derived(meta(locale, vertical));
	const url = $derived(absolute(pagePath(locale, vertical)));
	const image = $derived(absolute(ogImage(locale, vertical)));
	/** JSON in a script tag: "<" escaped, so no text can close the tag. */
	const ld = $derived(JSON.stringify(structuredData(locale, vertical)).replace(/</g, "\\u003c"));
</script>

<svelte:head>
	<title>{info.title}</title>
	<meta name="description" content={info.description} />
	<link rel="canonical" href={url} />
	{#each alternates(vertical) as alt (alt.hreflang)}
		<link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
	{/each}
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={m().site.brand} />
	<meta property="og:title" content={info.title} />
	<meta property="og:description" content={info.description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content={locale} />
	{#each LOCALES.filter((l) => l !== locale) as other (other)}
		<meta property="og:locale:alternate" content={other} />
	{/each}
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${ld}</script>`}
</svelte:head>
