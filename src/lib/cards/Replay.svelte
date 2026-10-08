<script lang="ts">
	import Wave from "$lib/Wave.svelte";
	import type { Spoken } from "$lib/i18n/spoken";

	/**
	 * One exchange, played through when it comes into view: the worker
	 * speaks in their language (in its own script), what that means
	 * appears under it, Mandy answers, and a receipt shows where it landed.
	 * Click to play it again.
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

<figure class="replay" data-reveal>
	{#key take}
		<div class="take">
			<p class="worker"><Wave live /><span lang={said.lang}>{said.text}</span></p>
			<p class="meaning"><span class="heard">{heard}</span> {meaning}</p>
			<p class="mandy"><Wave live />{answer}</p>
			<p class="lands"><span class="tick" aria-hidden="true"></span>{lands}</p>
		</div>
	{/key}
	<button class="again" onclick={() => take++} aria-label="↻">↻</button>
</figure>

<style>
	.replay {
		position: relative;
		margin: 0 0 0.5rem;
		padding: 1.5rem;
		border-radius: 1.25rem;
		background: color-mix(in srgb, var(--ink) 5%, transparent);
		border: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
	}
	.take {
		display: grid;
		gap: 0.6rem;
		justify-items: start;
	}
	p {
		margin: 0;
	}
	.worker,
	.mandy {
		max-width: 85%;
		padding: 0.65rem 0.95rem;
		border-radius: 1rem;
		line-height: 1.35;
	}
	.worker {
		background: var(--glass-fill-strong);
		border: 1px solid var(--glass-edge);
		color: var(--ink);
		font-size: 1.05rem;
		border-bottom-left-radius: 0.3rem;
	}
	.worker :global(.wave) {
		color: var(--accent);
	}
	.meaning {
		padding-left: 0.95rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.heard {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		margin-right: 0.35rem;
	}
	.mandy {
		justify-self: end;
		background: var(--accent);
		color: white;
		border-bottom-right-radius: 0.3rem;
	}
	.lands {
		justify-self: end;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-soft);
	}
	.tick {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--accent);
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 8.5l2.5 2.5L12 5.5' stroke='black' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")
			center / 100% no-repeat;
	}
	.again {
		position: absolute;
		top: 0.6rem;
		right: 0.75rem;
		border: 0;
		background: none;
		color: var(--ink-soft);
		font-size: 1.1rem;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.3s;
	}
	.replay:hover .again,
	.again:focus-visible {
		opacity: 1;
	}

	/* the play: each part in turn once the replay is in view, the waves
	   moving only while their voice speaks */
	.take > * {
		opacity: 0;
		translate: 0 0.5rem;
	}
	.replay:global(.in) .take > * {
		animation: say 0.45s cubic-bezier(0.2, 1.3, 0.4, 1) both;
	}
	.replay:global(.in) .take > .worker {
		animation-delay: 0.3s;
	}
	.replay:global(.in) .take > .meaning {
		animation-delay: 1.9s;
	}
	.replay:global(.in) .take > .mandy {
		animation-delay: 2.6s;
	}
	.replay:global(.in) .take > .lands {
		animation-delay: 3.9s;
	}
	.take :global(.wave i) {
		animation-play-state: paused;
	}
	.replay:global(.in) .take > .worker :global(.wave i) {
		animation-play-state: running;
		animation-iteration-count: 4;
	}
	.replay:global(.in) .take > .mandy :global(.wave i) {
		animation-play-state: running;
		animation-iteration-count: 5;
		animation-delay: 2.6s;
	}
	@keyframes say {
		to {
			opacity: 1;
			translate: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.take > * {
			opacity: 1;
			translate: none;
		}
		.replay:global(.in) .take > * {
			animation: none;
		}
	}
</style>
