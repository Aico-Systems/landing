import * as THREE from "three";
import type { Palette } from "./palette";
import type { Actor } from "$lib/verticals";

/**
 * The people and machines of a scene, each on its loop, both built here in
 * the scenes' flat style.
 *
 * A worker: a few rounded shapes and the glove (see [worker]). Asking
 * Mandy, they keep walking: work does not stop for a question, which is the
 * point of Mandy.
 *
 * A forklift: a counterbalance truck from boxes, its forks rising now and
 * then (the film's own forklift is a licensed model).
 */
export interface Mover {
	actor: Actor;
	object: THREE.Object3D;
	/** The point a speech bubble hangs from, in the mover's own frame. */
	head: THREE.Vector3;
	/** Asking Mandy now: glove up and pulsing, still walking. */
	talk(on: boolean): void;
	update(dt: number): void;
	recolour(p: Palette): void;
}

/** Distance along the loop, back and forth: the route there and back again. */
class Path {
	private points: THREE.Vector3[];
	private lengths: number[] = [];
	readonly total: number;

	constructor(route: [number, number][]) {
		const there = route.map(([x, z]) => new THREE.Vector3(x, 0, z));
		this.points = [...there, ...there.slice(0, -1).reverse()];
		let sum = 0;
		for (let i = 1; i < this.points.length; i++) {
			sum += this.points[i].distanceTo(this.points[i - 1]);
			this.lengths.push(sum);
		}
		this.total = sum;
	}

	/** Position and heading at distance [d] (wraps). */
	at(d: number, out: THREE.Vector3): number {
		d = ((d % this.total) + this.total) % this.total;
		let i = this.lengths.findIndex((l) => l >= d);
		if (i < 0) i = this.lengths.length - 1;
		const start = i === 0 ? 0 : this.lengths[i - 1];
		const a = this.points[i];
		const b = this.points[i + 1];
		const t = (d - start) / Math.max(1e-6, this.lengths[i] - start);
		out.lerpVectors(a, b, t);
		return Math.atan2(b.x - a.x, b.z - a.z);
	}
}

export async function loadMovers(actors: Actor[], p: Palette): Promise<Mover[]> {
	return actors.map((actor, i) => {
		const path = new Path(actor.route);
		let d = (actor.offset ?? 0) * path.total;
		const pos = new THREE.Vector3();
		let talking = false;
		const body = actor.kind === "worker" ? worker(p, i) : forklift(p);
		return {
			actor,
			object: body.group,
			head: new THREE.Vector3(0, actor.kind === "worker" ? 2.3 : 2.6, 0),
			talk(on) {
				talking = on;
			},
			update(dt) {
				// Mandy is asked on the move: nobody stops to talk
				d += actor.speed * dt;
				body.group.rotation.y = path.at(d, pos);
				body.group.position.copy(pos);
				body.animate(dt, actor.speed, talking);
			},
			recolour: body.recolour,
		} satisfies Mover;
	});
}

/** The hard hats come in three colours, so a crew does not look cloned. */
const HATS = ["person", "accent", "cartonLight"] as const;

/**
 * A worker, as abstract as the scenes: a vest-coloured capsule, a head in
 * its hard hat, two stub legs, and the glove — one orange dot at the right
 * hand. Walking is a bob and a sway with the legs stepping; asking Mandy,
 * the glove comes up to the chest and pulses, and the walk goes on.
 * About 2.3 m to the hat: drawn a little large, to read at the diorama's
 * distance.
 */
function worker(p: Palette, n: number) {
	const hat = HATS[n % HATS.length];
	const mats = {
		legs: new THREE.MeshLambertMaterial({ color: p.ink }),
		vest: new THREE.MeshLambertMaterial({ color: p.vest }),
		head: new THREE.MeshLambertMaterial({ color: p.person }),
		hat: new THREE.MeshLambertMaterial({ color: p[hat] }),
		glove: new THREE.MeshLambertMaterial({ color: p.accent }),
	};
	const ring = new THREE.MeshBasicMaterial({ color: p.accent, transparent: true, opacity: 0, depthWrite: false });
	const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, y = 0) => {
		const m = new THREE.Mesh(geo, mat);
		m.position.y = y;
		parent.add(m);
		return m;
	};

	const group = new THREE.Group();
	const legs = [-1, 1].map((side) => {
		const hip = new THREE.Group();
		hip.position.set(side * 0.16, 0.85, 0);
		group.add(hip);
		mesh(new THREE.CapsuleGeometry(0.11, 0.55, 3, 8), mats.legs, hip, -0.42);
		return hip;
	});
	const torso = new THREE.Group();
	torso.position.y = 0.85;
	group.add(torso);
	mesh(new THREE.CapsuleGeometry(0.3, 0.55, 4, 12), mats.vest, torso, 0.45);
	mesh(new THREE.SphereGeometry(0.2, 14, 10), mats.head, torso, 1.18);
	mesh(new THREE.SphereGeometry(0.23, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mats.hat, torso, 1.22);
	const glove = mesh(new THREE.SphereGeometry(0.11, 12, 8), mats.glove, torso);
	const pulse = new THREE.Mesh(new THREE.RingGeometry(0.14, 0.18, 24), ring);
	pulse.rotation.x = -Math.PI / 2;
	glove.add(pulse);

	/** Where the glove hangs, at the side, and where it is held, before the chest. */
	const down = new THREE.Vector3(0.36, 0.2, 0.05);
	const up = new THREE.Vector3(0.18, 0.62, 0.32);
	glove.position.copy(down);
	let phase = Math.random() * Math.PI * 2;
	let lift = 0;
	let beat = 0;
	return {
		group,
		animate(dt: number, speed: number, talk: boolean) {
			// a step every ~0.6 m
			phase += dt * speed * 5.2;
			const s = Math.sin(phase);
			legs[0].rotation.x = 0.45 * s;
			legs[1].rotation.x = -0.45 * s;
			torso.position.y = 0.85 + Math.abs(Math.cos(phase)) * 0.06;
			torso.rotation.z = 0.05 * s;
			lift += ((talk ? 1 : 0) - lift) * (1 - Math.exp(-dt * 8));
			glove.position.lerpVectors(down, up, lift);
			glove.position.z += 0.06 * s * (1 - lift);
			// the ring leaves the glove and fades, again and again, while they talk
			beat = (beat + dt / 0.9) % 1;
			pulse.scale.setScalar(1 + beat * 3);
			ring.opacity = lift * (1 - beat) * 0.9;
		},
		recolour(next: Palette) {
			mats.legs.color.copy(next.ink);
			mats.vest.color.copy(next.vest);
			mats.head.color.copy(next.person);
			mats.hat.color.copy(next[hat]);
			mats.glove.color.copy(next.accent);
			ring.color.copy(next.accent);
		},
	};
}

/** A counterbalance forklift from boxes: body, overhead guard, mast, forks. */
function forklift(p: Palette) {
	const body = new THREE.MeshLambertMaterial({ color: p.vest });
	const steel = new THREE.MeshLambertMaterial({ color: p.steelDeep });
	const dark = new THREE.MeshLambertMaterial({ color: p.ink });
	const group = new THREE.Group();
	const box = (w: number, h: number, l: number, mat: THREE.Material, x: number, y: number, z: number) => {
		const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), mat);
		m.position.set(x, y, z);
		group.add(m);
		return m;
	};
	// the truck faces +z: forks in front
	box(1.1, 0.7, 1.9, body, 0, 0.65, 0);
	box(1.1, 0.5, 0.5, body, 0, 1.15, -0.65); // counterweight
	for (const x of [-0.5, 0.5]) {
		box(0.08, 1.2, 0.08, steel, x, 1.6, 0.55);
		box(0.08, 1.2, 0.08, steel, x, 1.6, -0.35);
	}
	box(1.1, 0.06, 1.0, steel, 0, 2.2, 0.1); // overhead guard
	for (const x of [-0.42, 0.42]) box(0.1, 2.3, 0.1, steel, x, 1.25, 1.0); // mast
	const carriage = new THREE.Group();
	group.add(carriage);
	for (const x of [-0.3, 0.3]) {
		const fork = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 1.0), steel);
		fork.position.set(x, 0, 1.55);
		carriage.add(fork);
	}
	for (const [x, z] of [[-0.56, 0.6], [0.56, 0.6], [-0.56, -0.6], [0.56, -0.6]]) {
		const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 14), dark);
		wheel.rotation.z = Math.PI / 2;
		wheel.position.set(x, 0.28, z);
		group.add(wheel);
	}
	let t = Math.random() * 10;
	return {
		group,
		/** The forks rise and fall now and then, as if stacking. */
		animate(dt: number) {
			t += dt;
			carriage.position.y = 0.25 + Math.max(0, Math.sin(t * 0.6)) * 1.2;
		},
		recolour(next: Palette) {
			body.color.copy(next.vest);
			steel.color.copy(next.steelDeep);
			dark.color.copy(next.ink);
		},
	};
}
