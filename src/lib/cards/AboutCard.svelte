<script lang="ts">
	import Card from "$lib/Card.svelte";
	import { i18n, m } from "$lib/i18n/index.svelte";
	import { FLOW_SPOKEN } from "$lib/i18n/spoken";
	import { PIECES } from "$lib/integrations";
	import { UPDATED } from "$lib/site";
	import { longDate } from "$lib/seo";
	import Chat from "./Chat.svelte";
	import Bento from "./Bento.svelte";
	import Connect from "./Connect.svelte";
	import Apps from "./Apps.svelte";
	import Pilot from "./Pilot.svelte";
	import Shift from "./Shift.svelte";
	import Icon, { type IconName } from "./Icon.svelte";

	/** The card about Mandy itself: what it is, one message on its way round
	 *  (the part that plays), then the questions a buyer has. */
	let { open, onclose }: { open: boolean; onclose: () => void } = $props();

	const a = $derived(m().home.mandy);
	const RUNS: IconName[] = ["cloud", "server", "offline"];
	const count = $derived(new Intl.NumberFormat(i18n.locale).format(PIECES));
</script>

{#snippet heading(icon: IconName, text: string)}
	<h3 class="heading"><Icon name={icon} />{text}</h3>
{/snippet}

<Card id="mandy" title={a.question} {open} {onclose}>
	<p class="answer">{a.answer}</p>

	<section>
		{@render heading("languages", a.flow.heading)}
		<Chat words={a.flow} spoken={FLOW_SPOKEN} />
	</section>

	<section>
		{@render heading("verbs", a.verbs.heading)}
		<Bento items={a.verbs.items} />
	</section>

	<section>
		{@render heading("clock", a.why.heading)}
		<Shift each={a.why.each} perShift={a.why.perShift} />
		<p>{a.why.text}</p>
	</section>

	<section>
		{@render heading("plug", a.systems.heading)}
		<p>{a.systems.text}</p>
		<Connect devices={a.systems.devices} groups={a.systems.groups} />
	</section>

	<section>
		{@render heading("apps", a.integrations.heading)}
		<p>{a.integrations.text(count)}</p>
		<Apps groups={a.integrations.groups} more={a.integrations.more} />
	</section>

	<section>
		{@render heading("server", a.runs.heading)}
		<ul class="runs">
			{#each a.runs.options as o, i (o.name)}
				<li><Icon name={RUNS[i]} /><strong>{o.name}</strong><span>{o.text}</span></li>
			{/each}
		</ul>
	</section>

	<section>
		{@render heading("calendar", a.pilot.heading)}
		<Pilot week={a.pilot.week} phases={a.pilot.phases} />
	</section>

	<section class="faq" id="faq">
		{@render heading("help", a.faq.heading)}
		<div>
			{#each a.faq.items as f (f.q)}
				<details>
					<summary>{f.q}</summary>
					<p>{f.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<p class="updated">{m().site.updated(longDate(i18n.locale, UPDATED))}</p>
</Card>

<style>
	.heading {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
	}
	/* the icon on the heading's first line, however many it wraps to */
	.heading :global(.icon) {
		margin-top: 0.1em;
		color: var(--accent);
	}
	.runs {
		list-style: none;
		margin: 0.75rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}
	.runs li {
		display: grid;
		gap: 0.35rem;
		align-content: start;
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	.runs li :global(.icon) {
		width: 1.5rem;
		height: 1.5rem;
		margin-bottom: 0.35rem;
		color: var(--ink);
	}
	.runs strong {
		color: var(--ink);
		font-stretch: 108%;
	}
	/* the questions: heading on the left, answers on the right */
	.faq {
		display: grid;
		grid-template-columns: 13rem 1fr;
		gap: 2rem;
		align-items: start;
	}
	details {
		border-bottom: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
	}
	details:first-child summary {
		padding-top: 0;
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
	@container (max-width: 570px) {
		.faq,
		.runs {
			grid-template-columns: 1fr;
		}
	}
</style>
