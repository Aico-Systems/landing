<script lang="ts">
	import { m, type Doing } from "$lib/i18n/index.svelte";
	import Glyph from "./Glyph.svelte";

	/** What Mandy does, as tiles: the first large, the rest around it. */
	let { items }: { items: Doing[] } = $props();
</script>

<ul class="bento" data-count={items.length}>
	{#each items as item, i (item.verb + item.text)}
		<li data-reveal style="--d: {i * 0.08}s">
			<Glyph verb={item.verb} />
			<span class="verb">{m().home.verbs[item.verb]}</span>
			<span class="text">{item.text}</span>
		</li>
	{/each}
</ul>

<style>
	.bento {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}
	li {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.25rem;
		border-radius: 1.25rem;
		background: color-mix(in srgb, var(--ink) 5%, transparent);
		border: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	li:hover {
		border-color: color-mix(in srgb, var(--accent) 45%, transparent);
	}
	/* the first tile is the large one: two rows tall */
	li:first-child {
		grid-row: span 2;
		justify-content: flex-end;
		background: color-mix(in srgb, var(--accent) 10%, transparent);
	}
	li:first-child .text {
		font-size: 1.15rem;
		line-height: 1.4;
		color: var(--ink);
	}
	/* with four, the last fills the row under the large one and its two */
	.bento[data-count="4"] li:last-child {
		grid-column: span 2;
	}
	.verb {
		margin-top: 0.25rem;
		font-weight: 800;
		font-stretch: 115%;
		font-size: 1.1rem;
		color: var(--accent);
	}
	.text {
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	@media (max-width: 520px) {
		.bento {
			grid-template-columns: 1fr;
		}
		li:first-child {
			grid-row: auto;
		}
		.bento[data-count] li:last-child {
			grid-column: auto;
		}
	}
</style>
