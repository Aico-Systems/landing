<script lang="ts" module>
	import { SYSTEMS, type SystemId } from "$lib/systems";

	/** Every fetched logo (tools/logos/fetch.py): <id>.png for light tiles,
	 *  <id>-dark.png for dark tiles where the mark needs its own. */
	const FILES = import.meta.glob<string>("../logos/*.png", { eager: true, query: "?url", import: "default" });
	const name = (path: string) => path.replace(/^.*\/|\.png$/g, "");
	const LIGHT = new Map(Object.entries(FILES).filter(([p]) => !p.endsWith("-dark.png")).map(([p, url]) => [name(p), url]));
	const DARK = new Map(Object.entries(FILES).filter(([p]) => p.endsWith("-dark.png")).map(([p, url]) => [name(p).slice(0, -5), url]));
</script>

<script lang="ts">
	/**
	 * A system's mark in an app-icon tile that follows the theme: white in
	 * light mode, dark grey in dark mode, with the mark's variant for each.
	 * A system without a logo gets its initials in the tile instead.
	 */
	let { id }: { id: SystemId } = $props();

	const system = $derived(SYSTEMS[id]);
	const light = $derived(LIGHT.get(id));
	const dark = $derived(DARK.get(id) ?? light);
	const initials = $derived(
		system.name
			.split(/[\s.-]+/)
			.filter((w) => /^[A-Za-zÄÖÜ]/.test(w))
			.slice(0, 2)
			.map((w) => w[0].toUpperCase())
			.join(""),
	);
</script>

<span class="logo" class:lettered={!light} aria-hidden="true">
	{#if light}
		<img class="for-light" src={light} alt="" loading="lazy" decoding="async" />
		<img class="for-dark" src={dark} alt="" loading="lazy" decoding="async" />
	{:else}{initials}{/if}
</span>

<style>
	.logo {
		--tile: white;
		--edge: color-mix(in srgb, black 9%, transparent);
		width: 2rem;
		height: 2rem;
		flex: none;
		display: grid;
		place-items: center;
		padding: 0.22rem;
		border-radius: 0.5rem;
		background: var(--tile);
		box-shadow: inset 0 0 0 1px var(--edge);
		overflow: hidden;
	}
	/* dark mode: a dark tile, as an app icon would sit on a dark dock */
	:global(.aico-dark) .logo {
		--tile: color-mix(in srgb, white 7%, var(--paper));
		--edge: color-mix(in srgb, white 10%, transparent);
	}
	img {
		grid-area: 1 / 1;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.for-dark,
	:global(.aico-dark) .for-light {
		display: none;
	}
	:global(.aico-dark) .for-dark {
		display: block;
	}
	.lettered {
		font-size: 0.72rem;
		font-weight: 800;
		font-stretch: 112%;
		color: var(--ink);
	}
</style>
