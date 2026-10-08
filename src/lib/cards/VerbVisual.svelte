<script lang="ts">
	import type { Verb } from "$lib/i18n/index.svelte";

	/**
	 * A verb drawn as the thing it happens on, small and technical: the
	 * glove's screen answering from an SOP, a WMS row being booked, a team
	 * message, the camera's viewfinder, a chart of the week's questions.
	 * [says] is a worker's line, shown where it would really appear.
	 */
	let { verb, says }: { verb: Verb; says: string } = $props();
</script>

<div class="visual {verb}" aria-hidden="true">
	{#if verb === "know"}
		<div class="sheet">
			<b>SOP</b>
			<i style="width: 80%"></i><i style="width: 92%"></i><i style="width: 64%"></i><i style="width: 86%"></i><i
				style="width: 70%"
			></i>
		</div>
		<div class="screen">
			<p class="ask">{says}</p>
			<p class="reply"><i style="width: 88%"></i><i style="width: 60%"></i></p>
		</div>
	{:else if verb === "act"}
		<p class="ask">{says}</p>
		<div class="table">
			{#each ["B12", "B13", "B14", "B15"] as bin, r (bin)}
				<div class="row" class:hit={r === 2}>
					<span>{bin}</span>
					{#if r === 2}<span>+2</span><span class="ok"></span>{:else}<i></i><i class="short"></i>{/if}
				</div>
			{/each}
		</div>
	{:else if verb === "talk"}
		<div class="message back"><i class="face"></i><i style="width: 70%"></i><i style="width: 45%"></i></div>
		<div class="message front">
			<div class="from"><i class="face"></i><i style="width: 4.5rem"></i><span class="lang">DE ⇄ PL</span></div>
			<p>{says}</p>
		</div>
	{:else if verb === "record"}
		<div class="finder">
			<span class="rec"></span>
			<svg class="carton" viewBox="0 0 120 90">
				<path d="M20 34 L60 18 L100 34 L60 50 Z" />
				<path d="M20 34 V66 L60 82 V50" />
				<path d="M100 34 V66 L60 82" />
				<path d="M40 26 L80 42 V52" class="tape" />
				<path class="dent" d="M86 39 L93 47 L88 53 L96 60" />
			</svg>
			<p>{says}</p>
		</div>
	{:else}
		<div class="chart">
			<p>{says}</p>
			<i style="width: 92%" class="top"></i><i style="width: 64%"></i><i style="width: 46%"></i><i style="width: 30%"></i>
		</div>
	{/if}
</div>

<style>
	/* the drawing board: a dot grid in the ink, fading out at the bottom */
	.visual {
		--line: color-mix(in srgb, var(--ink) 16%, transparent);
		--skel: color-mix(in srgb, var(--ink) 14%, transparent);
		position: relative;
		height: 11rem;
		display: grid;
		place-items: center;
		overflow: hidden;
		background: radial-gradient(color-mix(in srgb, var(--ink) 16%, transparent) 1px, transparent 1.2px) 0 0 / 14px 14px;
		mask: linear-gradient(black 82%, transparent);
		font-size: 0.78rem;
		line-height: 1.3;
	}
	p {
		margin: 0;
		color: var(--ink);
	}
	i {
		display: block;
		height: 0.4rem;
		border-radius: 0.2rem;
		background: var(--skel);
	}
	.ask {
		padding: 0.4rem 0.6rem;
		border-radius: 0.6rem 0.6rem 0.6rem 0.15rem;
		background: var(--paper);
		border: 1px solid var(--line);
		max-width: 13rem;
	}

	/* know: an SOP behind the glove's screen, the screen answering from it */
	.sheet {
		position: absolute;
		left: 18%;
		top: 1.1rem;
		width: 8rem;
		padding: 0.6rem;
		display: grid;
		gap: 0.35rem;
		rotate: -6deg;
		border: 1px solid var(--line);
		border-radius: 0.4rem;
		background: color-mix(in srgb, var(--paper) 85%, var(--ink));
	}
	.sheet b {
		font-size: 0.65rem;
		letter-spacing: 0.04em;
		color: var(--ink-soft);
	}
	.screen {
		position: relative;
		translate: 3.5rem 0.6rem;
		width: 12rem;
		padding: 0.6rem;
		display: grid;
		gap: 0.45rem;
		border: 1px solid var(--line);
		border-radius: 0.9rem;
		background: var(--paper);
		box-shadow: 0 0.75rem 2rem -1rem color-mix(in srgb, var(--ink) 40%, transparent);
	}
	.screen .ask {
		background: color-mix(in srgb, var(--ink) 6%, var(--paper));
	}
	.reply {
		justify-self: end;
		width: 75%;
		padding: 0.5rem;
		display: grid;
		gap: 0.3rem;
		border-radius: 0.6rem 0.6rem 0.15rem 0.6rem;
		background: var(--accent);
	}
	.reply i {
		background: color-mix(in srgb, white 70%, transparent);
	}

	/* act: the request lands as a booked row */
	.act {
		place-items: initial;
		align-content: center;
		justify-items: center;
		gap: 0.6rem;
	}
	.table {
		width: 14rem;
		border: 1px solid var(--line);
		border-radius: 0.5rem;
		background: var(--paper);
		overflow: hidden;
	}
	.row {
		display: grid;
		grid-template-columns: 2.5rem 1fr 2.5rem;
		align-items: center;
		gap: 0.6rem;
		padding: 0.35rem 0.6rem;
		border-top: 1px solid var(--line);
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}
	.row:first-child {
		border-top: 0;
	}
	.row i.short {
		width: 60%;
		justify-self: end;
	}
	.row.hit {
		color: var(--ink);
		font-weight: 700;
		background: color-mix(in srgb, var(--accent) 14%, transparent);
		box-shadow: inset 2px 0 var(--accent);
	}
	.ok {
		justify-self: end;
		width: 0.9rem;
		height: 0.9rem;
		background: var(--accent);
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' stroke='black' stroke-width='2.2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
			center / 100% no-repeat;
	}

	/* talk: a message on its way to the team, translated */
	.message {
		position: absolute;
		width: 14rem;
		padding: 0.6rem;
		display: grid;
		gap: 0.4rem;
		border: 1px solid var(--line);
		border-radius: 0.6rem;
		background: var(--paper);
	}
	.message.back {
		translate: -1.8rem -1.6rem;
		opacity: 0.6;
	}
	.message.front {
		translate: 1.2rem 0.9rem;
		box-shadow: 0 0.75rem 2rem -1rem color-mix(in srgb, var(--ink) 40%, transparent);
	}
	.face {
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 50%;
	}
	.from {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}
	.lang {
		margin-left: auto;
		padding: 0.1rem 0.35rem;
		border-radius: 0.3rem;
		font-size: 0.62rem;
		font-weight: 700;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 14%, transparent);
	}

	/* record: the viewfinder on a carton, the line logged under it */
	.finder {
		position: relative;
		width: 14rem;
		height: 8.5rem;
		display: grid;
		place-items: center;
		background:
			linear-gradient(var(--ink), var(--ink)) top left / 1rem 2px,
			linear-gradient(var(--ink), var(--ink)) top left / 2px 1rem,
			linear-gradient(var(--ink), var(--ink)) top right / 1rem 2px,
			linear-gradient(var(--ink), var(--ink)) top right / 2px 1rem,
			linear-gradient(var(--ink), var(--ink)) bottom left / 1rem 2px,
			linear-gradient(var(--ink), var(--ink)) bottom left / 2px 1rem,
			linear-gradient(var(--ink), var(--ink)) bottom right / 1rem 2px,
			linear-gradient(var(--ink), var(--ink)) bottom right / 2px 1rem;
		background-repeat: no-repeat;
	}
	.rec {
		position: absolute;
		top: 0.6rem;
		right: 0.7rem;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--accent);
	}
	/* a carton in the scene's own line style, one corner crushed */
	.carton {
		width: 6rem;
		margin-top: -1.2rem;
		fill: none;
		stroke: var(--ink-soft);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.carton .tape {
		stroke-width: 4;
		stroke: color-mix(in srgb, var(--ink-soft) 40%, transparent);
	}
	.carton .dent {
		stroke: var(--accent);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.finder p {
		position: absolute;
		bottom: 0.6rem;
		left: 0.7rem;
		right: 0.7rem;
		padding: 0.25rem 0.45rem;
		border-radius: 0.3rem;
		background: color-mix(in srgb, var(--paper) 85%, transparent);
		text-align: center;
	}

	/* learn: the week's questions, the top one named */
	.chart {
		width: 15rem;
		display: grid;
		gap: 0.45rem;
	}
	.chart p {
		margin-bottom: 0.2rem;
	}
	.chart i {
		height: 0.85rem;
		border-radius: 0.25rem;
	}
	.chart i.top {
		background: var(--accent);
	}
</style>
