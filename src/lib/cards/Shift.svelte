<script lang="ts">
	/**
	 * One shift, drawn to scale: eight hours as a bar, and the exceptions
	 * that interrupt it as gaps (each between 3 and 15 minutes, four of
	 * them here, within the 3 to 5 a shift the pitch deck counts). The
	 * numbers are in the legend; the drawing shows how they add up.
	 */
	let { each, perShift }: { each: string; perShift: string } = $props();

	const SHIFT = 480;
	/** Minutes into the shift, and how long each exception takes. */
	const GAPS = [
		{ at: 52, minutes: 9 },
		{ at: 171, minutes: 15 },
		{ at: 286, minutes: 4 },
		{ at: 402, minutes: 12 },
	];
	const HOURS = [6, 8, 10, 12, 14];
</script>

<figure class="shift" aria-label="{perShift}, {each}">
	<div class="bar" aria-hidden="true">
		{#each GAPS as g (g.at)}
			<span class="gap" style="left: {(g.at / SHIFT) * 100}%; width: {(g.minutes / SHIFT) * 100}%"></span>
		{/each}
	</div>
	<div class="hours" aria-hidden="true">
		{#each HOURS as h, i (h)}<span style="left: {(i / (HOURS.length - 1)) * 100}%">{String(h).padStart(2, "0")}:00</span>{/each}
	</div>
	<figcaption>
		<span class="key"><i class="swatch"></i>{each}</span>
		<span class="key">{perShift}</span>
	</figcaption>
</figure>

<style>
	.shift {
		margin: 1rem 0 1.25rem;
		padding: 1.25rem 1.25rem 1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		background: linear-gradient(color-mix(in srgb, var(--ink) 4%, transparent), transparent 70%);
	}
	/* the working time: a calm bar the exceptions cut into */
	.bar {
		position: relative;
		height: 2.25rem;
		border-radius: 0.4rem;
		background: color-mix(in srgb, var(--ink) 14%, transparent);
	}
	.gap {
		position: absolute;
		top: -0.35rem;
		bottom: -0.35rem;
		min-width: 4px;
		border-radius: 2px;
		background: repeating-linear-gradient(-45deg, var(--accent) 0 3px, color-mix(in srgb, var(--accent) 45%, transparent) 3px 6px);
	}
	.hours {
		position: relative;
		height: 1.4rem;
		margin-top: 0.45rem;
		font-size: 0.72rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}
	.hours span {
		position: absolute;
		translate: -50% 0;
	}
	.hours span:first-child {
		translate: 0 0;
	}
	.hours span:last-child {
		translate: -100% 0;
	}
	figcaption {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.5rem;
		margin-top: 0.4rem;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--ink);
	}
	.key {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}
	.swatch {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 2px;
		background: repeating-linear-gradient(-45deg, var(--accent) 0 3px, color-mix(in srgb, var(--accent) 45%, transparent) 3px 6px);
	}
</style>
