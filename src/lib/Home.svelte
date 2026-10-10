<script lang="ts">
	import { onMount, tick, untrack } from "svelte";
	import { replaceState } from "$app/navigation";
	import { VERTICALS, type Vertical, type VerticalId } from "$lib/verticals";
	import { i18n, languageName, m, type Exchange } from "$lib/i18n/index.svelte";
	import { DEMO_URL } from "$lib/site";
	import { LOCALES } from "$lib/i18n/locales";
	import { MESSAGES } from "$lib/i18n/messages";
	import { pagePath } from "$lib/seo";
	import Head from "$lib/Head.svelte";
	import AboutCard from "$lib/cards/AboutCard.svelte";
	import ContactCard from "$lib/cards/ContactCard.svelte";
	import VerticalCard from "$lib/cards/VerticalCard.svelte";
	import Wave from "$lib/Wave.svelte";
	import Assistant from "$lib/Assistant.svelte";
	import type { Stage } from "$lib/stage/stage";

	/**
	 * The page: one screen of scroll per vertical, the 3D stage behind, and
	 * a card per vertical (and one about Mandy) for whoever wants to read on.
	 *
	 * [start] is the vertical the address names (/en/parcel/), or none for
	 * the home page (/en/), which starts on the first. Scrolling on keeps
	 * the address in step, so every view can be linked; #details opens the
	 * vertical's card, #mandy the one about Mandy and #contact the form.
	 */
	/** The cards a fragment opens: a vertical's, the one about Mandy, the form. */
	const CARDS = ["details", "mandy", "contact"] as const;
	type CardName = (typeof CARDS)[number];

	let { start }: { start?: VerticalId } = $props();

	let canvas: HTMLCanvasElement;
	let bubble: HTMLDivElement;
	let header: HTMLElement;
	let main: HTMLElement;
	let nav: HTMLElement;
	let sections = $state<HTMLElement[]>([]);
	let stage: Stage | undefined;

	// where the page starts is read once; scrolling moves on from there
	const startIndex = untrack(() => (start ? VERTICALS.findIndex((v) => v.id === start) : 0));
	/** The vertical on stage: one screen of scroll each. */
	let active = $state(startIndex);
	/** Still on the home page's address: nobody has scrolled on yet. */
	let home = $state(untrack(() => !start));
	/** The card that is open, if any. */
	let card = $state<CardName | null>(null);
	let exchange = $state<Exchange | null>(null);
	let answered = $state(false);
	/** Who is speaking right now, the worker or Mandy: their bubble's wave moves. */
	let voice = $state<"ask" | "answer" | null>(null);
	const vertical = $derived(VERTICALS[active]);
	const site = $derived(m().site);
	const words = $derived(m().home);
	/** The vertical whose words are up: they leave with its scene and the
	 *  next one's arrive as its scene starts to build. The first is in the
	 *  page as built, for readers and crawlers that never run the scene. */
	let shown = $state<Vertical | null>(VERTICALS[startIndex]);

	/** How long one exchange stays up, and the pause before Mandy answers. */
	const EXCHANGE_MS = 4200;
	const ANSWER_MS = 1300;
	/** How long Mandy speaks, and the asker holds the glove up, once the
	 *  answer is in. */
	const TALK_AFTER_MS = 1400;
	/** After a scene stands, the beat before the first question. */
	const FIRST_ASK_MS = 1000;
	/** How long the camera takes to come in on a phone, near enough. */
	const CLOSE_IN_MS = 900;
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
		voice = null;
		const voices = words.verticals[VERTICALS[active].id].voices;
		const talkers = stage?.movers.filter((mover) => mover.actor.voice && voices[mover.actor.voice]?.length) ?? [];
		if (!talkers.length) return;
		let turn = 0;
		const next = () => {
			speaker?.talk(false);
			// close in (a phone), someone may be off screen or behind the
			// words: the turn passes to the next in view, or waits a round
			let k = 0;
			while (k < talkers.length && !inView(talkers[turn % talkers.length])) {
				turn++;
				k++;
			}
			if (k === talkers.length) {
				speaker = undefined;
				exchange = null;
				timers.push(setTimeout(next, EXCHANGE_MS));
				return;
			}
			speaker = talkers[turn % talkers.length];
			// the glove comes up and the floor ripples round them while they
			// ask and hear the answer
			const asking = speaker;
			asking.talk(true);
			voice = "ask";
			timers.push(
				setTimeout(() => {
					asking.talk(false);
					voice = null;
				}, ANSWER_MS + TALK_AFTER_MS),
			);
			const asks = voices[speaker.actor.voice!];
			exchange = asks[Math.floor(turn / talkers.length) % asks.length];
			answered = false;
			turn++;
			timers.push(
				setTimeout(() => {
					answered = true;
					voice = "answer";
				}, ANSWER_MS),
			);
			timers.push(setTimeout(next, EXCHANGE_MS));
		};
		timers.push(setTimeout(next, FIRST_ASK_MS));
	}

	/** Text beside the diorama: any landscape screen wide enough, and a phone
	 *  turned sideways, too short to stack them. Elsewhere the text sits under
	 *  it. The styles below hold the same rule, inverted. */
	const SIDE = "(orientation: landscape) and (min-width: 900px), (orientation: landscape) and (max-height: 559px)";
	/** The diorama at full size, as a share of the screen: its width beside
	 *  the text (times the screen's aspect), its height over it (times the
	 *  screen's width). */
	const WIDE = 1.3;
	const TALL = 0.62;
	/** The header's bottom: nobody above it gets a turn to speak. */
	let ceiling = 0;
	/** The top of the words: nobody under it gets a turn to speak. */
	let floor = 0;
	/** A phone held upright: too narrow to show the hall whole with room
	 *  beside it. The scene turns backdrop: it builds whole, in view, then
	 *  the camera comes in close on the floor, the words over it, and the
	 *  people in view talk. */
	let backdrop = false;
	/** Whether the backdrop has come in: out while a scene builds, in once
	 *  it stands. */
	let closeIn = false;
	const BACKDROP_BELOW = 600;
	/** How close the backdrop comes in, and where its centre sits (a share
	 *  of the screen's height, up from the middle). */
	const BACKDROP_ZOOM = 1.9;
	const BACKDROP_Y = -0.12;
	/** Pulled back, the whole floor with a margin round it. */
	const BACKDROP_OUT = 0.88;
	/** Stacked, the diorama's corners reach past its span: a margin keeps
	 *  them on screen. */
	const EDGE = 0.8;

	/** Side by side: the diorama centred in the room right of the text,
	 *  smaller where it would not fit. Stacked: centred between the header
	 *  and the text, smaller where the text leaves it little height. */
	function place() {
		if (!stage) return;
		const w = innerWidth;
		const h = innerHeight;
		ceiling = header.getBoundingClientRect().bottom;
		const text = Array.from(main.querySelectorAll(".vertical")).at(-1)?.getBoundingClientRect();
		floor = text && !matchMedia(SIDE).matches ? text.top : h;
		if (matchMedia(SIDE).matches) {
			const edge = (text ? text.right : w * 0.4) / w;
			const room = 1 - edge;
			stage.frame = { x: edge + room / 2 - 0.5, y: 0, scale: Math.min(1, room / (WIDE / (w / h))) };
			backdrop = false;
		} else {
			backdrop = w < BACKDROP_BELOW;
			if (backdrop && closeIn) {
				stage.frame = { x: 0, y: BACKDROP_Y, scale: BACKDROP_ZOOM };
				return;
			}
			const bottom = text ? text.top : h * 0.55;
			const room = bottom - ceiling;
			const fit = Math.min(EDGE, room / (w * TALL));
			stage.frame = { x: 0, y: (ceiling + bottom) / 2 / h - 0.5, scale: backdrop ? fit * BACKDROP_OUT : fit };
		}
	}

	/** The least room between a speech bubble and the screen's edge. */
	const EDGE_GAP = 12;

	const head = { x: 0, y: 0 };
	/** On screen, between the header and the words, with room for a bubble. */
	function inView(mover: Stage["movers"][number]): boolean {
		if (!stage) return false;
		stage.project(mover, head);
		return head.x > 40 && head.x < innerWidth - 40 && head.y > ceiling + 90 && head.y < floor - 10;
	}

	// the language changes under a running scene (the dev bar): its people
	// start over in it, rather than finish the round in the last
	$effect(() => {
		void i18n.locale;
		untrack(() => (exchange || speaker) && converse());
	});

	// every vertical's words stand differently tall: the diorama makes room
	$effect(() => {
		void shown;
		void tick().then(place);
	});

	// a row too long for a phone keeps the active industry in view
	$effect(() => {
		const a = nav?.children[active] as HTMLElement | undefined;
		if (!a || nav.scrollWidth <= nav.clientWidth) return;
		nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: reducedMotion() ? "instant" : "smooth" });
	});

	function go(i: number) {
		sections[i]?.scrollIntoView({ behavior: "smooth" });
	}

	/** The address of what is on screen, the open card as its fragment. */
	function sync() {
		const path = home ? pagePath(i18n.locale) : pagePath(i18n.locale, VERTICALS[active].id);
		replaceState(path + (card ? `#${card}` : ""), {});
	}

	function open(which: CardName | null) {
		card = which;
		sync();
	}

	onMount(() => {
		const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
		// the address names the vertical: start there, wherever the scroll was
		scrollTo({ top: startIndex * innerHeight, behavior: "instant" });
		const fromHash = () => {
			const h = location.hash.slice(1);
			card = (CARDS as readonly string[]).includes(h) ? (h as CardName) : null;
		};
		fromHash();
		addEventListener("hashchange", fromHash);
		const esc = (e: KeyboardEvent) => e.key === "Escape" && card && open(null);
		addEventListener("keydown", esc);
		const at = { x: 0, y: 0 };

		(async () => {
			const { Stage } = await import("$lib/stage/stage");
			stage = new Stage(canvas);
			stage.reduced = reduced;
			stage.onBuild = (v) => {
				shown = v;
				closeIn = false;
				place();
			};
			// once the first scene stands, the rest are prepared in idle time,
			// one at a time, so any jump between verticals is instant
			let warmed = false;
			stage.onBuilt = () => {
				closeIn = true;
				place();
				// the people talk once the camera has come in on them
				if (backdrop) timers.push(setTimeout(converse, CLOSE_IN_MS));
				else converse();
				if (warmed) return;
				warmed = true;
				// a visitor saving data gets each scene when it is shown
				if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
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
				// over the speaker's head, but never past the screen's edge: on a
				// phone a worker near the side would push half the words off it,
				const talk = bubble.firstElementChild as HTMLElement | null;
				const half = (talk?.offsetWidth ?? 0) / 2;
				const x = half ? Math.min(innerWidth - EDGE_GAP - half, Math.max(EDGE_GAP + half, at.x)) : at.x;
				// and never up under the header: the answer stacks above the question
				const y = talk ? Math.max(at.y, ceiling + EDGE_GAP + talk.offsetHeight) : at.y;
				bubble.style.transform = `translate(${x}px, ${y}px)`;
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
						home = false;
						if (card === "details") card = null;
						sync();
						timers.forEach(clearTimeout);
						exchange = null;
						speaker?.talk(false);
						speaker = undefined;
						voice = null;
						shown = null;
						// a phone pulls back as the scene takes itself apart
						closeIn = false;
						place();
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
			removeEventListener("hashchange", fromHash);
			removeEventListener("keydown", esc);
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

<Head vertical={home ? undefined : vertical.id} />

<canvas
	bind:this={canvas}
	class="stage"
	aria-label={words.stage(words.verticals[vertical.id].name)}
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
			{#if answered}<p class="answer"><Wave live={voice === "answer"} />{exchange.answer}</p>{/if}
			<p class="ask">
				<Wave live={voice === "ask"} />{exchange.ask}
				{#if exchange.lang && exchange.lang !== i18n.locale}
					<span class="lang">{words.askedIn(languageName(exchange.lang))}</span>
				{/if}
			</p>
			</div>
		{/key}
	{/if}
</div>

<header bind:this={header}>
	<div class="brand">
		<a class="mark" href={pagePath(i18n.locale)}>{site.brand}</a>
		<span class="tagline">{site.tagline}</span>
	</div>
	<div class="actions">
		<!-- import.meta.env.DEV is written in as false for the build, and the
		     bar is imported only here, so its code leaves the bundle with it -->
		{#if import.meta.env.DEV}
			{#await import("$lib/DevBar.svelte") then { default: DevBar }}
				<DevBar
					vertical={home ? undefined : vertical.id}
					{card}
					onrepaint={() => requestAnimationFrame(() => stage?.repaint())}
				/>
			{/await}
		{/if}
		<!-- the other languages, each the same view in it: the scroll stays,
		     or the page, back at its top, would move on to the first vertical -->
		{#each LOCALES.filter((l) => l !== i18n.locale) as l (l)}
			<a
				class="switch"
				data-sveltekit-noscroll
				href={(home ? pagePath(l) : pagePath(l, VERTICALS[active].id)) + (card ? `#${card}` : "")}
				hreflang={l}
				lang={l}
				aria-label={MESSAGES[l].site.language}>{l.toUpperCase()}</a
			>
		{/each}
		<a
			class="about"
			href="#mandy"
			onclick={(e) => {
				e.preventDefault();
				open("mandy");
			}}>{words.about}</a
		>
		<a
			class="demo"
			href="#contact"
			onclick={(e) => {
				e.preventDefault();
				open("contact");
			}}>{m().contact.link}</a
		>
		{#if DEMO_URL}<a class="demo" href={DEMO_URL}>{site.demo}</a>{/if}
	</div>
</header>

<div class="paper" aria-hidden="true"></div>

<Assistant locale={i18n.locale} words={words.assistant} />



<nav bind:this={nav} aria-label={words.industries} style="--active: {active}">
	{#each VERTICALS as v, i (v.id)}
		<a
			href={pagePath(i18n.locale, v.id)}
			class:on={i === active}
			aria-current={i === active ? "page" : undefined}
			onclick={(e) => {
				e.preventDefault();
				go(i);
			}}>{words.verticals[v.id].name}</a
		>
	{/each}
</nav>

<main bind:this={main}>
	{#if shown}
		{#key shown.id}
			{@const w = words.verticals[shown.id]}
			<!-- the name lands letter by letter as the scene builds, then the rest -->
			<section class="vertical" aria-live="polite" style="--n: {w.name.length}" out:lift|global>
				<h1 aria-label={w.name}>
					{#each Array.from(w.name) as ch, c (c)}<span class="ch" aria-hidden="true" style="--c: {c}">{ch}</span>{/each}
				</h1>
				<p class="headline" style="--i: 0">
					{#each w.headline as line (line)}<span>{line}</span>{/each}
				</p>
				<ul>
					{#each w.does as d, n (d.text)}
						<li style="--i: {n + 1}"><span class="verb">{words.verbs[d.verb]}</span>{d.text}</li>
					{/each}
				</ul>
				<p class="gain" style="--i: 4">{w.gain}</p>
				<a
					class="more"
					style="--i: 5"
					href="#details"
					onclick={(e) => {
						e.preventDefault();
						open("details");
					}}>{w.card.question}</a
				>
			</section>
		{/key}
	{/if}

	<!-- the cards are in the page as built, closed: what search and answer
	     engines read, and what a reader opens. The page's own topic first. -->
	{#if home}
		{@render about()}
		{@render details()}
	{:else}
		{@render details()}
		{@render about()}
	{/if}

	{#snippet about()}<AboutCard open={card === "mandy"} onclose={() => open(null)} oncontact={() => open("contact")} />{/snippet}
	{#snippet details()}<VerticalCard
			vertical={vertical.id}
			open={card === "details"}
			onclose={() => open(null)}
			onabout={() => open("mandy")}
			oncontact={() => open("contact")}
		/>{/snippet}

	<ContactCard open={card === "contact"} onclose={() => open(null)} />

	<!-- one screen of scroll per vertical; the stage above shows the one in view -->
	{#each VERTICALS as v, i (v.id)}
		<section class="stop" bind:this={sections[i]} aria-label={words.verticals[v.id].name}></section>
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
	header a {
		color: inherit;
		text-decoration: none;
	}
	.mark {
		font-size: 1.5rem;
		font-weight: 800;
		font-stretch: 125%;
		letter-spacing: -0.02em;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.about {
		font-size: 0.95rem;
		font-weight: 600;
		font-stretch: 90%;
	}
	.about:hover {
		color: var(--accent);
	}
	.switch {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink-soft);
	}
	.switch:hover {
		color: var(--ink);
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
		--room: min(30rem, 38vw);
	width: var(--room);
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
		/* as large as the column takes the name: a long one ("Lebensmittel")
	   comes smaller, at about 0.72em a letter in this cut */
	font-size: min(clamp(2.75rem, 5.4vw, 5rem), calc(var(--room) / (var(--n) * 0.72)));
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
		/* the verbs' column as wide as the longest verb, in any language */
		grid-template-columns: max-content 1fr;
		gap: 0.85rem 1.1rem;
	}
	/* the verb in accent, what it means here in one quiet line */
	li {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
		font-size: 0.98rem;
		line-height: 1.45;
		color: var(--ink-soft);
		text-wrap: pretty;
	}
	.verb {
		color: var(--accent);
		font-weight: 700;
		font-stretch: 112%;
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
	/* the way on to the vertical's card: one quiet line under the result */
	.more {
		display: inline-block;
		margin-top: 1.1rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--accent);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25em;
		pointer-events: auto;
		animation: arrive 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(0.55s + var(--n) * 40ms + var(--i) * 90ms);
	}
	.more:hover {
		text-decoration-thickness: 2px;
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
	nav a {
		position: relative;
		font-size: 0.95rem;
		font-weight: 600;
		font-stretch: 90%;
		color: var(--ink-soft);
		text-decoration: none;
		padding: 0.75rem 0 0.9rem;
		transition: color 0.25s;
	}
	nav a::after {
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
	nav a:hover,
	nav a.on {
		color: var(--ink);
	}
	nav a.on::after {
		transform: scaleX(1);
	}
	nav a:focus-visible,
	header a:focus-visible,
	.more:focus-visible {
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
	/* frosted paper, not blueprint's glass: that is a faint tint for chips
	   on a plain surface (black at 7% in light), and over the busy scene the
	   words drowned in the racks behind them */
	.ask {
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		backdrop-filter: blur(10px) saturate(0.6);
		color: var(--ink);
		border: 1px solid var(--glass-edge);
	}
	.ask :global(.wave) {
		color: var(--accent);
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

	/* a phone: paper at the top too, so the header reads over the walls (the
	   width BACKDROP_BELOW gives the script) */
	@media (orientation: portrait) and (max-width: 599px) {
		.paper {
			background:
				linear-gradient(180deg, var(--paper) 3%, color-mix(in srgb, var(--paper) 80%, transparent) 9%, transparent 20%),
				linear-gradient(0deg, var(--paper) 0%, var(--paper) 38%, transparent 62%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bubble p,
		.ch,
		.headline,
		.vertical li,
		.gain,
		.more {
			animation: none;
		}
		nav a::after {
			transition: none;
		}
		:global(html) {
			scroll-behavior: auto;
		}
	}
	/* stacked (the inverse of SIDE above): the text under the diorama, on
	   paper rising from the bottom */
	@media (orientation: portrait), (max-width: 899px) and (min-height: 560px) {
		.tagline {
			display: none;
		}
		.paper {
			background: linear-gradient(0deg, var(--paper) 0%, var(--paper) 38%, transparent 62%);
		}
		.vertical {
			top: auto;
			bottom: calc(4.25rem + env(safe-area-inset-bottom));
			transform: none;
			width: auto;
			right: clamp(1.25rem, 5vw, 4.5rem);
			--room: min(36rem, calc(100vw - 2 * clamp(1.25rem, 5vw, 4.5rem)));
			max-width: 36rem;
		}
		.vertical h1 {
			font-size: min(clamp(2.4rem, 9vw, 4.5rem), calc(var(--room) / (var(--n) * 0.72)));
		}
		.headline {
			margin-top: 0.75rem;
			font-size: clamp(1.1rem, 4.2vw, 1.35rem);
		}
		ul {
			margin-top: 1rem;
			gap: 0.5rem 1rem;
		}
		li {
			font-size: 0.93rem;
			line-height: 1.4;
		}
		.gain {
			display: none;
		}
		.more {
			margin-top: 0.9rem;
			/* a thumb's worth of target */
			padding-block: 0.35rem;
			/* it wraps before the assistant's mascot in the corner */
			max-width: calc(100% - 5.5rem);
		}
		nav {
			display: flex;
			overflow-x: auto;
			gap: 1.25rem;
			/* ends where the assistant's mascot sits (80 px, 24 px from the
			   corner), so no industry hides under it */
			right: 6.5rem;
			bottom: calc(0.5rem + env(safe-area-inset-bottom));
			padding-right: 1.25rem;
			scroll-padding-inline: 1.25rem;
			/* the row runs on past the edge: it fades there, so it reads as more */
			mask-image: linear-gradient(90deg, black calc(100% - 3rem), transparent);
		}
		nav a {
			flex: none;
		}
	}
	/* a small phone: the words take less of the height, the scene the rest */
	@media (orientation: portrait) and (max-height: 700px), (orientation: portrait) and (max-width: 360px) {
		header {
			padding-block: 1rem;
		}
		.mark {
			font-size: 1.3rem;
		}
		.headline {
			font-size: 1.05rem;
		}
		ul {
			margin-top: 0.75rem;
			gap: 0.35rem 0.85rem;
		}
		li {
			font-size: 0.86rem;
			line-height: 1.35;
		}
		.more {
			font-size: 0.88rem;
		}
	}
	/* a phone turned sideways: side by side, everything tighter to fit the
	   little height */
	@media (orientation: landscape) and (max-height: 559px) {
		header {
			padding-block: 0.75rem;
		}
		.mark {
			font-size: 1.2rem;
		}
		.tagline {
			display: none;
		}
		.vertical {
			top: calc(50% - 1rem);
			--room: min(26rem, 42vw);
		}
		.vertical h1 {
			font-size: min(clamp(1.9rem, 6vh, 3rem), calc(var(--room) / (var(--n) * 0.72)));
		}
		.headline {
			margin-top: 0.5rem;
			font-size: 1rem;
		}
		ul {
			margin-top: 0.75rem;
			gap: 0.3rem 0.85rem;
		}
		li {
			font-size: 0.82rem;
			line-height: 1.35;
		}
		.gain {
			display: none;
		}
		.more {
			margin-top: 0.6rem;
			font-size: 0.85rem;
		}
		nav {
			display: flex;
			overflow-x: auto;
			right: 6.5rem;
			padding-right: 1.25rem;
			bottom: 0.25rem;
			gap: 0 1.1rem;
			mask-image: linear-gradient(90deg, black calc(100% - 3rem), transparent);
		}
		nav a {
			flex: none;
		}
		nav a {
			font-size: 0.82rem;
			padding-block: 0.5rem 0.7rem;
		}
		nav a::after {
			bottom: 0.25rem;
		}
	}
	/* bubbles sized to a phone: never wider than most of the screen */
	/* a phone: the header's links closer together, the pill smaller */
	@media (max-width: 599px) {
		.actions {
			gap: 0.9rem;
		}
		.about {
			font-size: 0.88rem;
		}
		.demo {
			padding: 0.5rem 0.95rem;
			font-size: 0.88rem;
		}
	}
	@media (max-width: 599px), (max-height: 559px) {
		.bubble p {
			max-width: min(16rem, 64vw);
			padding: 0.45rem 0.7rem;
			font-size: 0.8rem;
		}
	}
</style>
