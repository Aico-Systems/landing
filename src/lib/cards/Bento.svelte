<script lang="ts">
	import { m, type Verb } from "$lib/i18n/index.svelte";
	import VerbVisual from "./VerbVisual.svelte";

	/** The five verbs as tiles: each a drawing of where it happens, then its
	 *  name and one line. The first runs the full width. */
	let { items }: { items: Record<Verb, { text: string; says: string }> } = $props();

	const verbs = $derived(Object.keys(items) as Verb[]);
</script>

<ul class="bento">
	{#each verbs as verb (verb)}
		<li>
			<VerbVisual {verb} says={items[verb].says} />
			<div class="words">
				<h4>{m().home.verbs[verb]}</h4>
				<p>{items[verb].text}</p>
			</div>
		</li>
	{/each}
</ul>

<style>
	.bento {
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}
	li {
		display: grid;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		background: linear-gradient(color-mix(in srgb, var(--ink) 4%, transparent), transparent 60%);
		overflow: hidden;
	}
	/* the first tile: its drawing beside its words, the full width */
	li:first-child {
		grid-column: 1 / -1;
		grid-template-columns: 1.3fr 1fr;
		align-items: end;
	}
	.words {
		padding: 0 1.1rem 1.1rem;
	}
	li:first-child .words {
		padding: 1.25rem;
	}
	h4 {
		margin: 0 0 0.25rem;
		font-size: 1.05rem;
		font-weight: 700;
		font-stretch: 108%;
		color: var(--ink);
	}
	p {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	@media (max-width: 560px) {
		.bento,
		li:first-child {
			grid-template-columns: 1fr;
		}
	}
</style>
