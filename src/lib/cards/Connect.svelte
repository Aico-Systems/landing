<script lang="ts">
	import { m } from "$lib/i18n/index.svelte";

	/**
	 * What Mandy is wired to, drawn as a board: Mandy the chip, traces down
	 * to three boxes (your documents, your systems, your team), and signals
	 * running along the traces while the card is open.
	 */
	let { groups }: { groups: { name: string; items: string }[] } = $props();

	/** Traces from the chip's pins to each box, and two that run off the board. */
	const TO_BOXES = ["M272 74 V112 H100 V196", "M300 74 V196", "M328 74 V112 H500 V196"];
	const OFF_BOARD = ["M234 34 H150 V14 H40", "M366 52 H452 V22 H560"];
</script>

<div class="board">
	<svg viewBox="0 0 600 196" aria-hidden="true">
		{#each [...TO_BOXES, ...OFF_BOARD] as d (d)}<path class="trace" {d} />{/each}
		{#each TO_BOXES as d, i (d)}<path class="signal" {d} style="--i: {i}" />{/each}
		<circle cx="40" cy="14" r="3" /><circle cx="560" cy="22" r="3" />
		{#each [0, 1, 2, 3, 4, 5] as k (k)}
			<rect class="pin" x={252 + k * 18} y="14" width="6" height="8" />
			<rect class="pin" x={252 + k * 18} y="70" width="6" height="8" />
		{/each}
		<rect class="chip" x="234" y="20" width="132" height="52" rx="8" />
		<text x="300" y="52">{m().site.brand}</text>
	</svg>
	<ul>
		{#each groups as g (g.name)}
			<li>
				<strong>{g.name}</strong>
				<span>{g.items}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.board {
		margin-top: 1.25rem;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.trace {
		fill: none;
		stroke: color-mix(in srgb, var(--ink) 22%, transparent);
		stroke-width: 1.2;
	}
	circle {
		fill: var(--ink-soft);
	}
	/* a signal: a short orange dash travelling down a trace, one after
	   another, only while the card is open */
	.signal {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-dasharray: 18 600;
		stroke-dashoffset: 18;
		opacity: 0;
	}
	:global(.open) .signal {
		opacity: 1;
		animation: run 2.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		animation-delay: calc(0.6s + var(--i) * 0.45s);
	}
	@keyframes run {
		to {
			stroke-dashoffset: -330;
		}
	}
	.chip {
		fill: color-mix(in srgb, var(--ink) 6%, var(--paper));
		stroke: color-mix(in srgb, var(--ink) 30%, transparent);
		stroke-width: 1.2;
	}
	.pin {
		fill: color-mix(in srgb, var(--ink) 45%, transparent);
	}
	text {
		fill: var(--ink);
		font-size: 20px;
		font-weight: 800;
		font-stretch: 115%;
		text-anchor: middle;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}
	li {
		display: grid;
		gap: 0.3rem;
		align-content: start;
		padding: 0.9rem 1rem 1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		background: linear-gradient(color-mix(in srgb, var(--ink) 4%, transparent), transparent 70%);
	}
	strong {
		font-weight: 700;
		font-stretch: 108%;
	}
	span {
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	@media (max-width: 560px) {
		svg {
			display: none;
		}
		ul {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.open) .signal {
			animation: none;
			opacity: 0;
		}
	}
</style>
