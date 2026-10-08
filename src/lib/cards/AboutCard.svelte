<script lang="ts">
	import Card from "$lib/Card.svelte";
	import { i18n, m } from "$lib/i18n/index.svelte";
	import { FLOW_SPOKEN } from "$lib/i18n/spoken";
	import { UPDATED } from "$lib/site";
	import { longDate } from "$lib/seo";
	import Figures from "./Figures.svelte";
	import Flow from "./Flow.svelte";
	import Bento from "./Bento.svelte";
	import Systems from "./Systems.svelte";
	import Pilot from "./Pilot.svelte";
	import type { Verb } from "$lib/i18n/index.svelte";

	/** The card about Mandy itself: the home page's long text, staged. */
	let { open, onclose }: { open: boolean; onclose: () => void } = $props();

	const a = $derived(m().home.mandy);
	const verbs = $derived(Object.entries(a.verbs).map(([verb, text]) => ({ verb: verb as Verb, text })));
</script>

<Card id="mandy" title={a.question} {open} {onclose}>
	{#each a.answer as p, i (p)}<p class="lead" data-reveal style="--d: {0.1 + i * 0.1}s">{p}</p>{/each}
	<Figures items={a.figures} />

	<h3 class="eyebrow">{a.whyHeading}</h3>
	{#each a.why as p (p)}<p data-reveal>{p}</p>{/each}

	<h3 class="eyebrow">{a.flowHeading}</h3>
	<p data-reveal>{a.flowText}</p>
	<Flow steps={a.flow} ask={FLOW_SPOKEN.ask} reply={FLOW_SPOKEN.reply} />

	<h3 class="eyebrow">{a.verbsHeading}</h3>
	<Bento items={verbs} />

	<h3 class="eyebrow">{a.systemsHeading}</h3>
	<p data-reveal>{a.systemsText}</p>
	<Systems />

	<h3 class="eyebrow">{a.runsHeading}</h3>
	<ul class="runs">
		{#each a.runs as r, i (r.name)}
			<li data-reveal style="--d: {i * 0.08}s"><strong>{r.name}</strong>{r.text}</li>
		{/each}
	</ul>

	<h3 class="eyebrow">{a.pilotHeading}</h3>
	<p data-reveal>{a.pilotText}</p>
	<Pilot steps={a.pilot} />

	<h3 class="eyebrow" id="faq">{a.faqHeading}</h3>
	<div class="faq">
		{#each a.faq as f (f.q)}
			<details data-reveal>
				<summary>{f.q}</summary>
				<p>{f.a}</p>
			</details>
		{/each}
	</div>
	<p class="updated">{m().site.updated(longDate(i18n.locale, UPDATED))}</p>
</Card>

<style>
	.runs {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}
	.runs li {
		display: grid;
		gap: 0.4rem;
		align-content: start;
		margin: 0;
		padding: 1.1rem;
		border-radius: 1.1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	.runs strong {
		font-size: 1rem;
		font-stretch: 112%;
		color: var(--ink);
	}
	.faq {
		border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
	}
	details {
		border-bottom: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
	}
	summary {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 0;
		font-weight: 600;
		cursor: pointer;
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: "+";
		color: var(--accent);
		font-weight: 400;
		font-size: 1.3rem;
		line-height: 1;
		transition: rotate 0.25s;
	}
	details[open] summary::after {
		rotate: 45deg;
	}
	details p {
		margin: 0 0 1rem;
		color: var(--ink-soft);
	}
	@media (max-width: 620px) {
		.runs {
			grid-template-columns: 1fr;
		}
	}
</style>
