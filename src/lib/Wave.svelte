<script lang="ts">
	/** A voice: four bars that move while it speaks and lie flat once it is
	 *  done. As tall as one line and set at its top, so the bars grow from
	 *  the middle of the first line of text beside it. */
	let { live }: { live: boolean } = $props();
</script>

<span class="wave" class:live aria-hidden="true">
	{#each [0.9, 1.15, 0.75, 1] as d, b (b)}<i style="--d: {d}s; --b: {b}"></i>{/each}
</span>

<style>
	.wave {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		height: 1.3em; /* where lh is unknown */
		height: 1lh;
		margin-right: 0.5em;
		vertical-align: top;
	}
	i {
		width: 2px;
		height: 2px;
		border-radius: 1px;
		background: currentColor;
		opacity: 0.55;
		transition:
			height 0.3s,
			opacity 0.3s;
	}
	.live i {
		opacity: 1;
		animation: voice var(--d) ease-in-out infinite alternate;
		animation-delay: calc(var(--b) * -0.21s);
	}
	@keyframes voice {
		from {
			height: 0.2em;
		}
		to {
			height: 0.8em;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.live i {
			animation: none;
		}
	}
</style>
