<script lang="ts">
	import Card from "$lib/Card.svelte";
	import { i18n, languageName, m } from "$lib/i18n/index.svelte";
	import { SPOKEN } from "$lib/i18n/spoken";
	import { UPDATED } from "$lib/site";
	import { longDate } from "$lib/seo";
	import type { VerticalId } from "$lib/verticals";
	import Replay from "./Replay.svelte";
	import Systems from "./Systems.svelte";
	import { VERTICAL_SYSTEMS } from "$lib/systems";

	/** A vertical's card: its question answered in two sentences, one
	 *  exchange played through, and what changes. */
	let {
		vertical,
		open,
		onclose,
		onabout,
	}: { vertical: VerticalId; open: boolean; onclose: () => void; onabout: () => void } = $props();

	const words = $derived(m().home);
	const c = $derived(words.verticals[vertical].card);
	const said = $derived(SPOKEN[vertical]);
</script>

<Card id="details" title={c.question} {open} {onclose}>
	<p class="answer">{c.answer}</p>
	<Replay
		{said}
		heard={words.heardIn(languageName(said.lang))}
		meaning={c.story.meaning}
		answer={c.story.answer}
		lands={c.story.lands}
	/>
	<p class="result">{c.result}</p>
	<section>
		<h3>{words.systems.heading}</h3>
		<p class="note">{words.systems.note}</p>
		<Systems ids={VERTICAL_SYSTEMS[vertical]} />
	</section>
	<a
		class="about"
		href="#mandy"
		onclick={(e) => {
			e.preventDefault();
			onabout();
		}}>{words.about}</a
	>
	<p class="updated">{m().site.updated(longDate(i18n.locale, UPDATED))}</p>
</Card>

<style>
	/* what changes, said once and large */
	.result {
		margin-top: 3rem;
		padding-top: 1.25rem;
		border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
		font-size: clamp(1.6rem, 2.6vw, 2.2rem);
		font-weight: 800;
		font-stretch: 115%;
		line-height: 1.08;
		letter-spacing: -0.025em;
		color: var(--ink);
	}
	.note {
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.about {
		display: inline-block;
		margin-top: 1.5rem;
		font-weight: 600;
		color: var(--accent);
		text-underline-offset: 0.25em;
	}
</style>
