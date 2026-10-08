<script lang="ts">
	import type { Snippet } from "svelte";
	import { m } from "$lib/i18n/index.svelte";

	/**
	 * A card of longer text over the stage: a panel from the right on a wide
	 * screen, from the bottom on a narrow one. Closed, it stays in the page
	 * (inert and out of view), so the text is there for search and answer
	 * engines, which read the HTML as built.
	 *
	 * Its parts come in as they scroll into view: anything marked
	 * data-reveal gets the class "in" (its own delay in --d), and loses it
	 * when the card closes, so the card plays again next time.
	 */
	let {
		id,
		title,
		open,
		onclose,
		children,
	}: { id: string; title: string; open: boolean; onclose: () => void; children: Snippet } = $props();

	let card: HTMLElement;

	$effect(() => {
		const parts = card.querySelectorAll("[data-reveal]");
		if (!open) {
			parts.forEach((p) => p.classList.remove("in"));
			card.scrollTop = 0;
			return;
		}
		const seen = new IntersectionObserver(
			(entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
			{ root: card, threshold: 0.2 },
		);
		parts.forEach((p) => seen.observe(p));
		return () => seen.disconnect();
	});
</script>

<button class="veil" class:open tabindex="-1" aria-hidden="true" onclick={onclose}></button>
<article {id} bind:this={card} class="card" class:open inert={!open} aria-labelledby="{id}-title">
	<button class="close" onclick={onclose} aria-label={m().home.close}>×</button>
	<div class="text">
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
		width: min(46rem, 58vw);
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

	/* the card's type: the page's, set for reading at length */
	.text {
		max-width: 42rem;
		color: var(--ink);
		font-size: 1rem;
		line-height: 1.6;
	}
	.text :global(h2) {
		margin: 0 0 1.25rem;
		font-size: clamp(1.75rem, 2.6vw, 2.4rem);
		font-weight: 800;
		font-stretch: 112%;
		line-height: 1.05;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}
	.text :global(h3) {
		margin: 2.25rem 0 0.75rem;
		font-size: 1.05rem;
		font-weight: 700;
		font-stretch: 105%;
	}
	.text :global(h4) {
		margin: 1.25rem 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}
	.text :global(p) {
		margin: 0 0 0.9rem;
		text-wrap: pretty;
	}
	.text :global(.lead) {
		font-size: 1.1rem;
		line-height: 1.55;
	}
	.text :global(.updated) {
		margin-top: 2.5rem;
		font-size: 0.85rem;
		color: var(--ink-soft);
	}

	/* a part coming into view */
	.card :global([data-reveal]) {
		opacity: 0;
		translate: 0 1.25rem;
		transition:
			opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
			translate 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
		transition-delay: var(--d, 0s);
	}
	.card :global([data-reveal].in) {
		opacity: 1;
		translate: none;
	}
	/* a part's heading, the eyebrow over it */
	.text :global(.eyebrow) {
		margin: 3rem 0 1rem;
		font-size: 0.8rem;
		font-weight: 700;
		font-stretch: 112%;
		letter-spacing: 0.08em;
		text-transform: uppercase;
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
	@media (prefers-reduced-motion: reduce) {
		.card :global([data-reveal]) {
			translate: none;
			transition: none;
		}
		.card,
		.card.open,
		.veil {
			transition: none;
		}
	}
</style>
