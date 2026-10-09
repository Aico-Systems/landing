<script lang="ts">
	import { m } from "$lib/i18n/index.svelte";

	/**
	 * Where Mandy works, drawn as a board: the devices people reach it on
	 * along the top, Mandy the chip in the middle, traces down to three
	 * boxes (your documents, your systems, your team). Signals run in from
	 * the devices and out to the boxes while the card is open.
	 */
	let { devices, groups }: { devices: string[]; groups: { name: string; items: string }[] } = $props();

	/** The chip's pins: five on top, one per device, three below, one per box. */
	const PINS_IN = [264, 282, 300, 318, 336];
	const PINS_OUT = [272, 300, 328];
	/**
	 * Device x positions across the top (five, evenly), each traced to its
	 * pin. The traces nest: an inner one turns higher than the one outside
	 * it, so no two share a run or cross; the middle one runs straight down.
	 */
	const DEVICES_X = [60, 180, 300, 420, 540];
	const TURN_Y = [40, 24, 0, 24, 40];
	const IN = DEVICES_X.map((x, i) => (x === PINS_IN[i] ? `M${x} 0 V82` : `M${x} 0 V${TURN_Y[i]} H${PINS_IN[i]} V82`));
	const OUT = [`M${PINS_OUT[0]} 134 V172 H100 V250`, `M${PINS_OUT[1]} 134 V250`, `M${PINS_OUT[2]} 134 V172 H500 V250`];
</script>

<div class="board">
	<ul class="devices">
		{#each devices as d (d)}<li>{d}</li>{/each}
	</ul>
	<svg viewBox="0 0 600 250" aria-hidden="true">
		{#each [...IN, ...OUT] as d (d)}<path class="trace" {d} />{/each}
		{#each IN as d, i (d)}<path class="signal" {d} style="--i: {i}" />{/each}
		{#each OUT as d, i (d)}<path class="signal" {d} style="--i: {i + 2.5}" />{/each}
		{#each PINS_IN as x (x)}<rect class="pin" x={x - 3} y="74" width="6" height="8" />{/each}
		{#each PINS_OUT as x (x)}<rect class="pin" x={x - 3} y="130" width="6" height="8" />{/each}
		<rect class="chip" x="234" y="80" width="132" height="52" rx="8" />
		<text x="300" y="112">{m().site.brand}</text>
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
		font-size: 17px;
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
	/* the devices: small plates along the top edge, one per trace */
	ul.devices {
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
	}
	.devices li {
		padding: 0.45rem 0.4rem;
		border-radius: 0.5rem;
		background: none;
		text-align: center;
		font-size: 0.78rem;
		font-weight: 600;
		line-height: 1.25;
		color: var(--ink);
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
	@container (max-width: 510px) {
		svg {
			display: none;
		}
		ul,
		ul.devices {
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
