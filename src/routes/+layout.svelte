<script lang="ts">
	import { onMount } from "svelte";
	import "../app.css";
	let { children } = $props();

	// the browser's own bars (Chrome's toolbar, Safari's tint) in the page's
	// paper, light or dark, so they read as part of it
	onMount(() => {
		const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!;
		const paint = () => (meta.content = getComputedStyle(document.body).backgroundColor);
		paint();
		const dark = matchMedia("(prefers-color-scheme: dark)");
		dark.addEventListener("change", paint);
		return () => dark.removeEventListener("change", paint);
	});
</script>

{@render children()}
