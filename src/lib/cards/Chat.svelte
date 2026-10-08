<script lang="ts">
	import Wave from "$lib/Wave.svelte";
	import { m } from "$lib/i18n/index.svelte";
	import type { FLOW_SPOKEN } from "$lib/i18n/spoken";

	/**
	 * One message on its way round, as the two chats it really is: the
	 * worker's thread on the glove (Ukrainian), the team lead's in Teams
	 * (German), Mandy between them. It plays once as the card opens: the
	 * worker speaks, the message crosses and lands in Teams with scan,
	 * place and photo, the lead taps a reply, and it crosses back.
	 */
	let {
		words,
		spoken,
	}: { words: { glove: string; teams: string; bridge: string; caption: string }; spoken: typeof FLOW_SPOKEN } = $props();
</script>

<figure class="chat">
	<div class="window glove">
		<header><span class="dot"></span>{words.glove}<span class="lang">{spoken.ask.lang}</span></header>
		<div class="thread">
			<p class="out s1" lang={spoken.ask.lang}><Wave live />{spoken.ask.text}</p>
			<p class="in s4" lang={spoken.reply.lang}><Wave live />{spoken.reply.text}</p>
		</div>
	</div>

	<div class="bridge" role="img" aria-label={words.bridge}>
		<span class="lane there"><i></i></span>
		<span class="chip">{m().site.brand}</span>
		<span class="lane back"><i></i></span>
	</div>

	<div class="window teams">
		<header><span class="dot"></span>{words.teams}<span class="lang">{spoken.read.lang}</span></header>
		<div class="thread">
			<div class="in card s2">
				<span class="from"><b>{m().site.brand}</b></span>
				<p lang={spoken.read.lang}>{spoken.read.text}</p>
				<span class="att" aria-hidden="true"><i class="barcode"></i><i class="pin"></i><i class="photo"></i></span>
			</div>
			<p class="out s3" lang={spoken.tap.lang}>{spoken.tap.text}</p>
		</div>
	</div>
	<figcaption>{words.caption}</figcaption>
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
	@media (max-width: 620px) {
		.chat {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
		.bridge {
			grid-auto-flow: column;
			align-items: center;
		}
		.lane {
			width: 3rem;
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
