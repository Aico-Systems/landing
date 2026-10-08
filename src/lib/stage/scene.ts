import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { colourFor, type Palette } from "./palette";

/**
 * One vertical's scene (static/models, built and exported by
 * tools/blender/export.py), restyled like the film: matte surfaces under a
 * soft light, and faint outlines of a constant pixel width — the film's
 * Freestyle lines, which glTF does not carry: every mesh's creases
 * (EdgesGeometry) as fat lines, one shared material.
 */
export interface LoadedScene {
	root: THREE.Group;
	/** The scene's top-level pieces, in the film's names: what assembles. */
	pieces: THREE.Object3D[];
	lines: LineMaterial;
	recolour(p: Palette): void;
}

/** Edges sharper than this many degrees are drawn (the film's crease angle). */
const CREASE_DEG = 50;

// every scene file is fetched once: switching back to a vertical is instant
THREE.Cache.enabled = true;

export const gltf = new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath("/draco/"));

/** A matte material for a film role, recoloured with the palette. */
export function roleMaterial(role: string, p: Palette): THREE.MeshLambertMaterial {
	const mat = new THREE.MeshLambertMaterial({ color: colourFor(role, p) });
	mat.userData.role = role;
	// the outlines win over coplanar faces
	mat.polygonOffset = true;
	mat.polygonOffsetFactor = 1;
	mat.polygonOffsetUnits = 1;
	return mat;
}

export async function loadScene(url: string, p: Palette): Promise<LoadedScene> {
	const set = (await gltf.loadAsync(url)).scene;
	const root = new THREE.Group();
	root.add(set);

	const materials = new Map<string, THREE.MeshLambertMaterial>();
	const lines = new LineMaterial({ color: p.ink, linewidth: 0.8, transparent: true, opacity: 0.55 });
	// collected first: an outline (LineSegments2) is itself a mesh, and adding
	// it during the walk had the walk outline the outlines, without end
	const meshes: THREE.Mesh[] = [];
	set.traverse((o) => {
		if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
	});
	for (const m of meshes) {
		const role = (Array.isArray(m.material) ? m.material[0] : m.material).name;
		if (!materials.has(role)) materials.set(role, roleMaterial(role, p));
		m.material = materials.get(role)!;
		// each piece carries its own outline, so it can fly in with it
		const edges = new THREE.EdgesGeometry(m.geometry, CREASE_DEG);
		const outline = new LineSegments2(
			new LineSegmentsGeometry().setPositions(edges.attributes.position.array as Float32Array),
			lines,
		);
		edges.dispose();
		m.add(outline);
	}

	return {
		root,
		pieces: [...set.children],
		lines,
		recolour(next: Palette) {
			for (const mat of materials.values()) mat.color.copy(colourFor(mat.userData.role, next));
			lines.color.copy(next.ink);
		},
	};
}
