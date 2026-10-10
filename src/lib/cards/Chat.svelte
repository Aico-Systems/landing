<script lang="ts">
	import { onMount } from "svelte";
	import Wave from "$lib/Wave.svelte";
	import { languageName, m } from "$lib/i18n/index.svelte";
	import type { FLOW_SPOKEN } from "$lib/i18n/spoken";

	/**
	 * One message on its way round, as the two chats it really is: the
	 * worker's thread on their device, the team lead's in their app (German),
	 * Mandy between them. The worker speaks, the message crosses and lands
	 * with scan, place and photo, the lead taps a reply, and it crosses back
	 * — then the round plays again with a worker speaking another language,
	 * the same report each time: any of them works.
	 */
	let {
		words,
		spoken,
	}: {
		words: { glove: string[]; teams: string[]; bridge: string; caption: (language: string) => string };
		spoken: typeof FLOW_SPOKEN;
	} = $props();

	/** One round: the four steps (the last lands at 4.5 s), then a pause to read it. */
	const ROUND_MS = 7600;
	let round = $state(0);
	const worker = $derived(spoken.workers[round % spoken.workers.length]!);

	// the windows' titles turn through the options (a device on the one
	// side, an app on the other): the example is one of many
	let turn = $state(0);
	onMount(() => {
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const t = setInterval(() => turn++, 2600);
		const r = setInterval(() => round++, ROUND_MS);
		return () => {
			clearInterval(t);
			clearInterval(r);
		};
	});
</script>

<figure class="chat">
	<!-- a new worker remounts the round, so its steps play again -->
	{#key round}
	<div class="window glove">
		<header>
			<span class="dot"></span>
			{#key turn}<span class="title">{words.glove[turn % words.glove.length]}</span>{/key}
			<span class="lang">{worker.ask.lang}</span>
		</header>
		<div class="thread">
			<p class="out s1" lang={worker.ask.lang} dir="auto"><Wave live />{worker.ask.text}</p>
			<p class="in s4" lang={worker.reply.lang} dir="auto"><Wave live />{worker.reply.text}</p>
		</div>
	</div>

	<div class="bridge" role="img" aria-label={words.bridge}>
		<span class="lane there"><i></i></span>
		<span class="chip">{m().site.brand}</span>
		<span class="lane back"><i></i></span>
	</div>

	<div class="window teams">
		<header>
			<span class="dot"></span>
			{#key turn}<span class="title">{words.teams[turn % words.teams.length]}</span>{/key}
			<span class="lang">{spoken.read.lang}</span>
		</header>
		<div class="thread">
			<div class="in card s2">
				<span class="from"><b>{m().site.brand}</b></span>
				<p lang={spoken.read.lang}>{spoken.read.text}</p>
				<span class="att" aria-hidden="true"><i class="barcode"></i><i class="pin"></i><i class="photo"></i></span>
			</div>
			<p class="out s3" lang={spoken.tap.lang}>{spoken.tap.text}</p>
		</div>
	</div>
	{/key}
	<figcaption>{words.caption(languageName(worker.ask.lang))}</figcaption>
</figure>

<style>
	.chat {
		--line: color-mix(in srgb, var(--ink) 15%, transparent);
		margin: 1.25rem 0 0;
		display: grid;
		grid-template-columns: 1fr 4.5rem 1fr;
		align-items: center;
	}
	/* an app window: a title bar and its thread */
	.window {
		border: 1px solid var(--line);
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--ink) 3%, var(--paper));
		overflow: hidden;
		box-shadow: 0 1rem 2.5rem -1.5rem color-mix(in srgb, black 60%, transparent);
	}
	header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.8rem;
		border-bottom: 1px solid var(--line);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ink-soft);
	}
	.title {
		animation: title 0.35s ease-out both;
	}
	@keyframes title {
		from {
			opacity: 0;
			translate: 0 0.3rem;
		}
	}
	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--accent);
	}
	.teams .dot {
		background: var(--ink-soft);
	}
	.lang {
		margin-left: auto;
		padding: 0.05rem 0.35rem;
		border: 1px solid var(--line);
		border-radius: 0.3rem;
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.thread {
		min-height: 9.5rem;
		padding: 0.8rem;
		display: grid;
		align-content: start;
		gap: 0.55rem;
		font-size: 0.86rem;
		line-height: 1.35;
	}
	.thread p {
		margin: 0;
		max-width: 88%;
	}
	/* sent: right, filled; received: left, outlined */
	.out {
		justify-self: end;
		padding: 0.5rem 0.7rem;
		border-radius: 0.8rem 0.8rem 0.2rem 0.8rem;
		background: var(--accent);
		color: white;
	}
	.out :global(.wave) {
		color: white;
	}
	.in {
		justify-self: start;
		padding: 0.5rem 0.7rem;
		border-radius: 0.8rem 0.8rem 0.8rem 0.2rem;
		background: var(--paper);
		border: 1px solid var(--line);
		color: var(--ink);
	}
	.in :global(.wave) {
		color: var(--accent);
	}
	/* the team lead's reply is theirs: ink, not the worker's orange */
	.teams .out {
		background: var(--ink);
		color: var(--paper);
	}
	/* Mandy's post in Teams: a card with what she attached */
	.card {
		display: grid;
		gap: 0.3rem;
		max-width: 92%;
	}
	.card p {
		max-width: none;
	}
	.from {
		font-size: 0.72rem;
		color: var(--accent);
	}
	.att {
		display: flex;
		gap: 0.3rem;
		margin-top: 0.15rem;
	}
	.att i {
		width: 1.5rem;
		height: 1.05rem;
		border-radius: 0.2rem;
		border: 1px solid var(--line);
	}
	.barcode {
		background: repeating-linear-gradient(90deg, var(--ink-soft) 0 1px, transparent 1px 3px) center / 70% 60% no-repeat;
	}
	.pin {
		background: radial-gradient(circle, var(--accent) 0 2.5px, transparent 3px);
	}
	.photo {
		background: radial-gradient(circle, transparent 0 2.5px, var(--ink-soft) 3px 4px, transparent 4.5px);
	}

	/* the bridge: Mandy between the two lanes, there on top, back below */
	.bridge {
		display: grid;
		justify-items: center;
		gap: 0.6rem;
	}
	.chip {
		padding: 0.3rem 0.45rem;
		border: 1px solid color-mix(in srgb, var(--ink) 30%, transparent);
		border-radius: 0.4rem;
		background: color-mix(in srgb, var(--ink) 6%, var(--paper));
		font-size: 0.72rem;
		font-weight: 800;
		font-stretch: 112%;
	}
	.lane {
		position: relative;
		width: 100%;
		height: 1px;
		background: var(--line);
	}
	.lane::after {
		content: "";
		position: absolute;
		top: -3px;
		border: 3.5px solid transparent;
	}
	.there::after {
		right: -1px;
		border-left: 5px solid var(--ink-soft);
		border-right: 0;
	}
	.back::after {
		left: -1px;
		border-right: 5px solid var(--ink-soft);
		border-left: 0;
	}
	.lane i {
		position: absolute;
		top: -2px;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 6px var(--accent);
		opacity: 0;
	}
	figcaption {
		grid-column: 1 / -1;
		margin-top: 0.9rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}

	/* the play, once as the card opens */
	.thread > * {
		opacity: 0;
	}
	:global(.open) .thread > * {
		animation: arrive 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) both;
	}
	:global(.open) .s1 {
		animation-delay: 0.5s;
	}
	:global(.open) .s2 {
		animation-delay: 2.1s;
	}
	:global(.open) .s3 {
		animation-delay: 3.3s;
	}
	:global(.open) .s4 {
		animation-delay: 4.5s;
	}
	:global(.open) .there i {
		animation: cross 0.7s ease-in-out 1.35s both;
	}
	:global(.open) .back i {
		animation: cross 0.7s ease-in-out 3.75s reverse both;
	}
	@keyframes arrive {
		from {
			opacity: 0;
			translate: 0 0.35rem;
		}
		to {
			opacity: 1;
			translate: none;
		}
	}
	@keyframes cross {
		0% {
			left: 0;
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			left: calc(100% - 5px);
			opacity: 0;
		}
	}
	.thread :global(.wave i) {
		animation-play-state: paused;
	}
	:global(.open) .s1 :global(.wave i) {
		animation-play-state: running;
		animation-iteration-count: 3;
		animation-delay: 0.5s;
	}
	:global(.open) .s4 :global(.wave i) {
		animation-play-state: running;
		animation-iteration-count: 3;
		animation-delay: 4.5s;
	}
	/* a phone: the windows stack, so the message runs down to Mandy and
	   back up — two vertical lanes beside the chip — and a thread is as tall
	   as its words (they keep their room while still hidden) */
	@container (max-width: 570px) {
		.chat {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		.thread {
			min-height: 0;
		}
		.bridge {
			grid-auto-flow: column;
			justify-content: center;
			align-items: center;
			gap: 0.9rem;
		}
		.lane {
			width: 1px;
			height: 1.75rem;
		}
		.lane::after {
			top: auto;
			left: -3px;
			border: 3.5px solid transparent;
		}
		.there::after {
			bottom: -1px;
			right: auto;
			border-top: 5px solid var(--ink-soft);
			border-bottom: 0;
		}
		.back::after {
			top: -1px;
			left: -3px;
			border-bottom: 5px solid var(--ink-soft);
			border-top: 0;
		}
		.lane i {
			top: auto;
			left: -2px;
		}
		:global(.open) .there i {
			animation-name: cross-down;
		}
		:global(.open) .back i {
			animation-name: cross-down;
		}
	}
	@keyframes cross-down {
		0% {
			top: 0;
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			top: calc(100% - 5px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.thread > * {
			opacity: 1;
		}
		:global(.open) .thread > *,
		:global(.open) .lane i {
			animation: none;
		}
	}
</style>
