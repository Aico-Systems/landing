<script lang="ts">
	import Wave from "$lib/Wave.svelte";
	import type { Spoken } from "$lib/i18n/spoken";

	/**
	 * One message on its way round, step by step: a line runs down through
	 * the steps as they light up. The first step carries what the worker
	 * said, the last the reply they heard, both in the worker's language.
	 */
	let { steps, ask, reply }: { steps: { who: string; text: string }[]; ask: Spoken; reply: Spoken } = $props();
</script>

<ol class="flow" data-reveal>
	{#each steps as step, i (i)}
		<li style="--i: {i}">
			<span class="who">{step.who}</span>
			<span class="text">{step.text}</span>
			{#if i === 0}<span class="said" lang={ask.lang}><Wave live />{ask.text}</span>{/if}
			{#if i === steps.length - 1}<span class="said reply" lang={reply.lang}><Wave live />{reply.text}</span>{/if}
		</li>
	{/each}
</ol>

<style>
	.flow {
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
		display: grid;
		gap: 1.5rem;
	}
	/* the line the message travels, drawn down as the steps light up */
	.flow::before {
		content: "";
		position: absolute;
		left: 0.45rem;
		top: 0.5rem;
		bottom: 0.5rem;
		width: 2px;
		background: var(--accent);
		transform: scaleY(0);
		transform-origin: top;
		transition: transform 2.4s cubic-bezier(0.5, 0, 0.3, 1) 0.2s;
	}
	.flow:global(.in)::before {
		transform: none;
	}
	li {
		position: relative;
		padding-left: 2rem;
		display: grid;
		gap: 0.25rem;
		opacity: 0.25;
		transition: opacity 0.5s;
		transition-delay: calc(0.2s + var(--i) * 0.6s);
	}
	:global(.in) li {
		opacity: 1;
	}
	li::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0.3rem;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--paper);
		border: 2px solid var(--accent);
	}
	.who {
		font-weight: 700;
		font-stretch: 112%;
	}
	.text {
		color: var(--ink-soft);
	}
	.said {
		justify-self: start;
		margin-top: 0.35rem;
		padding: 0.5rem 0.85rem;
		border-radius: 1rem;
		background: var(--glass-fill-strong);
		border: 1px solid var(--glass-edge);
	}
	.said :global(.wave) {
		color: var(--accent);
	}
	.reply {
		background: var(--accent);
		border-color: transparent;
		color: white;
	}
	.reply :global(.wave) {
		color: white;
	}
	@media (prefers-reduced-motion: reduce) {
		.flow::before {
			transform: none;
			transition: none;
		}
		li {
			opacity: 1;
			transition: none;
		}
	}
</style>
