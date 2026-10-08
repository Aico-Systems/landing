<script lang="ts">
	import { m, type Verb } from "$lib/i18n/index.svelte";
	import Glyph from "./Glyph.svelte";

	/**
	 * The five verbs as tabs: the list on the left, the chosen one on the
	 * right with what it covers and a worker saying it. Every panel is in
	 * the page; the ones not chosen are only out of view.
	 */
	let { items }: { items: Record<Verb, { text: string; says: string }> } = $props();

	const verbs = $derived(Object.keys(items) as Verb[]);
	let chosen = $state<Verb>("know");
</script>

<div class="verbs">
	<div class="list" role="tablist" aria-orientation="vertical">
		{#each verbs as verb (verb)}
			<button
				role="tab"
				id="verb-{verb}"
				aria-selected={chosen === verb}
				aria-controls="verb-{verb}-panel"
				tabindex={chosen === verb ? 0 : -1}
				onclick={() => (chosen = verb)}
				onkeydown={(e) => {
					const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
					if (!step) return;
					e.preventDefault();
					chosen = verbs[(verbs.indexOf(chosen) + step + verbs.length) % verbs.length];
					document.getElementById(`verb-${chosen}`)?.focus();
				}}
			>
				<Glyph {verb} />{m().home.verbs[verb]}
			</button>
		{/each}
	</div>
	{#each verbs as verb (verb)}
		<div class="panel" role="tabpanel" id="verb-{verb}-panel" aria-labelledby="verb-{verb}" class:shown={chosen === verb}>
			<p>{items[verb].text}</p>
			<blockquote>{items[verb].says}</blockquote>
		</div>
	{/each}
</div>

<style>
	.verbs {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0 2rem;
		margin-top: 0.75rem;
	}
	.list {
		display: grid;
		align-content: start;
		gap: 0.15rem;
	}
	button {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.9rem 0.5rem 0.6rem;
		border: 0;
		border-radius: 0.6rem;
		background: none;
		font: inherit;
		font-weight: 600;
		font-stretch: 105%;
		color: var(--ink-soft);
		text-align: left;
		cursor: pointer;
		transition:
			color 0.2s,
			background 0.2s;
	}
	button:hover {
		color: var(--ink);
	}
	button[aria-selected="true"] {
		color: var(--ink);
		background: color-mix(in srgb, var(--ink) 7%, transparent);
	}
	button:focus-visible {
		outline: 2px solid var(--accent);
	}
	button :global(.glyph) {
		stroke: currentColor;
	}
	button[aria-selected="true"] :global(.glyph) {
		stroke: var(--accent);
	}
	/* the panels share one cell; only the chosen one is seen */
	.panel {
		grid-column: 2;
		grid-row: 1;
		align-self: start;
		padding-top: 0.5rem;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.25s;
	}
	.panel.shown {
		visibility: visible;
		opacity: 1;
	}
	blockquote {
		display: inline-block;
		margin: 1.1rem 0 0;
		padding: 0.6rem 0.95rem;
		border-radius: 1rem 1rem 1rem 0.3rem;
		background: var(--glass-fill-strong);
		border: 1px solid var(--glass-edge);
		color: var(--ink);
		line-height: 1.35;
	}
	@media (max-width: 560px) {
		.verbs {
			grid-template-columns: 1fr;
		}
		.list {
			display: flex;
			flex-wrap: wrap;
		}
		.panel {
			grid-column: 1;
			grid-row: 2;
		}
	}
</style>
