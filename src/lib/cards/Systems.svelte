<script lang="ts">
	import { SYSTEMS } from "$lib/i18n/spoken";

	/** The systems Mandy talks to, drifting past in a band (and holding still
	 *  under the pointer); one copy for readers, a second only for the loop. */
</script>

<div class="band" data-reveal>
	<ul class="row">
		{#each SYSTEMS as name (name)}<li>{name}</li>{/each}
	</ul>
	<ul class="row" aria-hidden="true">
		{#each SYSTEMS as name (name)}<li>{name}</li>{/each}
	</ul>
</div>

<style>
	.band {
		display: flex;
		overflow: hidden;
		margin: 1.25rem 0 0;
		mask: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
	}
	.row {
		display: flex;
		flex: none;
		gap: 0.6rem;
		margin: 0;
		padding: 0 0.6rem 0 0;
		list-style: none;
		animation: drift 28s linear infinite;
	}
	.band:hover .row {
		animation-play-state: paused;
	}
	li {
		flex: none;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--ink) 14%, transparent);
		font-weight: 600;
		font-stretch: 95%;
		white-space: nowrap;
	}
	@keyframes drift {
		to {
			translate: -100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.band {
			mask: none;
		}
		.row {
			flex-wrap: wrap;
			flex: 1;
			animation: none;
			gap: 0.5rem;
		}
		.row[aria-hidden] {
			display: none;
		}
	}
</style>
