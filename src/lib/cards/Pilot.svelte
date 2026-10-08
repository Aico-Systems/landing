<script lang="ts">
	/** The pilot's weeks on a line that fills from the first to the last. */
	let { steps }: { steps: { when: string; what: string }[] } = $props();
</script>

<ol class="pilot" data-reveal style="--n: {steps.length}">
	{#each steps as step, i (step.when)}
		<li style="--i: {i}">
			<span class="when">{step.when}</span>
			<span class="what">{step.what}</span>
		</li>
	{/each}
</ol>

<style>
	.pilot {
		list-style: none;
		margin: 1.25rem 0 0;
		padding: 1.5rem 0 0;
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 1rem;
	}
	/* the track and its fill */
	.pilot::before,
	.pilot::after {
		content: "";
		position: absolute;
		top: 0.35rem;
		left: 0;
		right: 0;
		height: 4px;
		border-radius: 2px;
		background: color-mix(in srgb, var(--ink) 10%, transparent);
	}
	.pilot::after {
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 2s cubic-bezier(0.5, 0, 0.3, 1) 0.3s;
	}
	.pilot:global(.in)::after {
		transform: none;
	}
	li {
		position: relative;
		display: grid;
		gap: 0.35rem;
		align-content: start;
	}
	li::before {
		content: "";
		position: absolute;
		top: -1.5rem;
		left: 0;
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		background: var(--paper);
		border: 2px solid color-mix(in srgb, var(--ink) 20%, transparent);
		transition: border-color 0.3s;
		transition-delay: calc(0.3s + var(--i) * 0.5s);
	}
	:global(.in) li::before {
		border-color: var(--accent);
	}
	.when {
		font-weight: 800;
		font-stretch: 115%;
	}
	.what {
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	@media (max-width: 620px) {
		.pilot {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pilot::after {
			transform: none;
			transition: none;
		}
	}
</style>
