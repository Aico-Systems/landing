<script lang="ts">
	import { onMount } from "svelte";
	import { ASSISTANT } from "$lib/site";

	/**
	 * The assistant in the corner: the AICO widget (`<aico-flow>`, launcher
	 * mode) on the demo flow, text and voice. Its script (static/aico/,
	 * tools/widget.ts) loads once the page is idle, so the stage comes first;
	 * the voice core beside it loads only when someone starts talking.
	 */
	let { locale, words }: { locale: string; words: { subtitle: string; placeholder: string } } = $props();

	let ready = $state(false);

	onMount(() => {
		const load = () => {
			if (customElements.get("aico-flow")) {
				ready = true;
				return;
			}
			const script = document.createElement("script");
			script.src = ASSISTANT.script;
			script.async = true;
			script.onload = () => (ready = true);
			document.head.append(script);
		};
		if ("requestIdleCallback" in window) {
			const id = requestIdleCallback(load, { timeout: 4000 });
			return () => cancelIdleCallback(id);
		}
		const id = setTimeout(load, 1500);
		return () => clearTimeout(id);
	});
</script>

{#if ready}
	<aico-flow
		mode="launcher"
		position="bottom-right"
		theme="auto"
		flow-slug={ASSISTANT.flow}
		org={ASSISTANT.org}
		api-url={ASSISTANT.api}
		{locale}
		title-text="Mandy"
		quick-replies="off"
		subtitle={words.subtitle}
		placeholder={words.placeholder}
	></aico-flow>
{/if}

<style>
	/* the page's own type in the assistant too (its shadow root inherits it) */
	aico-flow {
		font-family: var(--font-display);
	}
</style>
