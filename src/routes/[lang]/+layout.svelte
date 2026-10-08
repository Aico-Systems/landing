<script lang="ts">
	import { untrack } from "svelte";
	import { i18n } from "$lib/i18n/index.svelte";
	let { data, children } = $props();

	// the address's language is the page's: set before anything renders (on
	// the server too, where effects never run), and kept when it changes
	i18n.locale = untrack(() => data.locale);
	$effect.pre(() => {
		i18n.locale = data.locale;
	});
</script>

{@render children()}
