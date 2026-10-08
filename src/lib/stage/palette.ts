import * as THREE from "three";
import colours from "./colours.json";

/**
 * The scene's colours, read from blueprint's tokens at runtime: page and
 * scene are one palette, and the dark theme recolours both. Which token fills
 * which slot, and which slot each of the film's material roles (FLAT_paper,
 * FLAT_ink, …) takes, is colours.json — shared with the Blender preview.
 */
export type Slot = keyof typeof colours.themes.light;
export type Palette = Record<Slot, THREE.Color>;

function token(name: string): THREE.Color {
	const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return new THREE.Color(raw || "#888");
}

export function readPalette(): Palette {
	const theme = document.documentElement.classList.contains("aico-dark") ? colours.themes.dark : colours.themes.light;
	return Object.fromEntries(Object.entries(theme).map(([slot, name]) => [slot, token(name)])) as Palette;
}

/** A film material role (by material name) to its colour in this palette. */
export function colourFor(material: string, p: Palette): THREE.Color {
	const role = material.replace(/^FLAT_/, "").replace(/\.\d+$/, "") as keyof typeof colours.roles;
	return p[(colours.roles[role] ?? "steel") as Slot];
}
