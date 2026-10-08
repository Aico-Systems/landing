<script lang="ts">
	/** The pilot's weeks, in order along a line. */
	let { steps }: { steps: { when: string; what: string }[] } = $props();
</script>

<ol class="pilot" style="--n: {steps.length}">
	{#each steps as step (step.when)}
		<li>
			<span class="when">{step.when}</span>
			<span class="what">{step.what}</span>
		</li>
	{/each}
</ol>

<style>
	.pilot {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 1rem;
	}
	li {
		display: grid;
		gap: 0.3rem;
		align-content: start;
		padding-top: 0.75rem;
		border-top: 3px solid var(--accent);
	}
	.when {
		font-weight: 800;
		font-stretch: 112%;
		font-variant-numeric: tabular-nums;
	}
	.what {
		font-size: 0.95rem;
		line-height: 1.45;
		color: var(--ink-soft);
	}
	@media (max-width: 620px) {
		.pilot {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
