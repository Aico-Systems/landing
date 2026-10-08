<script lang="ts">
	import { onMount } from "svelte";
	import { VERTICALS, type Exchange, type Vertical } from "$lib/verticals";
	import { DEMO_URL } from "$lib/site";
	import type { Stage } from "$lib/stage/stage";

	let canvas: HTMLCanvasElement;
	let bubble: HTMLDivElement;
	let sections = $state<HTMLElement[]>([]);
	let stage: Stage | undefined;

	/** The vertical on stage: one screen of scroll each. */
	let active = $state(0);
	let exchange = $state<Exchange | null>(null);
	let answered = $state(false);
	const vertical = $derived(VERTICALS[active]);
	/** The vertical whose words are up: they leave with its scene and the
	 *  next one's arrive as its scene starts to build. */
	let shown = $state<Vertical | null>(null);

	/** How long one exchange stays up, and the pause before Mandy answers. */
	const EXCHANGE_MS = 4200;
	const ANSWER_MS = 1300;
	/** How long the asker holds the glove up once the answer is in. */
	const TALK_AFTER_MS = 1400;
	/** After a scene stands, the beat before the first question. */
	const FIRST_ASK_MS = 1000;
	/** How long the scroll rests on a section before its vertical takes the stage. */
	const SETTLE_MS = 140;

	let timers: ReturnType<typeof setTimeout>[] = [];
	let speaker: Stage["movers"][number] | undefined;

	/** The people of the scene on stage take turns: each exchange hangs over
	 *  the one asking and follows them as they move. */
	function converse() {
		timers.forEach(clearTimeout);
		timers = [];
		exchange = null;
		speaker?.talk(false);
		speaker = undefined;
		const talkers = stage?.movers.filter((m) => m.actor.asks?.length) ?? [];
		if (!talkers.length) return;
		let turn = 0;
		const next = () => {
			speaker?.talk(false);
			speaker = talkers[turn % talkers.length];
			// asking: the glove comes up while they ask and hear the answer
			const asking = speaker;
			asking.talk(true);
			timers.push(setTimeout(() => asking.talk(false), ANSWER_MS + TALK_AFTER_MS));
			const asks = speaker.actor.asks!;
			exchange = asks[Math.floor(turn / talkers.length) % asks.length];
			answered = false;
			turn++;
			timers.push(setTimeout(() => (answered = true), ANSWER_MS));
			timers.push(setTimeout(next, EXCHANGE_MS));
		};
		timers.push(setTimeout(next, FIRST_ASK_MS));
	}

	/** Wide: the diorama moves right and the text has the paper on the left.
	 *  Narrow: it moves up, and the text sits under it. */
	function place() {
		if (!stage) return;
		const wide = innerWidth >= 900 && innerWidth > innerHeight;
		stage.frame = wide ? { x: 0.16, y: 0 } : { x: 0, y: -0.17 };
	}

	function go(i: number) {
		sections[i]?.scrollIntoView({ behavior: "smooth" });
	}

	onMount(() => {
		const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
		// a reload keeps its scroll: start on the vertical in view, not the first
		active = Math.min(VERTICALS.length - 1, Math.max(0, Math.round(scrollY / innerHeight)));
		const at = { x: 0, y: 0 };

		(async () => {
			const { Stage } = await import("$lib/stage/stage");
			stage = new Stage(canvas);
			stage.reduced = reduced;
			stage.onBuild = (v) => (shown = v);
			// once the first scene stands, the rest are prepared in idle time,
			// one at a time, so any jump between verticals is instant
			let warmed = false;
			stage.onBuilt = () => {
				converse();
				if (warmed) return;
				warmed = true;
				const idle = (fn: () => void) =>
					"requestIdleCallback" in window ? requestIdleCallback(fn) : setTimeout(fn, 200);
				const queue = VERTICALS.filter((_, n) => n !== active);
				const warm = () => {
					const v = queue.shift();
					if (v) void stage!.prepare(v).then(() => idle(warm));
				};
				idle(warm);
			};
			stage.onFrame(() => {
				if (!speaker || !bubble) return;
				stage!.project(speaker, at);
				bubble.style.transform = `translate(${at.x}px, ${at.y}px)`;
			});
			place();
			stage.start();
			await stage.show(VERTICALS[active]);
		})();

		// The section mostly on screen is the vertical on stage, once the
		// scroll settles there: a jump from the first to the last passes every
		// section between, and each of those must not start a scene of its own.
		let settle: ReturnType<typeof setTimeout> | undefined;
		const seen = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (!e.isIntersecting) continue;
					const i = sections.indexOf(e.target as HTMLElement);
					if (i < 0) continue;
					clearTimeout(settle);
					settle = setTimeout(() => {
						if (i === active) return;
						active = i;
						timers.forEach(clearTimeout);
						exchange = null;
						speaker?.talk(false);
						speaker = undefined;
						shown = null;
						stage?.show(VERTICALS[i]);
					}, SETTLE_MS);
				}
			},
			{ threshold: 0.6 },
		);
		sections.forEach((s) => seen.observe(s));

		const resize = () => {
			place();
			stage?.resize();
		};
		const scheme = matchMedia("(prefers-color-scheme: dark)");
		const repaint = () => requestAnimationFrame(() => stage?.repaint());
		addEventListener("resize", resize);
		scheme.addEventListener("change", repaint);
		return () => {
			seen.disconnect();
			removeEventListener("resize", resize);
			scheme.removeEventListener("change", repaint);
			timers.forEach(clearTimeout);
			stage?.dispose();
		};
	});

	/** The words leave with their scene, the way they came, backwards: up
	 *  and gone. */
	function lift(_: Element) {
		return {
			duration: reducedMotion() ? 0 : 350,
			css: (t: number) => `opacity: ${t}; translate: 0 ${(t - 1) * 0.8}rem`,
		};
	}
	const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

	// a drag turns the hall; let go and it turns back
	let lastX: number | null = null;
</script>

<svelte:head>
	<title>Mandy</title>
</svelte:head>

<canvas
	bind:this={canvas}
	class="stage"
	aria-label="{vertical.name}: people at work, asking Mandy as they go"
	onpointerdown={(e) => {
		lastX = e.clientX;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}}
	onpointermove={(e) => {
		if (lastX === null) return;
		stage?.drag(e.clientX - lastX);
		lastX = e.clientX;
	}}
	onpointerup={() => {
		lastX = null;
		stage?.drag(null);
	}}
></canvas>

<div class="bubble" bind:this={bubble} aria-live="polite">
	{#if exchange}
		{#key exchange}
			<div class="talk">
			{#if answered}<p class="answer">{exchange.answer}</p>{/if}
			<p class="ask">
				{exchange.ask}
				{#if exchange.lang}<span class="lang">Asked in {exchange.lang}</span>{/if}
			</p>
			</div>
		{/key}
	{/if}
</div>

<header>
	<div class="brand">
		<span class="mark">Mandy</span>
		<span class="tagline">One press. Any language. Any system.</span>
	</div>
	{#if DEMO_URL}<a class="demo" href={DEMO_URL}>Book a demo</a>{/if}
</header>

<div class="paper" aria-hidden="true"></div>

{#if shown}
	{#key shown.id}
		<!-- the name lands letter by letter as the scene builds, then the rest -->
		<section class="vertical" aria-live="polite" style="--n: {shown.name.length}" out:lift|global>
			<h1 aria-label={shown.name}>
				{#each Array.from(shown.name) as ch, c (c)}<span class="ch" aria-hidden="true" style="--c: {c}">{ch}</span>{/each}
			</h1>
			<p class="headline" style="--i: 0">
				{#each shown.headline as line (line)}<span>{line}</span>{/each}
			</p>
			<ul>
				{#each shown.does as d, n (d.text)}
					<li style="--i: {n + 1}"><span class="verb">{d.verb}</span>{d.text}</li>
				{/each}
			</ul>
			<p class="gain" style="--i: 4">{shown.gain}</p>
		</section>
	{/key}
{/if}

<nav aria-label="Industries" style="--active: {active}">
	{#each VERTICALS as v, i (v.id)}
		<button class:on={i === active} aria-current={i === active} onclick={() => go(i)}>{v.name}</button>
	{/each}
</nav>

<!-- one screen of scroll per vertical; the stage above shows the one in view -->
<main>
	{#each VERTICALS as v, i (v.id)}
		<section class="stop" bind:this={sections[i]} aria-label={v.name}></section>
	{/each}
</main>

<style>
	:global(html) {
		scroll-snap-type: y mandatory;
	}
	.stop {
		height: 100svh;
		scroll-snap-align: start;
	}

	.stage {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		cursor: grab;
		touch-action: pan-y;
	}
	.stage:active {
		cursor: grabbing;
	}

	/* above the paper fade: the page's chrome and words */
	header,
	nav,
	.vertical,
	.bubble {
		z-index: 1;
	}
	header {
		position: fixed;
		inset: 0 0 auto 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem clamp(1.25rem, 4vw, 3rem);
		pointer-events: none;
	}
	header > * {
		pointer-events: auto;
	}
	.mark {
		font-size: 1.5rem;
		font-weight: 800;
		font-stretch: 125%;
		letter-spacing: -0.02em;
	}
	.demo {
		color: var(--paper);
		background: var(--ink);
		text-decoration: none;
		font-weight: 600;
		padding: 0.7rem 1.2rem;
		border-radius: 999px;
	}

	.brand {
		display: flex;
		align-items: baseline;
		gap: 1rem;
	}
	.tagline {
		font-size: 0.95rem;
		font-stretch: 87%;
		letter-spacing: 0.01em;
		color: var(--ink-soft);
	}

	/* the paper the text sits on: the page's own colour, fading out toward
	   the diorama, so the words never compete with a rack behind them */
	.paper {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background: linear-gradient(
			90deg,
			var(--paper) 0%,
			color-mix(in srgb, var(--paper) 85%, transparent) 28%,
			transparent 46%
		);
	}

	/* what Mandy does in this vertical, and what it is worth: left, on paper */
	.vertical {
		position: fixed;
		left: clamp(1.25rem, 5vw, 4.5rem);
		top: 50%;
		transform: translateY(-50%);
		width: min(30rem, 38vw);
		pointer-events: none;
	}
	/* timed with the scene: the letters drop as the floor lands, a wave like
	   the racking's; the lines follow once the name stands */
	.ch {
		display: inline-block;
		transform-origin: 50% 100%;
		animation: land 0.5s cubic-bezier(0.3, 0, 0.3, 1) both;
		animation-delay: calc(0.3s + var(--c) * 40ms);
	}
	@keyframes land {
		from {
			opacity: 0;
			transform: translateY(-0.7em);
		}
		50% {
			opacity: 1;
			transform: translateY(0.04em) scaleY(0.88);
		}
		75% {
			transform: translateY(-0.05em);
		}
		to {
			transform: none;
		}
	}
	.headline,
	.vertical li,
	.gain {
		animation: arrive 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(0.55s + var(--n) * 40ms + var(--i) * 90ms);
	}
	.vertical h1 {
		margin: 0;
		font-size: clamp(2.75rem, 5.4vw, 5rem);
		font-weight: 800;
		font-stretch: 125%;
		line-height: 0.92;
		letter-spacing: -0.035em;
		/* one word of single letters: never broken between them */
		white-space: nowrap;
	}
	/* two lines, broken where the thought breaks (verticals.ts); on a
	   narrow screen a line may wrap, evenly */
	.headline {
		margin: 1.1rem 0 0;
		font-size: clamp(1.2rem, 1.6vw, 1.5rem);
		font-weight: 500;
		line-height: 1.25;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.headline span {
		display: block;
		text-wrap: balance;
	}
	ul {
		list-style: none;
		margin: 1.75rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.85rem;
	}
	/* the verb in accent, what it means here in one quiet line */
	li {
		display: grid;
		grid-template-columns: 4.5rem 1fr;
		font-size: 0.98rem;
		line-height: 1.45;
		color: var(--ink-soft);
		text-wrap: pretty;
	}
	.verb {
		color: var(--accent);
		font-weight: 700;
		font-stretch: 112%;
		text-transform: capitalize;
	}
	/* the result, the line the eye ends on: in ink, under a short rule */
	.gain {
		margin: 1.75rem 0 0;
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--ink);
	}
	.gain::before {
		content: "";
		display: block;
		width: 1.5rem;
		height: 2px;
		margin-bottom: 0.9rem;
		background: var(--accent);
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(0.6rem);
		}
	}

	/* the industries: a row along the bottom, the active one in ink with a
	   bar that slides under it, so the row is both the way and the place */
	nav {
		position: fixed;
		left: clamp(1.25rem, 5vw, 4.5rem);
		right: clamp(1.25rem, 5vw, 4.5rem);
		bottom: clamp(1rem, 3vh, 2rem);
		display: grid;
		grid-template-columns: repeat(8, minmax(0, max-content));
		gap: 0 clamp(1rem, 2.2vw, 2rem);
	}
	nav button {
		position: relative;
		font: inherit;
		font-size: 0.95rem;
		font-weight: 600;
		font-stretch: 90%;
		color: var(--ink-soft);
		background: none;
		border: 0;
		padding: 0.75rem 0 0.9rem;
		cursor: pointer;
		transition: color 0.25s;
	}
	nav button::after {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0.35rem;
		height: 2px;
		border-radius: 1px;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	nav button:hover,
	nav button.on {
		color: var(--ink);
	}
	nav button.on::after {
		transform: scaleX(1);
	}
	nav button:focus-visible,
	.demo:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.bubble {
		position: fixed;
		left: 0;
		top: 0;
		pointer-events: none;
		will-change: transform;
	}
	/* question at the bottom, over the speaker's head; the answer stacks above */
	.talk {
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		transform: translate(-50%, -0.6rem);
	}
	.bubble p {
		margin: 0;
		width: max-content;
		max-width: 16rem;
		padding: 0.55rem 0.85rem;
		border-radius: 1rem;
		font-size: 0.9rem;
		line-height: 1.3;
		animation: pop 0.35s cubic-bezier(0.2, 1.4, 0.4, 1) both;
	}
	.ask {
		background: var(--glass-fill-strong);
		backdrop-filter: blur(8px);
		color: var(--ink);
		border: 1px solid var(--glass-edge);
	}
	.lang {
		display: block;
		margin-top: 0.2rem;
		font-size: 0.75rem;
		color: var(--ink-soft);
	}
	.answer {
		background: var(--accent);
		color: white;
	}
	@keyframes pop {
		from {
			opacity: 0;
			scale: 0.85;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bubble p,
		.ch,
		.headline,
		.vertical li,
		.gain {
			animation: none;
		}
		nav button::after {
			transition: none;
		}
		:global(html) {
			scroll-behavior: auto;
		}
	}
	@media (max-width: 899px), (orientation: portrait) {
		.tagline {
			display: none;
		}
		.paper {
			background: linear-gradient(0deg, var(--paper) 0%, var(--paper) 38%, transparent 62%);
		}
		.vertical {
			top: auto;
			bottom: 4.5rem;
			transform: none;
			width: auto;
			right: clamp(1.25rem, 5vw, 4.5rem);
		}
		ul {
			margin-top: 1rem;
			gap: 0.5rem;
		}
		.gain {
			display: none;
		}
		nav {
			display: flex;
			overflow-x: auto;
			gap: 1.25rem;
			right: 0;
			padding-right: 1.25rem;
		}
		nav button {
			flex: none;
		}
	}
</style>
