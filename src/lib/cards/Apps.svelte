<script lang="ts">
	import { APPS, type AppGroup } from "$lib/integrations";
	import { SYSTEMS } from "$lib/systems";
	import Logo from "./Logo.svelte";

	/** The apps Mandy works with, by what they are for: a spec sheet of
	 *  columns, the catalog's rest summed up under it. */
	let { groups, more }: { groups: Record<AppGroup, string>; more: string } = $props();

	const ids = Object.keys(APPS) as AppGroup[];
</script>

<div class="apps">
	{#each ids as id (id)}
		<div class="group">
			<h4>{groups[id]}</h4>
			<ul>
				{#each APPS[id] as app (app)}<li><Logo id={app} />{SYSTEMS[app].name}</li>{/each}
			</ul>
		</div>
	{/each}
	<p class="more">{more}</p>
</div>

<style>
	.apps {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		overflow: hidden;
		background: linear-gradient(color-mix(in srgb, var(--ink) 4%, transparent), transparent 70%);
	}
	.group {
		padding: 0.9rem 0.9rem 1rem;
		border-left: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
	}
	.group:first-child {
		border-left: 0;
	}
	h4 {
		margin: 0 0 0.6rem;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--accent);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}
	li {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 0.86rem;
		line-height: 1.25;
		color: var(--ink);
	}
	li :global(.logo) {
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 0.4rem;
		padding: 0.2rem;
	}
	.more {
		grid-column: 1 / -1;
		margin: 0;
		max-width: none;
		padding: 0.6rem 0.9rem;
		border-top: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
		font-size: 0.85rem;
		color: var(--ink-soft);
	}
	/* narrower: a group per row, its apps one line of small chips that
	   scrolls sideways and fades at the edge — five lines, not thirty */
	@container (max-width: 680px) {
		.apps {
			grid-template-columns: 1fr;
		}
		.group {
			padding: 0.7rem 0 0.75rem;
			border-left: 0;
			border-top: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
		}
		.group:first-child {
			border-top: 0;
		}
		h4 {
			margin: 0 0.8rem 0.45rem;
		}
		ul {
			display: flex;
			gap: 0.35rem;
			padding: 0 0.8rem;
			overflow-x: auto;
			overscroll-behavior-x: contain;
			scrollbar-width: none;
			mask-image: linear-gradient(to right, transparent, black 0.8rem, black calc(100% - 2.5rem), transparent);
		}
		ul::-webkit-scrollbar {
			display: none;
		}
		li {
			flex: none;
			gap: 0.35rem;
			padding: 0.2rem 0.6rem 0.2rem 0.25rem;
			border: 1px solid color-mix(in srgb, var(--ink) 11%, transparent);
			border-radius: 999px;
			font-size: 0.78rem;
			white-space: nowrap;
		}
		li :global(.logo) {
			width: 1.25rem;
			height: 1.25rem;
			padding: 0.12rem;
			border-radius: 50%;
		}
		.more {
			padding: 0.6rem 0.8rem;
		}
	}
</style>
