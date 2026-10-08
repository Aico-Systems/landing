<script lang="ts">
	import { onMount } from "svelte";
	import { i18n, LOCALES } from "$lib/i18n/index.svelte";
	import { pagePath } from "$lib/seo";
	import type { VerticalId } from "$lib/verticals";

	/**
	 * Dev only (Home renders it under `dev`): the page in another language,
	 * and the theme forced light or dark. The site itself has neither: only
	 * "/" chooses a language, and the theme follows the system.
	 *
	 * A forced theme lasts the tab (sessionStorage), so a reload keeps it;
	 * [onrepaint] tells the stage, whose colours are read once per theme.
	 */
	let {
		vertical,
		card,
		onrepaint,
	}: { vertical?: VerticalId; card: string | null; onrepaint: () => void } = $props();

	type Theme = "system" | "light" | "dark";
	const KEY = "aico-dev-theme";
	const NEXT: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
	const LABEL: Record<Theme, string> = { system: "◐ auto", light: "☀ light", dark: "☾ dark" };
	let theme = $state<Theme>("system");

	const system = () => matchMedia("(prefers-color-scheme: dark)").matches;
	function apply() {
		const dark = theme === "system" ? system() : theme === "dark";
		document.documentElement.classList.toggle("aico-dark", dark);
		onrepaint();
	}

	function cycle() {
		theme = NEXT[theme];
		try {
			sessionStorage.setItem(KEY, theme);
		} catch {
			// no storage (a private window): it lasts until the reload
		}
		apply();
	}

	onMount(() => {
		try {
			const saved = sessionStorage.getItem(KEY);
			if (saved === "light" || saved === "dark") theme = saved;
		} catch {
			// as above
		}
		if (theme !== "system") apply();
		// app.html follows the system on its own; a forced theme wins over it
		const scheme = matchMedia("(prefers-color-scheme: dark)");
		const keep = () => theme !== "system" && apply();
		scheme.addEventListener("change", keep);
		return () => scheme.removeEventListener("change", keep);
	});
</script>

<div class="dev" aria-label="Dev tools">
	{#each LOCALES as l (l)}
		<a
			href={pagePath(l, vertical) + (card ? `#${card}` : "")}
			class:on={l === i18n.locale}
			data-sveltekit-noscroll
			data-sveltekit-replacestate>{l}</a
		>
	{/each}
	<button onclick={cycle}>{LABEL[theme]}</button>
</div>

<style>
	.dev {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		padding: 0.2rem;
		border: 1px dashed color-mix(in srgb, var(--ink) 30%, transparent);
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}
	a,
	button {
		padding: 0.25rem 0.55rem;
		border: 0;
		border-radius: 999px;
		background: none;
		color: var(--ink-soft);
		font: inherit;
		text-decoration: none;
		text-transform: uppercase;
		cursor: pointer;
	}
	button {
		text-transform: none;
	}
	a:hover,
	button:hover {
		color: var(--ink);
	}
	a.on {
		background: var(--ink);
		color: var(--paper);
	}
</style>
