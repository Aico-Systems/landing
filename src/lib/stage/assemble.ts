import * as THREE from "three";

/**
 * A scene building itself, and taking itself apart, after the Mandy film's
 * opening shot (A1_shot01).
 *
 * Building: the floor rises from below while the racking already drops onto
 * it in one wave down the aisle, each carton just after its own bay; the
 * two far walls glide in from off screen across the whole build. Everything
 * rides the floor (its height is added to every other piece), so nothing
 * lands in the air above a floor still on its way, or hangs there while it
 * sinks.
 *
 * Leaving is the build played backwards, a little faster: the cartons lift
 * off, the racking rises away bay by bay, the walls glide out, and last the
 * floor sinks, leaving nothing.
 *
 * Pieces are grouped by the film's names; anything unnamed goes with the
 * racking.
 */
interface Piece {
	object: THREE.Object3D;
	/** The floor itself: the others ride its height. */
	floor: boolean;
	home: THREE.Vector3;
	start: number;
	duration: number;
	/** Where it comes from: an offset from home. */
	from: THREE.Vector3;
}

/** Building: the floor, and with it the wave of racking down the aisle. */
const FLOOR_S = 0.38;
const RACKS_AT = 0.12;
const WAVE_S = 0.8;
const CARTON_LAG = 0.12;
/** Seconds the whole build takes, played backwards, when the page moves on. */
const LEAVE_S = 0.9;

export class Assembly {
	private pieces: Piece[] = [];
	private t = 0;
	readonly length: number;

	constructor(objects: THREE.Object3D[]) {
		const named = (test: (n: string) => boolean) => objects.filter((p) => test(p.name));
		const slab = named((n) => n === "hall_floor" || n.startsWith("lane_"));
		const wallX = named((n) => n.startsWith("hall_wall_x") || n.startsWith("hall_cols_x"));
		const wallY = named((n) => n.startsWith("hall_wall_y") || n.startsWith("hall_cols_y"));
		const used = new Set([...slab, ...wallX, ...wallY]);
		const rest = objects.filter((p) => !used.has(p));

		// where along the aisle each rack piece stands, 0 at one end, 1 at the
		// other (a welded piece's origin need not be at its middle)
		const xs = new Map(rest.map((p) => [p, new THREE.Box3().setFromObject(p).getCenter(new THREE.Vector3()).x]));
		const x0 = Math.min(...xs.values());
		const span = Math.max(1e-6, Math.max(...xs.values()) - x0);
		const along = (p: THREE.Object3D) => (xs.get(p)! - x0) / span;

		const add = (list: THREE.Object3D[], start: (p: THREE.Object3D) => number, duration: number, x: number, y: number, z: number) =>
			list.forEach((object) =>
				this.pieces.push({
					object,
					floor: list === slab,
					// home is where the scene file put it, remembered once
					home: (object.userData.home ??= object.position.clone()),
					start: start(object),
					duration,
					from: new THREE.Vector3(x, y, z),
				}),
			);

		const buildEnd = RACKS_AT + WAVE_S + CARTON_LAG + 0.28;
		add(slab, () => 0, FLOOR_S, 0, -30, 0);
		// the walls take the whole build to come in, so they are seen arriving
		add(wallX, () => 0.05, buildEnd - 0.05, -50, 0, 0);
		add(wallY, () => 0.1, buildEnd - 0.1, 0, 0, -50);
		const frames = rest.filter((p) => !p.name.includes("_load_"));
		const loads = rest.filter((p) => p.name.includes("_load_"));
		add(frames, (p) => RACKS_AT + along(p) * WAVE_S, 0.28, 0, 13, 0);
		add(loads, (p) => RACKS_AT + CARTON_LAG + along(p) * WAVE_S, 0.24, 0, 12, 0);
		this.length = Math.max(...this.pieces.map((p) => p.start + p.duration));
		this.seek(0);
	}

	/** Advance the build; true once everything has landed. */
	update(dt: number): boolean {
		if (this.t < this.length) this.seek(Math.min(this.length, this.t + dt));
		return this.t >= this.length;
	}

	/** Play it backwards, [LEAVE_S] for the whole; true once nothing is left. */
	leave(dt: number): boolean {
		this.seek(Math.max(0, this.t - (dt * this.length) / LEAVE_S));
		return this.t <= 0;
	}

	/** Jump to the end: the scene as built (reduced motion). */
	finish(): void {
		this.seek(this.length);
	}

	private seek(t: number): void {
		this.t = t;
		// what falls lands hard; the floor rising and the walls gliding settle
		const offset = (p: Piece) => {
			const k = clamp01((t - p.start) / p.duration);
			return p.from.y > 0 ? 1 - k * k * k : (1 - k) ** 3;
		};
		const slab = this.pieces.find((p) => p.floor);
		const floorY = slab ? slab.from.y * offset(slab) : 0;
		for (const p of this.pieces) {
			p.object.visible = t > p.start;
			p.object.position.copy(p.home).addScaledVector(p.from, offset(p));
			if (!p.floor) p.object.position.y += floorY;
		}
	}
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
