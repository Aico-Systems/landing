<script lang="ts">
	import { LOCALES } from "$lib/i18n/locales";
	import { MESSAGES } from "$lib/i18n/messages";
	import { VERTICALS } from "$lib/verticals";
	import { absolute, alternates, meta, pagePath } from "$lib/seo";

	/**
	 * "/": the address for everyone (x-default). A visitor is sent on to
	 * their language at once by the head script in app.html; this page is
	 * what a crawler, a link preview or a browser without scripts sees: what
	 * Mandy is, in every language, and the way into each.
	 */
	const first = MESSAGES[LOCALES[0]];
	const info = meta(LOCALES[0]);
</script>

<svelte:head>
	<title>{info.title}</title>
	<meta name="description" content={info.description} />
	<link rel="canonical" href={absolute("/")} />
	{#each alternates() as alt (alt.hreflang)}
		<link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
	{/each}
</svelte:head>

<main>
	<p class="brand">{first.site.brand}</p>
	{#each LOCALES as locale (locale)}
		{@const m = MESSAGES[locale]}
		<section lang={locale}>
			<h1>{m.home.mandy.question}</h1>
			<p>{m.gateway.intro}</p>
			<p><a class="enter" href={pagePath(locale)}>{m.gateway.enter}</a></p>
			<ul>
				{#each VERTICALS as v (v.id)}
					<li><a href={pagePath(locale, v.id)}>{m.home.verticals[v.id].card.question}</a></li>
				{/each}
			</ul>
		</section>
	{/each}
</main>

<style>
	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 3rem 1.25rem 4rem;
		line-height: 1.6;
	}
	.brand {
		font-size: 1.5rem;
		font-weight: 800;
		font-stretch: 125%;
	}
	section + section {
		margin-top: 3rem;
	}
	h1 {
		font-size: 2rem;
		font-stretch: 112%;
		line-height: 1.1;
	}
	a {
		color: var(--accent);
	}
	.enter {
		font-weight: 700;
	}
</style>
