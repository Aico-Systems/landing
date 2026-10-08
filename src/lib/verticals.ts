/**
 * The industries the page shows, one live scene each. A new vertical is a
 * new entry here (and its scene file in static/models), not new page code.
 *
 * Positions are metres on the scene's floor: x along the aisles, z across
 * them, the scene's origin in the middle of the hall.
 */
export interface Exchange {
	/** What the person asks, out loud. */
	ask: string;
	/** What Mandy answers. */
	answer: string;
	/** The language it was asked (and answered) in, when not the page's:
	 *  shown, because translation runs through everything Mandy does. */
	lang?: string;
}

/** The five things Mandy does on the floor (the pitch deck's own words). */
export type Verb = "know" | "act" | "talk" | "record" | "learn";

export interface Actor {
	kind: "worker" | "forklift";
	/** The loop it travels, as floor points; it walks or drives them in order. */
	route: [number, number][];
	/** Metres per second. */
	speed: number;
	/** Where along the loop it starts, 0..1. */
	offset?: number;
	/** What it asks Mandy, in turn. */
	asks?: Exchange[];
}

export interface Vertical {
	id: string;
	name: string;
	/** What Mandy changes here, in two lines, broken where the thought breaks. */
	headline: [string, string];
	/** Three things Mandy does in this vertical, each under one of its verbs;
	 *  each a single line on a wide screen (about 42 characters at most). */
	does: { verb: Verb; text: string }[];
	/** What the customer gains: one short line. */
	gain: string;
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
		name: "Warehouse",
		headline: ["Answers at the rack,", "in every language."],
		does: [
			{ verb: "learn", text: "Each client's process, from day one." },
			{ verb: "know", text: "Packing and labelling rules per client." },
			{ verb: "act", text: "Stock moves booked by voice, read back." },
		],
		gain: "Productive from the first shift.",
		scene: "/models/warehouse.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: loop(AISLES[0] + 0.7, -16, 14),
				speed: 1.3,
				asks: [
					{ ask: "How does client B want this pallet labelled?", answer: "Two labels on opposite sides, max height 1.8 m.", lang: "Ukrainian" },
					{ ask: "Refill B14, two cartons.", answer: "Booked: two cartons to B14, due at 10:40." },
				],
			},
			{
				kind: "worker",
				route: loop(AISLES[1] - 0.7, 12, -15),
				speed: 1.1,
				offset: 0.3,
				asks: [
					{ ask: "Pallet 4 is damaged, two cartons crushed.", answer: "Photo filed and your team lead notified.", lang: "Romanian" },
				],
			},
			{
				kind: "worker",
				route: loop(AISLES[2] + 0.7, -14, 10),
				speed: 1.2,
				offset: 0.6,
				asks: [
					{ ask: "Move the rest of this pallet to zone C.", answer: "Transfer to C-03 posted. Scan the slot to confirm." },
				],
			},
			{
				kind: "forklift",
				route: loop(AISLES[1] + 0.9, -18, 17),
				speed: 3.2,
				offset: 0.1,
				asks: [
					{ ask: "Near miss at dock 3, a forklift came round blind.", answer: "Logged with time and location. Safety has been notified." },
				],
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
		name: "Manufacturing",
		headline: ["Keep the line moving", "when parts run short."],
		does: [
			{ verb: "talk", text: "Part shortages straight to logistics." },
			{ verb: "know", text: "Fault codes and changeover steps." },
			{ verb: "record", text: "Shift handovers spoken once, translated." },
		],
		gain: "Fewer line stops. Supervisors cover more.",
		scene: "/models/automotive.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: loop(PLANT.lineA, -14, 12),
				speed: 1.0,
				asks: [
					{ ask: "Kitting is down to three cable harnesses.", answer: "Logistics notified with the part number. Tugger due in 8 min." },
					{ ask: "Nutrunner shows error E-47.", answer: "Socket not seated. Reseat it and re-torque bolt 3." },
				],
			},
			{
				kind: "worker",
				route: loop(PLANT.lineB, 13, -12),
				speed: 1.1,
				offset: 0.4,
				asks: [
					{ ask: "Note for the next shift: the labeller skips.", answer: "Added to the handover, in German and Polish.", lang: "Polish" },
				],
			},
			{
				kind: "forklift",
				route: loop(PLANT.tugger, -19, 19),
				speed: 2.6,
				offset: 0.2,
				asks: [
					{ ask: "Which station needs material next?", answer: "Line B, station 5: door clips, in 12 minutes." },
				],
			},
		],
	},
	{
		id: "parcel",
		name: "Parcel",
		headline: ["Exceptions solved at the sorter,", "trucks out full."],
		does: [
			{ verb: "know", text: "Oversize, damaged, unlabelled: what to do." },
			{ verb: "talk", text: "Sort and loading teams on one channel." },
			{ verb: "act", text: "Faulty belts reported with spot and photo." },
		],
		gain: "Fuller trucks, a clear floor at shift end.",
		scene: "/models/parcel.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-18, -0.4], [16, -0.4]],
				speed: 1.2,
				asks: [
					{ ask: "This parcel has no label.", answer: "Take it to the exceptions bench. Scan and photo are logged." },
					{ ask: "The cage at chute 9 is full.", answer: "Swap requested. An empty cage is on its way." },
				],
			},
			{
				kind: "worker",
				route: [[16, -11.3], [-11, -11.3]],
				speed: 1.1,
				offset: 0.4,
				asks: [
					{ ask: "Anything left for the 8 p.m. route?", answer: "Two cages upstairs. Packing is sending them down.", lang: "German" },
				],
			},
			{
				kind: "forklift",
				route: [[-20, 8.2], [19, 8.2]],
				speed: 2.8,
				offset: 0.15,
				asks: [
					{ ask: "Door 3 won't close.", answer: "Maintenance ticket opened with location and photo." },
				],
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
		name: "eCommerce",
		headline: ["Seasonal staff,", "productive in the first hour."],
		does: [
			{ verb: "learn", text: "New pickers ask instead of guessing." },
			{ verb: "know", text: "Carton and packaging rules per product." },
			{ verb: "record", text: "Rework and cleaning logged as it happens." },
		],
		gain: "Peak teams up to speed in hours.",
		scene: "/models/ecommerce.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-19, -8.6], [13, -8.6]],
				speed: 1.2,
				asks: [
					{ ask: "First day here. How do I pack glass?", answer: "Wrap it twice, use carton M and a fragile label.", lang: "Bulgarian" },
					{ ask: "Starting decant in aisle 7.", answer: "Logged at 14:02, aisle 7." },
				],
			},
			{
				kind: "worker",
				route: [[-16, 3.2], [16, 3.2]],
				speed: 1.0,
				offset: 0.35,
				asks: [
					{ ask: "Which carton for order 8840?", answer: "Size M with padding. One item is glass." },
				],
			},
			{
				kind: "worker",
				route: [[14, 7.0], [-16, 7.0]],
				speed: 1.1,
				offset: 0.6,
				asks: [
					{ ask: "Tote 118 is one item short.", answer: "Reported. A replacement pick is queued." },
				],
			},
			{
				kind: "forklift",
				route: [[-18, -1.3], [18, -1.3]],
				speed: 2.6,
				offset: 0.15,
				asks: [
					{ ask: "Where am I needed for the 3 p.m. wave?", answer: "Pack station 4. Its packer is starting a break." },
				],
			},
		],
	},
	{
		id: "grocery",
		name: "Grocery",
		headline: ["Full shelves, complete orders,", "managed from the aisle."],
		does: [
			{ verb: "act", text: "Empty shelf spotted, refill ordered." },
			{ verb: "know", text: "Substitutions and order status mid-pick." },
			{ verb: "record", text: "Fridge temperatures, time-stamped." },
		],
		gain: "Fewer gaps on shelves and in orders.",
		scene: "/models/grocery.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-11, -0.8], [10, -0.8]],
				speed: 1.2,
				asks: [
					{ ask: "The oat drink shelf is almost empty.", answer: "Refill ordered, two cases. They're in the backroom." },
					{ ask: "Pasta 500 g is out of stock.", answer: "Substitution approved: wholewheat, same size." },
				],
			},
			{
				kind: "worker",
				route: [[10, -6.3], [-11, -6.3]],
				speed: 1.1,
				offset: 0.35,
				asks: [
					{ ask: "Fridge six is at seven degrees.", answer: "Logged. Move the yogurt to the backroom chiller.", lang: "Turkish" },
				],
			},
			{
				kind: "worker",
				route: [[-12, 8.4], [12, 8.4]],
				speed: 1.3,
				offset: 0.6,
				asks: [
					{ ask: "Spill in aisle 3.", answer: "Cleaning notified. Please set up the warning sign." },
				],
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
		name: "Fashion",
		headline: ["Returns graded the same,", "back on sale faster."],
		does: [
			{ verb: "know", text: "Grading rules per brand and material." },
			{ verb: "record", text: "Damage photographed onto the return." },
			{ verb: "learn", text: "Recurring defects surface to buying." },
		],
		gain: "More resale value recovered, every shift.",
		scene: "/models/fashion.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-14, 1.8], [16, 1.8]],
				speed: 1.0,
				asks: [
					{ ask: "Seam is split. Resell or repair?", answer: "Repair: it is under the two-euro threshold." },
					{ ask: "Stain on the sleeve, taking a photo.", answer: "Attached to the return. Grade C, outlet." },
				],
			},
			{
				kind: "worker",
				route: [[18, -9.6], [-15, -9.6]],
				speed: 1.2,
				offset: 0.4,
				asks: [
					{ ask: "How do I check this label is genuine?", answer: "Check stitching, care label and tag code.", lang: "Vietnamese" },
				],
			},
			{
				kind: "worker",
				route: [[4, 7.2], [18, 7.2]],
				speed: 1.1,
				offset: 0.2,
				asks: [
					{ ask: "This return has no label.", answer: "Matched by the order slip and logged." },
				],
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
		name: "Pharma",
		headline: ["GMP documentation,", "hands-free."],
		does: [
			{ verb: "record", text: "Every step logged: who, when, where." },
			{ verb: "know", text: "Lot status and SOPs, never guessed." },
			{ verb: "talk", text: "Deviations reach QA at once." },
		],
		gain: "Audit-ready without a keyboard.",
		scene: "/models/pharma.glb",
		span: 46,
		actors: [
			{
				kind: "worker",
				route: [[-19, -6.0], [16, -6.0]],
				speed: 1.1,
				asks: [
					{ ask: "Is lot 24-117 released?", answer: "Not yet. QA release is scheduled for 2 p.m." },
					{ ask: "Start the cold-chain checklist.", answer: "Step 1: is the data logger attached and running?" },
				],
			},
			{
				kind: "worker",
				route: [[-18, -0.6], [17, -0.6]],
				speed: 1.3,
				offset: 0.4,
				asks: [
					{ ask: "This serial number won't verify.", answer: "Quarantine the unit. QA has been flagged." },
				],
			},
			{
				kind: "worker",
				route: [[-15, 11.4], [-2, 11.4]],
				speed: 0.9,
				offset: 0.2,
				asks: [
					{ ask: "The cold room door was open for five minutes.", answer: "Deviation logged with timestamp. QA notified.", lang: "Polish" },
				],
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
		name: "Aviation",
		headline: ["More time on the aircraft,", "less on paperwork."],
		does: [
			{ verb: "know", text: "Task cards and torque values, hands-free." },
			{ verb: "record", text: "Defects logged with photo and position." },
			{ verb: "talk", text: "Ramp, catering and maintenance in sync." },
		],
		gain: "Turnarounds that stay on time.",
		scene: "/models/aviation.glb",
		span: 48,
		actors: [
			{
				kind: "worker",
				route: [[-16, 13], [16, 13]],
				speed: 1.3,
				asks: [
					{ ask: "Cart 3 has a bag without a tag.", answer: "Photo filed. Baggage services notified." },
				],
			},
			{
				kind: "worker",
				route: [[4, -10.5], [-20, -10.5]],
				speed: 1.1,
				offset: 0.4,
				asks: [
					{ ask: "Torque value for the fan cowl latch?", answer: "12 Nm per the task card. Logged." },
					{ ask: "Hydraulic leak at the left main gear.", answer: "Defect reported with photo. Maintenance is on its way." },
				],
			},
			{
				kind: "forklift",
				route: [[-22, 15.5], [22, 15.5]],
				speed: 3.0,
				offset: 0.2,
				asks: [
					{ ask: "Is stand 14 clear for pushback?", answer: "Not yet. Catering clears the aft door in 2 minutes." },
				],
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
