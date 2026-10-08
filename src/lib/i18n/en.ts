import type { Messages } from "./types";

export const en: Messages = {
	site: {
		title: "Mandy",
		description:
			"Mandy answers warehouse and factory workers in their own language. They press the glove, ask, and keep working.",
		brand: "Mandy",
		tagline: "Press once and ask, in your own language.",
		demo: "Book a demo",
	},
	home: {
		stage: (vertical) => `${vertical}: people at work, asking Mandy as they go`,
		industries: "Industries",
		askedIn: (language) => `Asked in ${language}`,
		verbs: { know: "Know", act: "Act", talk: "Talk", record: "Record", learn: "Learn" },
		verticals: {
			warehouse: {
				name: "Warehouse",
				headline: ["Answers at the rack,", "in every language."],
				does: [
					{ verb: "learn", text: "Each client's process, from day one." },
					{ verb: "know", text: "Packing and labelling rules per client." },
					{ verb: "act", text: "Stock moves booked by voice, read back." },
				],
				gain: "Productive from the first shift.",
				voices: {
					picker: [
						{ ask: "How does client B want this pallet labelled?", answer: "Two labels on opposite sides, max height 1.8 m.", lang: "uk" },
						{ ask: "Refill B14, two cartons.", answer: "Booked: two cartons to B14, due at 10:40." },
					],
					receiver: [{ ask: "Pallet 4 is damaged, two cartons crushed.", answer: "Photo filed and your team lead told.", lang: "ro" }],
					replenisher: [{ ask: "Move the rest of this pallet to zone C.", answer: "Transfer to C-03 posted. Scan the slot to confirm." }],
					driver: [{ ask: "Near miss at dock 3, a forklift came round blind.", answer: "Logged with time and place. Safety has it." }],
				},
			},
			manufacturing: {
				name: "Manufacturing",
				headline: ["Keep the line moving", "when parts run short."],
				does: [
					{ verb: "talk", text: "Part shortages go straight to logistics." },
					{ verb: "know", text: "Fault codes and changeover steps." },
					{ verb: "record", text: "Shift handovers spoken once, translated." },
				],
				gain: "Fewer line stops, and supervisors cover more of the floor.",
				voices: {
					lineA: [
						{ ask: "Kitting is down to three cable harnesses.", answer: "Logistics has the part number. Tugger due in 8 min." },
						{ ask: "Nutrunner shows error E-47.", answer: "The socket isn't seated. Reseat it and re-torque bolt 3." },
					],
					lineB: [{ ask: "Note for the next shift: the labeller skips.", answer: "Added to the handover, in German and Polish.", lang: "pl" }],
					tugger: [{ ask: "Which station needs material next?", answer: "Line B, station 5: door clips, in 12 minutes." }],
				},
			},
			parcel: {
				name: "Parcel",
				headline: ["Exceptions sorted at the sorter,", "trucks out full."],
				does: [
					{ verb: "know", text: "Oversize, damaged, unlabelled: what to do." },
					{ verb: "talk", text: "Sort and loading teams on one channel." },
					{ verb: "act", text: "Broken belts reported with spot and photo." },
				],
				gain: "Fuller trucks and a clear floor at shift end.",
				voices: {
					sorter: [
						{ ask: "This parcel has no label.", answer: "Take it to the exceptions bench. Scan and photo are logged." },
						{ ask: "The cage at chute 9 is full.", answer: "Swap requested. An empty cage is on its way." },
					],
					packer: [{ ask: "Anything left for the 8 p.m. route?", answer: "Two cages upstairs. Packing is sending them down.", lang: "de" }],
					driver: [{ ask: "Door 3 won't close.", answer: "Maintenance ticket opened with the door and a photo." }],
				},
			},
			ecommerce: {
				name: "eCommerce",
				headline: ["Seasonal staff,", "productive in the first hour."],
				does: [
					{ verb: "learn", text: "New pickers get answers at the station." },
					{ verb: "know", text: "Carton and packaging rules per product." },
					{ verb: "record", text: "Rework and cleaning logged as they happen." },
				],
				gain: "Peak teams up to speed in hours.",
				voices: {
					newcomer: [
						{ ask: "First day here. How do I pack glass?", answer: "Wrap it twice, use carton M and a fragile label.", lang: "bg" },
						{ ask: "Starting decant in aisle 7.", answer: "Logged at 14:02, aisle 7." },
					],
					packer: [{ ask: "Which carton for order 8840?", answer: "Size M with padding. One item is glass." }],
					picker: [{ ask: "Tote 118 is one item short.", answer: "Reported. A replacement pick is queued." }],
					driver: [{ ask: "Where am I needed for the 3 p.m. wave?", answer: "Pack station 4. Its packer is going on break." }],
				},
			},
			grocery: {
				name: "Grocery",
				headline: ["Full shelves and complete orders,", "run from the aisle."],
				does: [
					{ verb: "act", text: "Empty shelf spotted, refill ordered." },
					{ verb: "know", text: "Substitutions and order status mid-pick." },
					{ verb: "record", text: "Fridge temperatures, time-stamped." },
				],
				gain: "Fewer gaps on the shelves and in orders.",
				voices: {
					shelves: [
						{ ask: "The oat drink shelf is almost empty.", answer: "Two cases ordered. They're in the backroom." },
						{ ask: "Pasta 500 g is out of stock.", answer: "Substitute approved: wholewheat, same size." },
					],
					fridges: [{ ask: "Fridge six is at seven degrees.", answer: "Logged. Move the yogurt to the backroom chiller.", lang: "tr" }],
					floor: [{ ask: "Spill in aisle 3.", answer: "Cleaning is on it. Please put out the warning sign." }],
				},
			},
			fashion: {
				name: "Fashion",
				headline: ["Returns graded the same way,", "back on sale sooner."],
				does: [
					{ verb: "know", text: "Grading rules per brand and material." },
					{ verb: "record", text: "Damage photos attached to the return." },
					{ verb: "learn", text: "Buying sees which defects keep coming back." },
				],
				gain: "More resale value recovered on every shift.",
				voices: {
					grader: [
						{ ask: "Seam is split. Resell or repair?", answer: "Repair. It costs less than two euros." },
						{ ask: "Stain on the sleeve, taking a photo.", answer: "Attached to the return. Grade C, outlet." },
					],
					checker: [{ ask: "How do I check this label is genuine?", answer: "Look at the stitching, care label and tag code.", lang: "vi" }],
					returns: [{ ask: "This return has no label.", answer: "Matched by the order slip and logged." }],
				},
			},
			pharma: {
				name: "Pharma",
				headline: ["GMP documentation,", "hands-free."],
				does: [
					{ verb: "record", text: "Every step logged: who, when, where." },
					{ verb: "know", text: "Lot status and the SOP for each step." },
					{ verb: "talk", text: "Deviations reach QA at once." },
				],
				gain: "Audit-ready without a keyboard.",
				voices: {
					picker: [
						{ ask: "Is lot 24-117 released?", answer: "Not yet. QA releases it at 2 p.m." },
						{ ask: "Start the cold-chain checklist.", answer: "Step 1: is the data logger attached and running?" },
					],
					verifier: [{ ask: "This serial number won't verify.", answer: "Quarantine the unit. QA has it." }],
					coldRoom: [{ ask: "The cold room door was open for five minutes.", answer: "Deviation logged with the time. QA has it.", lang: "pl" }],
				},
			},
			aviation: {
				name: "Aviation",
				headline: ["More time on the aircraft,", "less on paperwork."],
				does: [
					{ verb: "know", text: "Task cards and torque values, hands-free." },
					{ verb: "record", text: "Defects logged with photo and position." },
					{ verb: "talk", text: "Ramp, catering and maintenance in sync." },
				],
				gain: "Turnarounds stay on time.",
				voices: {
					ramp: [{ ask: "Cart 3 has a bag without a tag.", answer: "Photo filed. Baggage services know." }],
					mechanic: [
						{ ask: "Torque value for the fan cowl latch?", answer: "12 Nm, per the task card. Logged." },
						{ ask: "Hydraulic leak at the left main gear.", answer: "Defect reported with a photo. Maintenance is on the way." },
					],
					tug: [{ ask: "Is stand 14 clear for pushback?", answer: "Not yet. Catering clears the aft door in 2 minutes." }],
				},
			},
		},
	},
};
