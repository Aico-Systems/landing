<script lang="ts">
	import { SYSTEMS, type SystemId } from "$lib/systems";
	import { m } from "$lib/i18n/index.svelte";
	import Logo from "./Logo.svelte";

	/** The systems an industry runs, as a grid of marks with name and kind. */
	let { ids }: { ids: SystemId[] } = $props();
</script>

<ul class="systems">
	{#each ids as id (id)}
		<li>
			<Logo {id} />
			<span class="name">{SYSTEMS[id].name}<small>{m().home.systemKinds[SYSTEMS[id].kind]}</small></span>
		</li>
	{/each}
</ul>

<style>
	.systems {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr));
		gap: 0.5rem;
	}
	li {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.55rem 0.65rem;
		border: 1px solid color-mix(in srgb, var(--ink) 11%, transparent);
		border-radius: 0.75rem;
		background: linear-gradient(color-mix(in srgb, var(--ink) 3%, transparent), transparent);
	}
	.name {
		display: grid;
		font-size: 0.9rem;
		font-weight: 600;
		line-height: 1.25;
		color: var(--ink);
	}
	small {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--ink-soft);
	}
	/* a phone: two to a row, a little tighter, half the scrolling */
	@container (max-width: 480px) {
		.systems {
			grid-template-columns: 1fr 1fr;
			gap: 0.4rem;
		}
		li {
			gap: 0.5rem;
			padding: 0.45rem 0.5rem;
		}
		.name {
			font-size: 0.82rem;
			overflow-wrap: anywhere;
		}
	}
</style>
