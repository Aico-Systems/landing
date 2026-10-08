<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { adoptDocumentLocale, m } from "$lib/i18n/index.svelte";

	let { children } = $props();
	onMount(adoptDocumentLocale);
</script>

<svelte:head>
	<title>{m().site.title}</title>
	<meta name="description" content={m().site.description} />
</svelte:head>

{@render children()}
