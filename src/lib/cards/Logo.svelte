<script lang="ts" module>
	import { SYSTEMS, type SystemId } from "$lib/systems";

	/** Every fetched logo (tools/logos/fetch.py), by system id. */
	const FILES = import.meta.glob<string>("../logos/*.{svg,png}", { eager: true, query: "?url", import: "default" });
	const LOGOS = new Map(Object.entries(FILES).map(([path, url]) => [path.replace(/^.*\/|\.\w+$/g, ""), url]));
</script>

<script lang="ts">
	/**
	 * A system's mark in an app-icon tile, the same white tile for every
	 * brand whatever its logo looks like; a system without a logo gets its
	 * initials in the tile instead.
	 */
	let { id }: { id: SystemId } = $props();

	const system = $derived(SYSTEMS[id]);
	const url = $derived(LOGOS.get(id));
	const initials = $derived(
		system.name
			.split(/[\s.-]+/)
			.filter((w) => /^[A-Za-zÄÖÜ]/.test(w))
			.slice(0, 2)
			.map((w) => w[0].toUpperCase())
			.join(""),
	);
</script>

<span class="logo" class:lettered={!url} aria-hidden="true">
	{#if url}<img src={url} alt="" loading="lazy" decoding="async" />{:else}{initials}{/if}
</span>

<style>
	.logo {
		width: 2rem;
		height: 2rem;
		flex: none;
		display: grid;
		place-items: center;
		padding: 0.25rem;
		border-radius: 0.5rem;
		background: white;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, black 8%, transparent);
		overflow: hidden;
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	/* a tile with initials, in the page's own colours */
	.lettered {
		background: color-mix(in srgb, var(--ink) 10%, var(--paper));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ink) 14%, transparent);
		font-size: 0.72rem;
		font-weight: 800;
		font-stretch: 112%;
		color: var(--ink);
	}
</style>
