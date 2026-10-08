<script lang="ts">
	import type { Snippet } from "svelte";
	import { m } from "$lib/i18n/index.svelte";

	/**
	 * A card of longer text over the stage: a panel from the right on a wide
	 * screen, from the bottom on a narrow one. Closed, it stays in the page
	 * (inert and out of view), so the text is there for search and answer
	 * engines, which read the HTML as built.
	 *
	 * One part of each card plays when it opens (the replayed exchange, the
	 * message on its way round), keyed to the card's "open" class; the rest
	 * is set to be read, and stays still. Drawn parts sit on a "board": a
	 * dot grid in a hairline frame, the cards' one visual language.
	 */
	let {
		id,
		title,
		open,
		onclose,
		children,
	}: { id: string; title: string; open: boolean; onclose: () => void; children: Snippet } = $props();

	let card: HTMLElement;
	/** Opened at least once: until then its images (the logos) wait, so a
	 *  visit that never opens a card never fetches them. */
	let seen = $state(false);

	// a card opens at its top
	$effect(() => {
		if (!open) card.scrollTop = 0;
		else seen = true;
	});
</script>

<button class="veil" class:open tabindex="-1" aria-hidden="true" onclick={onclose}></button>
<article {id} bind:this={card} class="card" class:open class:seen inert={!open} aria-labelledby="{id}-title">
	<button class="close" onclick={onclose} aria-label={m().home.close}>×</button>
	<div class="card-text">
		<h2 id="{id}-title">{title}</h2>
		{@render children()}
	</div>
</article>

<style>
	.veil {
		position: fixed;
		inset: 0;
		border: 0;
		padding: 0;
		z-index: 2;
		background: color-mix(in srgb, var(--paper) 40%, transparent);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s;
	}
	.veil.open {
		opacity: 1;
		pointer-events: auto;
	}
	.card {
		position: fixed;
		z-index: 3;
		top: 0;
		right: 0;
		bottom: 0;
		width: min(50rem, 62vw);
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--paper);
		box-shadow: -1px 0 0 color-mix(in srgb, var(--ink) 10%, transparent);
		padding: clamp(2.5rem, 6vh, 4.5rem) clamp(1.5rem, 3.5vw, 3.25rem) 3rem;
		transform: translateX(102%);
		visibility: hidden;
		transition:
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
			visibility 0s 0.45s;
	}
	/* lazy images don't load while not displayed; the closed card's sit just
	   off screen, near enough that lazy alone would fetch them */
	.card:not(.seen) :global(img[loading="lazy"]) {
		display: none;
	}
	.card.open {
		transform: none;
		visibility: visible;
		transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 2.5rem;
		height: 2.5rem;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--ink-soft);
		font: inherit;
		font-size: 1.6rem;
		line-height: 1;
		cursor: pointer;
	}
	.close:hover {
		color: var(--ink);
	}
	.close:focus-visible {
		outline: 2px solid var(--accent);
	}

	/* the card's type: Archivo's widths carry the hierarchy, one size step
	   per level, lines kept under 70 characters. These are defaults for
	   whatever a card holds, kept at one class and one element so a part's
	   own (scoped) styles win over them. */
	/* the column fills the panel: boards and tiles take its full width,
	   running text keeps its own measure (p, .answer) */
	/* the column's own width, not the screen's, lays out what it holds: the
	   panel beside a wide screen is narrower than a phone turned sideways */
	.card-text {
		container-type: inline-size;
		color: var(--ink);
		font-size: 1.0625rem;
		line-height: 1.6;
	}
	:global(.card-text h2) {
		margin: 0 0 1.25rem;
		max-width: 16ch;
		font-size: clamp(2rem, 3.2vw, 2.85rem);
		font-weight: 800;
		font-stretch: 115%;
		line-height: 1.02;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}
	/* the answer under the question: the one paragraph everyone reads */
	:global(.card-text .answer) {
		margin: 0 0 2.5rem;
		max-width: 34em;
		font-size: 1.3rem;
		line-height: 1.45;
		letter-spacing: -0.01em;
		text-wrap: pretty;
	}
	/* a part: a hairline over it, its question as the heading */
	:global(.card-text section) {
		margin-top: 2.75rem;
		padding-top: 1.25rem;
		border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
	}
	:global(.card-text h3) {
		margin: 0 0 0.6rem;
		font-size: 1.15rem;
		font-weight: 700;
		font-stretch: 108%;
		letter-spacing: -0.01em;
	}
	:global(.card-text p) {
		margin: 0;
		max-width: 36em;
		color: color-mix(in srgb, var(--ink) 78%, var(--paper));
		text-wrap: pretty;
	}
	:global(.card-text .updated) {
		margin-top: 3rem;
		font-size: 0.85rem;
		color: var(--ink-soft);
	}

	@media (max-width: 899px), (orientation: portrait) {
		.card {
			top: auto;
			left: 0;
			width: auto;
			max-height: 85svh;
			border-radius: 1.25rem 1.25rem 0 0;
			box-shadow: 0 -1px 0 color-mix(in srgb, var(--ink) 10%, transparent);
			transform: translateY(102%);
		}
	}
	/* a phone: the column takes more of the width, the answer comes smaller */
	@media (max-width: 480px) {
		.card {
			padding-inline: 1.1rem;
		}
		.close {
			top: 0.5rem;
			right: 0.5rem;
		}
		:global(.card-text .answer) {
			font-size: 1.15rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card,
		.card.open,
		.veil {
			transition: none;
		}
	}
</style>
