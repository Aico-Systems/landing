<script lang="ts">
	/** The numbers, large: each rises into place when the row comes into view. */
	let { items }: { items: { value: string; unit: string; label: string }[] } = $props();
</script>

<dl class="figures">
	{#each items as f, i (f.label)}
		<div data-reveal style="--d: {i * 0.1}s">
			<dt><span class="value">{f.value}</span><span class="unit">{f.unit}</span></dt>
			<dd>{f.label}</dd>
		</div>
	{/each}
</dl>

<style>
	.figures {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.75rem 1.5rem;
		margin: 2.5rem 0 0;
	}
	div {
		border-top: 2px solid var(--accent);
		padding-top: 0.75rem;
	}
	dt {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
		overflow: hidden;
	}
	.value {
		font-size: clamp(2.6rem, 4.4vw, 3.6rem);
		font-weight: 800;
		font-stretch: 125%;
		line-height: 1;
		letter-spacing: -0.03em;
		translate: 0 110%;
		transition: translate 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
		transition-delay: calc(var(--d) + 0.15s);
	}
	:global(.in) .value {
		translate: none;
	}
	.unit {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--accent);
	}
	dd {
		margin: 0.4rem 0 0;
		font-size: 0.9rem;
		line-height: 1.4;
		color: var(--ink-soft);
	}
	@media (prefers-reduced-motion: reduce) {
		.value {
			translate: none;
			transition: none;
		}
	}
</style>
