<script lang="ts">
	import Card from "$lib/Card.svelte";
	import { i18n, m } from "$lib/i18n/index.svelte";
	import { FLOW_SPOKEN } from "$lib/i18n/spoken";
	import { UPDATED } from "$lib/site";
	import { longDate } from "$lib/seo";
	import Flow from "./Flow.svelte";
	import Verbs from "./Verbs.svelte";
	import Pilot from "./Pilot.svelte";

	/** The card about Mandy itself: what it is, one message on its way round
	 *  (the part that plays), then the questions a buyer has, briefly. */
	let { open, onclose }: { open: boolean; onclose: () => void } = $props();

	const a = $derived(m().home.mandy);
</script>

<Card id="mandy" title={a.question} {open} {onclose}>
	<p class="answer">{a.answer}</p>

	<section>
		<h3>{a.flow.heading}</h3>
		<Flow steps={a.flow.steps} ask={FLOW_SPOKEN.ask} reply={FLOW_SPOKEN.reply} />
	</section>

	<section>
		<h3>{a.verbs.heading}</h3>
		<Verbs items={a.verbs.items} />
	</section>

	<section>
		<h3>{a.why.heading}</h3>
		<p>{a.why.text}</p>
	</section>

	<section class="pair">
		<div>
			<h3>{a.systems.heading}</h3>
			<p>{a.systems.text}</p>
		</div>
		<div>
			<h3>{a.runs.heading}</h3>
			<p>{a.runs.text}</p>
		</div>
	</section>

	<section>
		<h3>{a.pilot.heading}</h3>
		<Pilot steps={a.pilot.steps} />
	</section>

	<section id="faq">
		<h3>{a.faq.heading}</h3>
		{#each a.faq.items as f (f.q)}
			<details>
				<summary>{f.q}</summary>
				<p>{f.a}</p>
			</details>
		{/each}
	</section>

	<p class="updated">{m().site.updated(longDate(i18n.locale, UPDATED))}</p>
</Card>

<style>
	/* two short answers side by side */
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}
	.pair p {
		font-size: 0.98rem;
	}
	details {
		border-bottom: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
	}
	summary {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 0;
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
		font-size: 1.3rem;
		font-weight: 400;
		line-height: 1;
		transition: rotate 0.25s;
	}
	details[open] summary::after {
		rotate: 45deg;
	}
	details p {
		padding-bottom: 1rem;
	}
	@media (max-width: 620px) {
		.pair {
			grid-template-columns: 1fr;
		}
	}
</style>
