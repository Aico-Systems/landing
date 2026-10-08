<script lang="ts">
	import Wave from "$lib/Wave.svelte";
	import type { Spoken } from "$lib/i18n/spoken";

	/**
	 * One message on its way round, played as the card opens: the steps
	 * light up in turn. What the worker says, and the reply they hear, are
	 * in their own language, set large.
	 */
	let { steps, ask, reply }: { steps: { who: string; text: string }[]; ask: Spoken; reply: Spoken } = $props();
</script>

<ol class="flow tape">
	{#each steps as step, i (i)}
		<li style="--i: {i}">
			<p class="step"><strong>{step.who}</strong> {step.text}</p>
			{#if i === 0}<blockquote class="said" lang={ask.lang}><Wave live />{ask.text}</blockquote>{/if}
			{#if i === steps.length - 1}<blockquote class="said reply" lang={reply.lang}><Wave live />{reply.text}</blockquote>{/if}
		</li>
	{/each}
</ol>

<style>
	.flow {
		list-style: none;
		margin: 0;
		display: grid;
		gap: 1.1rem;
	}
	.step {
		margin: 0;
	}
	.step strong {
		color: var(--ink);
		font-weight: 700;
		margin-right: 0.25rem;
	}
	.said {
		margin: 0.5rem 0 0;
		font-size: clamp(1.35rem, 2vw, 1.75rem);
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
	.said :global(.wave) {
		color: var(--accent);
	}
	.reply {
		color: var(--accent);
	}
	/* the message travels: each step comes up in turn as the card opens */
	li {
		opacity: 0.2;
	}
	:global(.open) li {
		animation: lit 0.5s ease-out both;
		animation-delay: calc(0.4s + var(--i) * 0.75s);
	}
	@keyframes lit {
		to {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		li {
			opacity: 1;
		}
		:global(.open) li {
			animation: none;
		}
	}
</style>
