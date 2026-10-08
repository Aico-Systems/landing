<script lang="ts">
	import Card from "$lib/Card.svelte";
	import { i18n, languageName, m } from "$lib/i18n/index.svelte";
	import { SPOKEN } from "$lib/i18n/spoken";
	import { UPDATED } from "$lib/site";
	import { longDate } from "$lib/seo";
	import type { VerticalId } from "$lib/verticals";
	import Replay from "./Replay.svelte";
	import Bento from "./Bento.svelte";

	/** A vertical's card: its question answered, one exchange replayed,
	 *  what workers ask, what Mandy does, and what changes. */
	let { vertical, open, onclose }: { vertical: VerticalId; open: boolean; onclose: () => void } = $props();

	const words = $derived(m().home);
	const c = $derived(words.verticals[vertical].card);
	const said = $derived(SPOKEN[vertical]);
</script>

<Card id="details" title={c.question} {open} {onclose}>
	<p class="lead" data-reveal style="--d: 0.1s">{c.answer[0]}</p>

	<h3 class="eyebrow">{words.cardHeadings.story}</h3>
	<Replay
		{said}
		heard={words.heardIn(languageName(said.lang))}
		meaning={c.story.meaning}
		answer={c.story.answer}
		lands={c.story.lands}
	/>
	{#each c.answer.slice(1) as p (p)}<p data-reveal>{p}</p>{/each}

	<h3 class="eyebrow">{words.cardHeadings.asks}</h3>
	<ul class="asks">
		{#each c.asks as ask, i (ask)}<li data-reveal style="--d: {i * 0.12}s">{ask}</li>{/each}
	</ul>

	<h3 class="eyebrow">{words.cardHeadings.helps}</h3>
	<Bento items={c.helps} />

	<h3 class="eyebrow">{words.cardHeadings.result}</h3>
	<p class="result" data-reveal>{c.result}</p>
	<p class="updated">{m().site.updated(longDate(i18n.locale, UPDATED))}</p>
</Card>

<style>
	/* what workers say: bubbles, as the scene shows them */
	.asks {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.asks li {
		margin: 0;
		padding: 0.6rem 0.95rem;
		border-radius: 1rem 1rem 1rem 0.3rem;
		background: var(--glass-fill-strong);
		border: 1px solid var(--glass-edge);
		line-height: 1.35;
	}
	/* the result, as a statement */
	.result {
		font-size: clamp(1.5rem, 2.4vw, 2rem);
		font-weight: 800;
		font-stretch: 112%;
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}
</style>
