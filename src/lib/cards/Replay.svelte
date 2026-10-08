<script lang="ts">
	import Wave from "$lib/Wave.svelte";
	import { m } from "$lib/i18n/index.svelte";
	import type { Spoken } from "$lib/i18n/spoken";

	/**
	 * One exchange, played through when the card opens: the worker's words
	 * in their own language and script, set large; what they mean; Mandy's
	 * answer; where it landed.
	 */
	let {
		said,
		heard,
		meaning,
		answer,
		lands,
	}: { said: Spoken; heard: string; meaning: string; answer: string; lands: string } = $props();

	let take = $state(0);
</script>

<figure class="replay">
	{#key take}
		<div class="take">
			<blockquote class="said" lang={said.lang}><Wave live />{said.text}</blockquote>
			<p class="meaning">{heard}: {meaning}</p>
			<p class="mandy"><Wave live />{answer}</p>
			<p class="lands"><span class="tick" aria-hidden="true"></span>{lands}</p>
		</div>
	{/key}
	<button class="again" onclick={() => take++}>{m().home.replay}</button>
</figure>

<style>
	/* the exchange on a board, like every drawn part of the cards */
	.replay {
		margin: 0;
		padding: 1.5rem 1.5rem 1.1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		background:
			radial-gradient(color-mix(in srgb, var(--ink) 14%, transparent) 1px, transparent 1.2px) 0 0 / 14px 14px,
			linear-gradient(color-mix(in srgb, var(--ink) 4%, transparent), transparent 70%);
	}
	.take {
		display: grid;
		justify-items: start;
	}
	/* the worker's own words are the display type of the card */
	.said {
		margin: 0;
		max-width: 26em;
		padding: 0.7rem 0.95rem;
		border-radius: 1rem 1rem 1rem 0.3rem;
		background: var(--paper);
		border: 1px solid color-mix(in srgb, var(--ink) 15%, transparent);
		font-size: 1.2rem;
		font-weight: 500;
		line-height: 1.3;
		letter-spacing: -0.01em;
		color: var(--ink);
		text-wrap: balance;
	}
	.said :global(.wave) {
		color: var(--accent);
	}
	.meaning {
		margin: 0.5rem 0 1.25rem 0.95rem;
		font-size: 0.95rem;
		color: var(--ink-soft);
	}
	.mandy {
		justify-self: end;
		max-width: 26em;
		padding: 0.7rem 1rem;
		border-radius: 1rem 1rem 1rem 0.3rem;
		background: var(--accent);
		color: white;
		font-size: 1.05rem;
		line-height: 1.4;
	}
	.lands {
		justify-self: end;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		margin-top: 0.7rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.tick {
		width: 1rem;
		height: 1rem;
		background: var(--accent);
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' stroke='black' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
			center / 100% no-repeat;
	}
	.again {
		margin-top: 1.25rem;
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-soft);
		text-decoration: underline;
		text-underline-offset: 0.25em;
		cursor: pointer;
	}
	.again:hover {
		color: var(--ink);
	}

	/* the play, once, as the card opens: each voice in turn, its wave moving
	   only while it speaks */
	.take > * {
		opacity: 0;
	}
	:global(.open) .take > * {
		animation: say 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) both;
	}
	:global(.open) .take > .said {
		animation-delay: 0.45s;
	}
	:global(.open) .take > .meaning {
		animation-delay: 2s;
	}
	:global(.open) .take > .mandy {
		animation-delay: 2.7s;
	}
	:global(.open) .take > .lands {
		animation-delay: 4s;
	}
	.take :global(.wave i) {
		animation-play-state: paused;
	}
	:global(.open) .said :global(.wave i) {
		animation-play-state: running;
		animation-iteration-count: 4;
		animation-delay: 0.45s;
	}
	:global(.open) .mandy :global(.wave i) {
		animation-play-state: running;
		animation-iteration-count: 4;
		animation-delay: 2.7s;
	}
	@keyframes say {
		from {
			opacity: 0;
			translate: 0 0.4rem;
		}
		to {
			opacity: 1;
			translate: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.take > * {
			opacity: 1;
		}
		:global(.open) .take > * {
			animation: none;
		}
	}
</style>
