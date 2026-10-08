<script lang="ts" module>
	export type IconName = "languages" | "verbs" | "clock" | "plug" | "apps" | "cloud" | "server" | "offline" | "calendar" | "help";
</script>

<script lang="ts">
	/** Line icons for the cards' headings and tiles, drawn on a 24 grid in
	 *  the stroke of the page's drawings. */
	let { name }: { name: IconName } = $props();

	const PATHS: Record<IconName, string[]> = {
		languages: ["M4 5h9", "M8.5 3v2", "M11 5c-1 4-3.5 7-7 9", "M6 9c1.5 2.5 3.5 4 6 5", "M13 21l4-9 4 9", "M14.5 18h5"],
		verbs: ["M7 11V5.5a1.5 1.5 0 0 1 3 0V10", "M10 9.5V4.5a1.5 1.5 0 0 1 3 0v5", "M13 9.5V5.5a1.5 1.5 0 0 1 3 0V11", "M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1.5a6 6 0 0 1-4.6-2.2L3.5 15a1.6 1.6 0 0 1 2.5-2l1 1.2V11"],
		clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18", "M12 7v5l3 2"],
		plug: ["M9 3v5", "M15 3v5", "M6 8h12v3a6 6 0 0 1-12 0z", "M12 17v4"],
		apps: ["M4 4h6v6H4z", "M14 4h6v6h-6z", "M4 14h6v6H4z", "M17 14v6", "M14 17h6"],
		cloud: ["M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.5 1.5A3.75 3.75 0 0 1 17.5 18z"],
		server: ["M4 4h16v6H4z", "M4 14h16v6H4z", "M8 7h.01", "M8 17h.01"],
		offline: ["M3 3l18 18", "M8.5 16.5a5 5 0 0 1 7 0", "M5 13a10 10 0 0 1 5.2-2.8", "M14.5 10.4A10 10 0 0 1 19 13", "M2 9.5a15 15 0 0 1 4.3-2.6", "M11 6.1A15 15 0 0 1 22 9.5", "M12 20h.01"],
		calendar: ["M4 6h16v14H4z", "M4 10h16", "M8 3v4", "M16 3v4"],
		help: ["M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18", "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14", "M12 17h.01"],
	};
</script>

<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
	{#each PATHS[name] as d (d)}<path {d} />{/each}
</svg>

<style>
	.icon {
		width: 1.15em;
		height: 1.15em;
		flex: none;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
