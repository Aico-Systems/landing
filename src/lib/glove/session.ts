import { Room, RoomEvent, Track, type LocalTrackPublication, type RemoteTrack } from "livekit-client";
import type { Command } from "@proglove/mai-kit/render";
import init, { Glove, names } from "./core/aico_web.js";
import wasmUrl from "./core/aico_web_bg.wasm?url";
import type { TryFlow } from "$lib/site";

/**
 * One visitor's session on the web glove: the room and the microphone here,
 * every decision in the core (`clients/crates/aico-web`, compiled to wasm):
 * what the glove shows, what a press means, what goes to the agent. The
 * core is the one the Studio's glove gateway runs; this is its I/O.
 *
 * The visitor is anonymous (the web channel's public tier): a pseudonym kept
 * in this browser, as the widget keeps one, so a second visit continues
 * the conversation.
 */

/** What one call into the core gives the page to do (aico-web `Out`). */
interface Out {
	commands: Command[];
	messages: { topic: string; payload: string }[];
	grip: { value: string; message: string } | null;
	gate: "open" | "grip" | null;
	ended: string | null;
}

/** Where the session is, for the page around the glove. */
export type Phase = "idle" | "connecting" | "live" | "ended" | "failed";

/** The grip values that close a turn: they go once the last audio is out. */
const CLOSING = new Set(["0", "commit"]);
/** The grip that throws the turn away: the microphone closes at once. */
const DISCARD = "discard";
/** How long a closed turn's audio gets to reach the agent before the close
 *  does (aico-flow `RELEASE_SETTLE`): the audio rides RTP, the close the
 *  data channel, and nothing orders one against the other. */
const RELEASE_SETTLE_MS = 120;
/** How often time passes for the core (the frame, the caption's grace). */
const TICK_MS = 250;

let ready: Promise<{ turnHoldAttribute: string; surfaceAttribute: string; flowEvents: string }> | null = null;
function core() {
	ready ??= init({ module_or_path: wasmUrl }).then(() => JSON.parse(names()));
	return ready;
}

/** This browser's pseudonym for the web channel, kept across visits. */
function anonymousId(): string {
	const key = "mandy-glove-anonymous-id";
	try {
		const kept = localStorage.getItem(key);
		if (kept) return kept;
		const made = `web-${crypto.randomUUID()}`;
		localStorage.setItem(key, made);
		return made;
	} catch {
		return `web-${crypto.randomUUID()}`;
	}
}

async function json<T>(res: Response): Promise<T> {
	const body = await res.json().catch(() => undefined);
	if (!res.ok) throw new Error((body as { message?: string } | undefined)?.message ?? `HTTP ${res.status}`);
	return body as T;
}

export class GloveSession {
	private glove: Glove | null = null;
	private room: Room | null = null;
	private mic: LocalTrackPublication | undefined;
	private names!: Awaited<ReturnType<typeof core>>;
	private timer: ReturnType<typeof setInterval> | undefined;
	/** What was said before the room was there: sent once it is. */
	private queued: Out[] = [];
	private leaving = false;
	/** The microphone is live: a turn is open. */
	private talking = false;
	private audio: HTMLAudioElement[] = [];

	constructor(
		private readonly flow: TryFlow,
		/** The glove's commands, for the renderer. */
		private readonly onCommands: (commands: Command[]) => void,
		/** Where the session is. */
		private readonly onPhase: (phase: Phase, detail?: string) => void,
	) {}

	/** Open the glove's conversation and join the flow's room. */
	async start(): Promise<void> {
		this.onPhase("connecting");
		try {
			this.names = await core();
			this.glove = new Glove("hold");
			this.handle(this.glove.open(false));
			this.timer = setInterval(() => this.glove && this.handle(this.glove.tick(this.talking)), TICK_MS);
			await this.join();
		} catch (e) {
			this.onPhase("failed", e instanceof Error ? e.message : String(e));
			await this.stop();
		}
	}

	/** The glove's AI button: held to talk. */
	press(gesture: "hold-start" | "hold-end" | "tap"): void {
		if (this.glove) this.handle(this.glove.press(gesture));
	}

	/** Another of the glove's buttons, by its ref id. */
	button(refId: string): void {
		if (this.glove) this.handle(this.glove.button(refId));
	}

	/** Leave: the room, the microphone, the speaker. */
	async stop(): Promise<void> {
		this.leaving = true;
		clearInterval(this.timer);
		const room = this.room;
		this.room = null;
		await room?.disconnect().catch(() => {});
		for (const el of this.audio) el.remove();
		this.audio = [];
		this.glove?.free();
		this.glove = null;
	}

	private async join(): Promise<void> {
		const { api, org, flow } = this.flow;
		const resolve = new URL(`${api}/api/web/flows/resolve`);
		resolve.searchParams.set("org", org);
		resolve.searchParams.set("slug", flow);
		const { flowId } = await json<{ flowId: string }>(await fetch(resolve, { mode: "cors", credentials: "omit" }));
		// The glove reads light formatting; it takes no pictures and scans
		// nothing here, so it declares neither.
		const surface = {
			capabilities: ["markdown"],
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			locale: navigator.language,
		};
		const token = await json<{ url: string; token: string }>(
			await fetch(`${api}/api/web/flows/${flowId}/voice-token`, {
				method: "POST",
				mode: "cors",
				credentials: "omit",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sessionId: crypto.randomUUID(), anonymousId: anonymousId(), components: { surface } }),
			}),
		);
		if (this.leaving) return;

		const room = new Room({
			audioCaptureDefaults: { autoGainControl: true, echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
			publishDefaults: { dtx: true, red: true },
		});
		this.room = room;
		room.on(RoomEvent.DataReceived, (payload, _participant, _kind, topic) => {
			if (this.glove) this.handle(this.glove.packet(topic, payload));
		});
		room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
			if (track.kind !== Track.Kind.Audio) return;
			const el = track.attach() as HTMLAudioElement;
			el.style.display = "none";
			document.body.appendChild(el);
			this.audio.push(el);
		});
		// The agent subscribed to this page's microphone: it hears from now on.
		room.on(RoomEvent.LocalTrackSubscribed, () => this.glove && this.handle(this.glove.listening()));
		room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
			if (this.glove) this.handle(this.glove.speakers(speakers.map((p) => p.identity)));
		});
		room.on(RoomEvent.Disconnected, () => {
			if (this.glove) this.handle(this.glove.disconnected(this.leaving ? "stopped" : "room_closed"));
		});

		// No rtcConfig: LiveKit's own STUN/TURN list is the one to use.
		await room.connect(token.url, token.token);
		await room.startAudio().catch(() => {});
		await room.localParticipant.setAttributes({ [this.names.surfaceAttribute]: JSON.stringify(surface) });
		// The microphone is published muted: a turn unmutes it, and it is live
		// only while the button is held (the glove's hold-to-talk).
		await room.localParticipant.setMicrophoneEnabled(true);
		this.mic = room.localParticipant.getTrackPublication(Track.Source.Microphone);
		await this.mic?.mute();
		this.handle(this.glove!.connected(room.localParticipant.identity));
		this.onPhase("live");
		for (const out of this.queued.splice(0)) this.send(out);
	}

	private handle(json: string): void {
		const out = JSON.parse(json) as Out;
		if (out.commands.length) this.onCommands(out.commands);
		if (this.room) this.send(out);
		else if (out.messages.length || out.grip) this.queued.push(out);
		// serde writes what is not there as null
		if (out.ended != null) {
			this.onPhase("ended", out.ended);
			void this.stop();
		}
	}

	private send(out: Out): void {
		const room = this.room;
		if (!room) return;
		const publish = (topic: string, payload: string) =>
			room.localParticipant.publishData(new TextEncoder().encode(payload), { reliable: true, topic }).catch(() => {});
		for (const m of out.messages) void publish(m.topic, m.payload);
		const grip = out.grip;
		if (!grip) return;
		// The grip's message first (the edge the agent acts on), then the
		// attribute (its state, for a late joiner).
		const signal = () => {
			void publish(this.names.flowEvents, grip.message);
			void room.localParticipant.setAttributes({ [this.names.turnHoldAttribute]: grip.value }).catch(() => {});
		};
		if (CLOSING.has(grip.value)) {
			setTimeout(() => {
				signal();
				this.talking = false;
				void this.mic?.mute();
			}, RELEASE_SETTLE_MS);
		} else if (grip.value === DISCARD) {
			this.talking = false;
			void this.mic?.mute();
			signal();
		} else {
			this.talking = true;
			void this.mic?.unmute();
			signal();
		}
	}
}
