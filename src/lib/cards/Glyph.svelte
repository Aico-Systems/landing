<script lang="ts">
	import type { Verb } from "$lib/i18n/index.svelte";

	/** A verb's mark, a few strokes: a bulb, a bolt, two bubbles, a camera,
	 *  a rising chart. */
	let { verb }: { verb: Verb } = $props();

	const PATHS: Record<Verb, string[]> = {
		know: ["M9 18h6", "M10 21h4", "M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"],
		act: ["M13 2 4 14h7l-1 8 9-12h-7z"],
		talk: ["M3 5h12v8H8l-5 4z", "M18 9h3v10l-4-3h-6v-1"],
		record: ["M3 8h4l2-3h6l2 3h4v12H3z", "M12 10.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7"],
		learn: ["M3 21h18", "M6 17v-4", "M11 17V9", "M16 17V5", "M20 4l-3 0 0 3"],
	};
</script>

<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true">
	{#each PATHS[verb] as d, i (d)}<path {d} pathLength="1" style="--i: {i}" />{/each}
</svg>

<style>
	.glyph {
		width: 1.25rem;
		height: 1.25rem;
		flex: none;
		fill: none;
		stroke: var(--accent);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
