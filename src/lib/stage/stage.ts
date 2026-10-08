import * as THREE from "three";
import { loadScene, type LoadedScene } from "./scene";
import { loadMovers, type Mover } from "./actors";
import { readPalette, type Palette } from "./palette";
import { Assembly } from "./assemble";
import type { Vertical } from "$lib/verticals";

/**
 * The page's 3D stage: one vertical's scene as a diorama, its people and
 * machines moving. It owns the renderer, the camera and the loop.
 *
 * The camera is orthographic at the film's 30° down, turned so the two far
 * walls stand behind and to the left: the hall seen from inside. A drag
 * turns it a little round the hall; let go and it drifts back. [frame] shifts
 * the diorama on screen, so the page's text has clean paper of its own.
 *
 * Scenes are prepared once (fetched, parsed, outlined) and kept: switching
 * costs nothing at the moment it happens. A switch is two clean moves: the
 * scene that goes takes itself apart down to nothing, an empty beat, then
 * the next builds from below (assemble.ts) and its people arrive once it
 * stands.
 */
const ELEVATION = THREE.MathUtils.degToRad(30);
const AZIMUTH = THREE.MathUtils.degToRad(22);
const DISTANCE = 140;
/** Seconds the people take to arrive once the scene stands. */
const ENTRANCE = 0.7;
/** The empty beat between one scene gone and the next arriving. */
const GAP_S = 0.12;
/** How far a drag may turn the view, each way. */
const TURN_MAX = THREE.MathUtils.degToRad(35);

interface Prepared {
	set: LoadedScene;
	movers: Mover[];
}

interface Staged extends Prepared {
	vertical: Vertical;
	assembly: Assembly;
	/** Its build has begun (after the scene before it is gone). */
	started: boolean;
	/** Seconds since it stood, for the people's entrance; -1 before. */
	standing: number;
}

export class Stage {
	readonly scene = new THREE.Scene();
	readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 600);
	readonly renderer: THREE.WebGLRenderer;
	palette: Palette;
	/** Called as a vertical's scene starts to build, and once it stands. */
	onBuild?: (vertical: Vertical) => void;
	onBuilt?: () => void;
	/** No assembling, no taking apart: scenes are simply there (reduced motion). */
	reduced = false;
	/** Where the diorama sits on screen: a shift of its centre, in fractions
	 *  of the viewport (x right, y down), and its size (1 as the scene's span
	 *  fills the view), so text can have the paper beside or under it. The
	 *  view glides to a new frame rather than jumping. */
	frame = { x: 0, y: 0, scale: 1 };
	private framed?: { x: number; y: number; scale: number };

	private current?: Staged;
	private outgoing: Staged[] = [];
	private prepared = new Map<string, Promise<Prepared>>();
	private ticket = 0;
	/** Seconds left of the empty beat before the next scene assembles. */
	private gap = 0;
	private span = 46;
	private spanGoal = 46;
	private target = new THREE.Vector3(0, 1, 0);
	private turn = 0;
	private turnGoal = 0;
	private dragging = false;
	private timer = new THREE.Timer();
	private running = false;
	private frameHooks: (() => void)[] = [];
	private hemi = new THREE.HemisphereLight(0xffffff, 0xb8b8c0, 2.2);
	private sun = new THREE.DirectionalLight(0xffffff, 1.4);

	constructor(readonly canvas: HTMLCanvasElement) {
		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.palette = readPalette();
		this.sun.position.set(-30, 60, 40);
		this.scene.add(this.hemi, this.sun);
	}

	/** The people and machines of the scene on stage. */
	get movers(): Mover[] {
		return this.current?.movers ?? [];
	}

	/** Fetch, parse and outline a vertical's scene ahead; kept for good. */
	prepare(vertical: Vertical): Promise<Prepared> {
		let p = this.prepared.get(vertical.id);
		if (!p) {
			p = Promise.all([loadScene(vertical.scene, this.palette), loadMovers(vertical.actors, this.palette)]).then(
				([set, movers]) => ({ set, movers }),
			);
			this.prepared.set(vertical.id, p);
		}
		return p;
	}

	/** Show [vertical]: it assembles while the scene on stage takes itself
	 *  apart. Shows asked for while one is loading: the last wins. */
	async show(vertical: Vertical): Promise<void> {
		const ticket = ++this.ticket;
		const next = await this.prepare(vertical);
		if (ticket !== this.ticket || next.set === this.current?.set) return;
		// back to a scene that is still on its way out: it turns round
		this.outgoing = this.outgoing.filter((s) => s.set !== next.set);
		if (this.current) this.outgoing.push(this.current);
		const staged: Staged = { ...next, vertical, assembly: new Assembly(next.set.pieces), started: false, standing: -1 };
		this.current = staged;
		this.spanGoal = vertical.span;
		if (!next.set.root.parent) this.scene.add(next.set.root, ...next.movers.map((m) => m.object));
		for (const m of next.movers) m.object.visible = false;
		this.resize();
		if (this.reduced) {
			for (const s of this.outgoing) this.drop(s);
			this.outgoing = [];
			this.onBuild?.(vertical);
			this.built();
		}
	}

	/** Called every frame, after the movers moved: overlays follow here. */
	onFrame(hook: () => void): void {
		this.frameHooks.push(hook);
	}

	/** Screen pixels of a point in a mover's frame. */
	project(m: Mover, out: { x: number; y: number }): void {
		const v = m.head.clone().applyMatrix4(m.object.matrixWorld).project(this.camera);
		out.x = (v.x * 0.5 + 0.5) * this.canvas.clientWidth;
		out.y = (-v.y * 0.5 + 0.5) * this.canvas.clientHeight;
	}

	/** A drag across the canvas turns the hall with it, as if held: drag
	 *  right and its near side follows right. dx in pixels, null on release. */
	drag(dx: number | null): void {
		if (dx === null) {
			this.dragging = false;
			this.turnGoal = 0;
			return;
		}
		this.dragging = true;
		this.turnGoal = THREE.MathUtils.clamp(this.turnGoal - dx * 0.004, -TURN_MAX, TURN_MAX);
	}

	resize(): void {
		const w = this.canvas.clientWidth;
		const h = this.canvas.clientHeight;
		this.renderer.setSize(w, h, false);
		for (const p of [this.current, ...this.outgoing]) p?.set.lines.resolution.set(w, h);
	}

	repaint(): void {
		this.palette = readPalette();
		for (const p of this.prepared.values()) {
			void p.then(({ set, movers }) => {
				set.recolour(this.palette);
				for (const m of movers) m.recolour(this.palette);
			});
		}
	}

	/** The scene on stage, built, its people there (reduced motion). */
	private built(): void {
		const s = this.current;
		if (!s) return;
		s.assembly.finish();
		s.standing = ENTRANCE + 1;
		for (const m of s.movers) {
			m.object.visible = true;
			m.object.scale.setScalar(1);
		}
		this.onBuilt?.();
	}

	/** Off the stage: kept prepared for the next time it is shown. */
	private drop(s: Staged): void {
		this.scene.remove(s.set.root, ...s.movers.map((m) => m.object));
	}

	private build(dt: number): void {
		// what goes: the people first, then the hall; nothing new arrives
		// until it is gone, and then only after an empty beat
		if (this.outgoing.length) {
			this.outgoing = this.outgoing.filter((s) => {
				for (const m of s.movers) m.object.scale.multiplyScalar(Math.exp(-dt * 18));
				if (!s.assembly.leave(dt)) return true;
				this.drop(s);
				return false;
			});
			this.gap = GAP_S;
			return;
		}
		if (this.gap > 0) {
			this.gap -= dt;
			return;
		}
		const s = this.current;
		if (!s || s.standing >= ENTRANCE + 1) return;
		if (s.standing < 0) {
			if (!s.started) {
				s.started = true;
				this.onBuild?.(s.vertical);
			}
			if (!s.assembly.update(dt)) return;
			s.standing = 0;
			this.onBuilt?.();
		}
		s.standing += dt;
		// the people arrive once it stands, one after another, with a little
		// overshoot: the film's other register, the world answering somebody
		s.movers.forEach((m, i) => {
			const k = Math.min(1, Math.max(0, (s.standing - i * 0.06) / 0.35));
			m.object.visible = k > 0;
			const back = 1.70158;
			const e = 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
			m.object.scale.setScalar(Math.max(0.001, e));
		});
	}

	private place(dt: number): void {
		// eased toward the drag, and home again after it; the size between
		// verticals glides rather than jumps
		this.turn += (this.turnGoal - this.turn) * (1 - Math.exp(-dt * (this.dragging ? 12 : 2.5)));
		this.span += (this.spanGoal - this.span) * (1 - Math.exp(-dt * 4));
		const f = (this.framed ??= { ...this.frame });
		const ease = 1 - Math.exp(-dt * 4);
		f.x += (this.frame.x - f.x) * ease;
		f.y += (this.frame.y - f.y) * ease;
		f.scale += (this.frame.scale - f.scale) * ease;
		const w = this.canvas.clientWidth || 1;
		const h = this.canvas.clientHeight || 1;
		const half = this.span / 2 / f.scale;
		const aspect = w / h;
		const [hw, hh] = aspect >= 1 ? [half * aspect, half] : [half, half / aspect];
		// the frustum moves against the shift, so the diorama moves with it
		const dx = f.x * 2 * hw;
		const dy = f.y * 2 * hh;
		Object.assign(this.camera, { left: -hw - dx, right: hw - dx, top: hh + dy, bottom: -hh + dy });
		const az = AZIMUTH + this.turn;
		const { target } = this;
		this.camera.position.set(
			target.x + DISTANCE * Math.cos(ELEVATION) * Math.sin(az),
			target.y + DISTANCE * Math.sin(ELEVATION),
			target.z + DISTANCE * Math.cos(ELEVATION) * Math.cos(az),
		);
		this.camera.lookAt(target);
		this.camera.updateProjectionMatrix();
		// now, not at render: overlays project through this frame's camera,
		// or they trail a frame behind every turn
		this.camera.updateMatrixWorld();
	}

	start(): void {
		if (this.running) return;
		this.running = true;
		const tick = () => {
			if (!this.running) return;
			this.timer.update();
			const dt = Math.min(this.timer.getDelta(), 0.1);
			this.build(dt);
			for (const m of this.movers) m.update(dt);
			this.place(dt);
			this.scene.updateMatrixWorld();
			for (const hook of this.frameHooks) hook();
			this.renderer.render(this.scene, this.camera);
			requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}

	dispose(): void {
		this.running = false;
		this.renderer.dispose();
	}
}
