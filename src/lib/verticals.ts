/**
 * The industries the page shows, one live scene each: what moves where. A
 * new vertical is an entry here, its scene file in static/models, and its
 * words in every locale (src/lib/i18n), which the compiler then asks for.
 * Nothing here is text a visitor reads.
 *
 * Positions are metres on the scene's floor: x along the aisles, z across
 * them, the scene's origin in the middle of the hall.
 */
export type VerticalId =
	| "warehouse"
	| "manufacturing"
	| "parcel"
	| "ecommerce"
	| "grocery"
	| "fashion"
	| "pharma"
	| "aviation";

export interface Actor {
	kind: "worker" | "forklift";
	/** The loop it travels, as floor points; it walks or drives them in order. */
	route: [number, number][];
	/** Metres per second. */
	speed: number;
	/** Where along the loop it starts, 0..1. */
	offset?: number;
	/** Who it is when it talks to Mandy: the key of its exchanges in the
	 *  vertical's words (i18n). Silent without one. */
	voice?: string;
}

export interface Vertical {
	id: VerticalId;
	scene: string;
	/** Metres of the scene across the shorter screen side. */
	span: number;
	actors: Actor[];
}

/** The warehouse's three aisles run along x at these z. */
const AISLES = [0, -5.4, 5.4];
/** The plant's walkways beside its two lines, and the tugger lane between them. */
const PLANT = { lineA: 5.2, lineB: -4.2, tugger: 0.5 };
const loop = (z: number, from: number, to: number): [number, number][] => [
	[from, z],
	[to, z],
];

export const VERTICALS: Vertical[] = [
	{
		id: "warehouse",
		scene: "/models/warehouse.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: loop(AISLES[0] + 0.7, -16, 14),
				speed: 1.3,
				voice: "picker",
			},
			{
				kind: "worker",
				route: loop(AISLES[1] - 0.7, 12, -15),
				speed: 1.1,
				offset: 0.3,
				voice: "receiver",
			},
			{
				kind: "worker",
				route: loop(AISLES[2] + 0.7, -14, 10),
				speed: 1.2,
				offset: 0.6,
				voice: "replenisher",
			},
			{
				kind: "forklift",
				route: loop(AISLES[1] + 0.9, -18, 17),
				speed: 3.2,
				offset: 0.1,
				voice: "driver",
			},
			{
				kind: "forklift",
				route: loop(AISLES[2] - 0.9, 16, -17),
				speed: 2.8,
				offset: 0.55,
			},
		],
	},
	{
		id: "manufacturing",
		scene: "/models/automotive.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: loop(PLANT.lineA, -14, 12),
				speed: 1.0,
				voice: "lineA",
			},
			{
				kind: "worker",
				route: loop(PLANT.lineB, 13, -12),
				speed: 1.1,
				offset: 0.4,
				voice: "lineB",
			},
			{
				kind: "forklift",
				route: loop(PLANT.tugger, -19, 19),
				speed: 2.6,
				offset: 0.2,
				voice: "tugger",
			},
		],
	},
	{
		id: "parcel",
		scene: "/models/parcel.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-18, -0.4], [16, -0.4]],
				speed: 1.2,
				voice: "sorter",
			},
			{
				kind: "worker",
				route: [[16, -11.3], [-11, -11.3]],
				speed: 1.1,
				offset: 0.4,
				voice: "packer",
			},
			{
				kind: "forklift",
				route: [[-20, 8.2], [19, 8.2]],
				speed: 2.8,
				offset: 0.15,
				voice: "driver",
			},
			{
				kind: "worker",
				route: [[18, 9.2], [-18, 9.2]],
				speed: 1.3,
				offset: 0.7,
			},
		],
	},
	{
		id: "ecommerce",
		scene: "/models/ecommerce.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-19, -8.6], [13, -8.6]],
				speed: 1.2,
				voice: "newcomer",
			},
			{
				kind: "worker",
				route: [[-16, 3.2], [16, 3.2]],
				speed: 1.0,
				offset: 0.35,
				voice: "packer",
			},
			{
				kind: "worker",
				route: [[14, 7.0], [-16, 7.0]],
				speed: 1.1,
				offset: 0.6,
				voice: "picker",
			},
			{
				kind: "forklift",
				route: [[-18, -1.3], [18, -1.3]],
				speed: 2.6,
				offset: 0.15,
				voice: "driver",
			},
		],
	},
	{
		id: "grocery",
		scene: "/models/grocery.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-11, -0.8], [10, -0.8]],
				speed: 1.2,
				voice: "shelves",
			},
			{
				kind: "worker",
				route: [[10, -6.3], [-11, -6.3]],
				speed: 1.1,
				offset: 0.35,
				voice: "fridges",
			},
			{
				kind: "worker",
				route: [[-12, 8.4], [12, 8.4]],
				speed: 1.3,
				offset: 0.6,
				voice: "floor",
			},
			{
				kind: "worker",
				route: [[11, 3.8], [-10, 3.8]],
				speed: 1.2,
				offset: 0.15,
			},
			{
				kind: "forklift",
				route: [[-14, -13.5], [18, -13.5]],
				speed: 2.6,
				offset: 0.2,
			},
		],
	},
	{
		id: "fashion",
		scene: "/models/fashion.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-14, 1.8], [16, 1.8]],
				speed: 1.0,
				voice: "grader",
			},
			{
				kind: "worker",
				route: [[18, -9.6], [-15, -9.6]],
				speed: 1.2,
				offset: 0.4,
				voice: "checker",
			},
			{
				kind: "worker",
				route: [[4, 7.2], [18, 7.2]],
				speed: 1.1,
				offset: 0.2,
				voice: "returns",
			},
			{
				kind: "worker",
				route: [[-16, -4.4], [18, -4.4]],
				speed: 1.3,
				offset: 0.7,
			},
			{
				kind: "forklift",
				route: [[-14, 4.6], [18, 4.6]],
				speed: 2.6,
				offset: 0.1,
			},
		],
	},
	{
		id: "pharma",
		scene: "/models/pharma.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-19, -6.0], [16, -6.0]],
				speed: 1.1,
				voice: "picker",
			},
			{
				kind: "worker",
				route: [[-18, -0.6], [17, -0.6]],
				speed: 1.3,
				offset: 0.4,
				voice: "verifier",
			},
			{
				kind: "worker",
				route: [[-15, 11.4], [-2, 11.4]],
				speed: 0.9,
				offset: 0.2,
				voice: "coldRoom",
			},
			{
				kind: "forklift",
				route: [[-18, 6.0], [18, 6.0]],
				speed: 2.6,
				offset: 0.6,
			},
		],
	},
	{
		id: "aviation",
		scene: "/models/aviation.glb",
		span: 48,
		actors: [
			{
				kind: "worker",
				route: [[-16, 13], [16, 13]],
				speed: 1.3,
				voice: "ramp",
			},
			{
				kind: "worker",
				route: [[4, -10.5], [-20, -10.5]],
				speed: 1.1,
				offset: 0.4,
				voice: "mechanic",
			},
			{
				kind: "forklift",
				route: [[-22, 15.5], [22, 15.5]],
				speed: 3.0,
				offset: 0.2,
				voice: "tug",
			},
			{
				kind: "forklift",
				route: [[20, -7], [-20, -7]],
				speed: 2.6,
				offset: 0.6,
			},
		],
	},
];
