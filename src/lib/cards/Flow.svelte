<script lang="ts">
	import Wave from "$lib/Wave.svelte";
	import type { FLOW_SPOKEN } from "$lib/i18n/spoken";

	/**
	 * One message on its way round, drawn as four stages on a board joined
	 * by a single trace: the worker's words in Ukrainian, Mandy's structured
	 * report, the team lead's message in German with a one-tap reply, the
	 * reply heard back in Ukrainian. A signal runs the trace once as the
	 * card opens.
	 */
	let { steps, spoken }: { steps: { who: string; text: string }[]; spoken: typeof FLOW_SPOKEN } = $props();
</script>

<ol class="flow">
	{#each steps as step, i (i)}
		<li style="--i: {i}">
			<span class="who"><span class="n">{i + 1}</span>{step.who}</span>
			<div class="node" aria-hidden={i === 1 ? "true" : undefined}>
				{#if i === 0}
					<p class="bubble" lang={spoken.ask.lang}><Wave live />{spoken.ask.text}</p>
				{:else if i === 1}
					<div class="report">
						<span class="tag">UK → DE</span>
						<i style="width: 85%"></i><i style="width: 60%"></i>
						<div class="facts"><span class="barcode"></span><span class="pin"></span><span class="photo"></span></div>
					</div>
				{:else if i === 2}
					<div class="message">
						<p lang={spoken.read.lang}>{spoken.read.text}</p>
						<span class="tap" lang={spoken.tap.lang}>{spoken.tap.text}</span>
					</div>
				{:else}
					<p class="bubble reply" lang={spoken.reply.lang}><Wave live />{spoken.reply.text}</p>
				{/if}
			</div>
			<p class="what">{step.text}</p>
		</li>
	{/each}
</ol>

<style>
	/* the board: dot grid, hairline frame, the stages in a row */
	.flow {
		--line: color-mix(in srgb, var(--ink) 15%, transparent);
		position: relative;
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 1.25rem;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		background:
			radial-gradient(color-mix(in srgb, var(--ink) 14%, transparent) 1px, transparent 1.2px) 0 0 / 14px 14px,
			linear-gradient(color-mix(in srgb, var(--ink) 4%, transparent), transparent 70%);
	}
	/* the trace through the stages, and the signal that runs it */
	.flow::before,
	.flow::after {
		content: "";
		position: absolute;
		left: 2.5rem;
		right: 2.5rem;
		top: 6.1rem;
		height: 1px;
		background: var(--line);
	}
	.flow::after {
		height: 2px;
		margin-top: -0.5px;
		background: linear-gradient(90deg, transparent, var(--accent) 40%, var(--accent) 60%, transparent) no-repeat;
		background-size: 4rem 100%;
		background-position: -4rem 0;
		opacity: 0;
	}
	:global(.open) .flow::after {
		animation: signal 3.2s cubic-bezier(0.45, 0, 0.55, 1) 0.4s both;
	}
	@keyframes signal {
		0% {
			opacity: 1;
			background-position: -4rem 0;
		}
		90% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			background-position: calc(100% + 4rem) 0;
		}
	}
	li {
		position: relative;
		display: grid;
		grid-template-rows: auto 7.5rem auto;
		gap: 0.6rem;
		min-width: 0;
	}
	.who {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ink);
	}
	.n {
		font-size: 0.72rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}
	/* each stage's drawing sits on the trace */
	.node {
		position: relative;
		z-index: 1;
		display: grid;
		align-items: center;
		font-size: 0.8rem;
		line-height: 1.35;
	}
	.node p {
		margin: 0;
		color: var(--ink);
	}
	.bubble {
		padding: 0.5rem 0.65rem;
		border-radius: 0.7rem 0.7rem 0.7rem 0.2rem;
		background: var(--paper);
		border: 1px solid var(--line);
	}
	.bubble :global(.wave) {
		color: var(--accent);
	}
	.reply.bubble {
		justify-self: start;
		background: var(--accent);
		border-color: transparent;
		color: white;
	}
	.reply :global(.wave) {
		color: white;
	}
	.report,
	.message {
		display: grid;
		gap: 0.35rem;
		padding: 0.55rem 0.65rem;
		border: 1px solid var(--line);
		border-radius: 0.5rem;
		background: var(--paper);
	}
	.report i {
		display: block;
		height: 0.35rem;
		border-radius: 0.2rem;
		background: color-mix(in srgb, var(--ink) 14%, transparent);
	}
	.tag {
		justify-self: start;
		padding: 0.05rem 0.3rem;
		border-radius: 0.25rem;
		font-size: 0.62rem;
		font-weight: 700;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 14%, transparent);
	}
	/* what Mandy adds: the scan, the place, the photo */
	.facts {
		display: flex;
		gap: 0.35rem;
		margin-top: 0.15rem;
	}
	.facts span {
		width: 1.4rem;
		height: 1rem;
		border-radius: 0.2rem;
		border: 1px solid var(--line);
	}
	.barcode {
		background: repeating-linear-gradient(90deg, var(--ink-soft) 0 1px, transparent 1px 3px) center / 70% 60% no-repeat;
	}
	.pin {
		background: radial-gradient(circle, var(--accent) 0 2.5px, transparent 3px);
	}
	.photo {
		background: radial-gradient(circle, transparent 0 2.5px, var(--ink-soft) 3px 4px, transparent 4.5px);
	}
	.tap {
		justify-self: end;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
	}
	.what {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--ink-soft);
	}
	/* the stages come up as the signal reaches them */
	.node {
		opacity: 0.35;
	}
	:global(.open) .node {
		animation: lit 0.4s ease-out both;
		animation-delay: calc(0.5s + var(--i) * 0.85s);
	}
	@keyframes lit {
		to {
			opacity: 1;
		}
	}
	@media (max-width: 720px) {
		.flow {
			grid-template-columns: 1fr 1fr;
		}
		.flow::before,
		.flow::after {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.node {
			opacity: 1;
		}
		:global(.open) .node,
		:global(.open) .flow::after {
			animation: none;
		}
	}
</style>
