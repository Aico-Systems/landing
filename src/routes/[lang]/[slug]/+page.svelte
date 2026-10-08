<script lang="ts">
	import Home from "$lib/Home.svelte";
	let { data } = $props();
</script>

<Home start={data.vertical} />
