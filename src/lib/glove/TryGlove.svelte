<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import {
		Glove3D,
		PANEL_H,
		PANEL_W,
		apply,
		drawPanel,
		emptyState,
		hitTest,
		loadAssets,
		tick,
		type Hit,
	} from "@proglove/mai-kit/render";
	import { m } from "$lib/i18n/index.svelte";
	import type { TryFlow } from "$lib/site";
	import { GloveSession, type Phase } from "./session";

	/**
	 * The web glove: Mandy on a MAI glove's screen, drawn as the Studio's
	 * showcase draws it (mai-kit's renderer, in 3D), talking to a real flow.
	 * The glove's AI button is held to talk, on the glove or on the button
	 * under it (a pointer, a finger or the space bar). Loaded only when a
	 * visitor opens it: the glove, the room and the core weigh more than the
	 * page.
	 */
	let { flow, onclose }: { flow: TryFlow; onclose: () => void } = $props();

	const words = $derived(m().home.try);

	// The panel is drawn once per change into this canvas; the 3D glove
	// shows it on its glass.
	const panel = document.createElement("canvas");
	panel.width = PANEL_W;
	panel.height = PANEL_H;
	const ctx = panel.getContext("2d")!;
	let mai = emptyState();
	let hits: Hit[] = [];
	let held = $state<Hit | null>(null);
	let frames = $state(0);

	let phase = $state<Phase>("idle");
	let session: GloveSession | null = null;
	/** The AI button is down. */
	let talking = $state(false);

	function redraw() {
		hits = drawPanel(ctx, mai, { hand: "right", pressed: held?.key });
		frames++;
	}

	function start() {
		session = new GloveSession(
			flow,
			(commands) => {
				for (const c of commands) apply(mai, c);
				redraw();
			},
			(p) => (phase = p),
		);
		void session.start();
	}

	/** The AI button: the first press starts a session; while one is live,
	 *  it is held to talk. */
	function ai(phase_: "down" | "up") {
		if (phase === "idle" || phase === "ended" || phase === "failed") {
			if (phase_ === "down") {
				mai = emptyState();
				redraw();
				start();
			}
			return;
		}
		talking = phase_ === "down";
		session?.press(talking ? "hold-start" : "hold-end");
	}

	/** A press on the glass, in panel pixels: true when it landed on
	 *  something pressable, so the pointer presses instead of turning the glove. */
	function onpanel(p: "down" | "up" | "cancel", x: number, y: number): boolean {
		if (p === "down") {
			held = hitTest(hits, x, y);
			if (held?.action === "AI_ASSISTANT") ai("down");
			redraw();
			return !!held;
		}
		const was = held;
		held = null;
		redraw();
		if (!was) return false;
		// A hold always ends, even off the button; anything else counts only
		// released on it.
		if (was.action === "AI_ASSISTANT") ai("up");
		else if (p === "up" && hitTest(hits, x, y)?.key === was.key) session?.button(was.refId);
		return true;
	}

	function key(e: KeyboardEvent, down: boolean) {
		if (e.key === "Escape" && down) onclose();
		if (e.code !== "Space" || e.repeat) return;
		e.preventDefault();
		ai(down ? "down" : "up");
	}

	let timer: ReturnType<typeof setInterval>;
	onMount(() => {
		void loadAssets().then(redraw);
		redraw();
		// A timed screen (a note) goes back to what it covered by itself.
		timer = setInterval(() => {
			const before = mai.version;
			tick(mai);
			if (mai.version !== before) redraw();
		}, 250);
	});
	onDestroy(() => {
		clearInterval(timer);
		void session?.stop();
	});

	const line = $derived(
		phase === "connecting"
			? words.connecting
			: phase === "live"
				? words.live
				: phase === "ended"
					? words.ended
					: phase === "failed"
						? words.failed
						: words.idle,
	);
</script>

<svelte:window onkeydown={(e) => key(e, true)} onkeyup={(e) => key(e, false)} />

<button class="veil" tabindex="-1" aria-hidden="true" onclick={onclose}></button>
<div class="try" role="dialog" aria-modal="true" aria-label={words.open}>
	<button class="close" onclick={onclose} aria-label={m().home.close}>×</button>
	<div class="glove" role="img" aria-label={words.glove}>
		<Glove3D {panel} version={frames} {onpanel} />
	</div>
	<div class="under">
		<p class="line" aria-live="polite">{line}</p>
		<button
			class="talk"
			class:on={talking}
			disabled={phase === "connecting"}
			onpointerdown={(e) => {
				(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
				ai("down");
			}}
			onpointerup={() => ai("up")}
			onpointercancel={() => ai("up")}
		>
			{phase === "live" ? words.hold : words.start}
		</button>
	</div>
</div>

<style>
	.veil {
		position: fixed;
		inset: 0;
		z-index: 4;
		border: 0;
		padding: 0;
		background: color-mix(in srgb, var(--paper) 55%, transparent);
		backdrop-filter: blur(6px);
	}
	.try {
		position: fixed;
		z-index: 5;
		inset: clamp(0.5rem, 3vh, 2rem) clamp(0.5rem, 3vw, 2rem);
		display: grid;
		grid-template-rows: 1fr auto;
		border-radius: 1.5rem;
		overflow: hidden;
		background: radial-gradient(ellipse at 50% 40%, color-mix(in srgb, var(--ink) 8%, var(--paper)) 0%, var(--paper) 70%);
		box-shadow: 0 2rem 5rem -2rem color-mix(in srgb, black 50%, transparent);
	}
	.glove {
		position: relative;
		min-height: 0;
	}
	.under {
		display: grid;
		justify-items: center;
		gap: 0.9rem;
		padding: 0 1.25rem clamp(1.25rem, 4vh, 2.5rem);
	}
	.line {
		margin: 0;
		min-height: 1.4em;
		font-size: 1rem;
		text-align: center;
		color: var(--ink-soft);
	}
	.talk {
		min-width: 12rem;
		padding: 0.95rem 1.6rem;
		border: 0;
		border-radius: 999px;
		background: var(--accent);
		color: white;
		font: inherit;
		font-weight: 700;
		font-stretch: 105%;
		cursor: pointer;
		user-select: none;
		touch-action: none;
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.talk.on {
		transform: scale(0.97);
		box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--accent) 25%, transparent);
	}
	.talk:disabled {
		opacity: 0.6;
		cursor: progress;
	}
	.talk:focus-visible,
	.close:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.close {
		position: absolute;
		z-index: 1;
		top: 0.75rem;
		right: 0.75rem;
		width: 2.75rem;
		height: 2.75rem;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--ink-soft);
		font: inherit;
		font-size: 1.7rem;
		line-height: 1;
		cursor: pointer;
	}
	.close:hover {
		color: var(--ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.talk {
			transition: none;
		}
	}
</style>
