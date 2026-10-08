import type { Messages } from "./types";

export const en: Messages = {
	site: {
		brand: "Mandy",
		tagline: "Press once and ask, in your own language.",
		demo: "Book a demo",
		updated: (date) => `Updated ${date}`,
		seo: {
			title: "Voice AI assistant for shop floor workers",
			description:
				"Mandy is a voice assistant on the ProGlove MAI glove. Warehouse and factory workers press once, ask in their own language and get answers from your SOPs and systems.",
		},
		language: "English",
	},
	gateway: {
		intro:
			"Mandy is a voice assistant for warehouse and factory workers. Workers press the MAI glove once, ask in their own language, and Mandy answers from the site's own documents and systems.",
		enter: "Read on in English",
	},
	home: {
		stage: (vertical) => `${vertical}: people at work, asking Mandy as they go`,
		industries: "Industries",
		askedIn: (language) => `Asked in ${language}`,
		about: "What is Mandy?",
		replay: "Play again",
		close: "Close",
		heardIn: (language) => `Said in ${language}`,
		verbs: { know: "Know", act: "Act", talk: "Talk", record: "Record", learn: "Learn" },
		mandy: {
			question: "What is Mandy?",
			answer: "Mandy is a voice assistant for warehouse and factory workers. Press the glove once, ask in any language, and get the answer from your own SOPs and systems.",
			why: { heading: "Why do exceptions cost so much?", text: "A missing part or an unclear step costs a worker 3 to 15 minutes, three to five times a shift. The answer is often written down somewhere. Nobody on the floor has time to look it up." },
			flow: {
				heading: "Which languages does Mandy speak?",
				steps: [
					{ who: "Worker", text: "Says it in Ukrainian, hands still on the pallet." },
					{ who: "Mandy", text: "Translates it and adds the scan, the station and a photo." },
					{ who: "Team lead", text: "Reads it in German in Teams and taps a reply." },
					{ who: "Worker", text: "Hears the reply in Ukrainian." },
				],
			},
			verbs: {
				heading: "What can Mandy do?",
				items: {
					know: { text: "Answers from your SOPs and systems, and says when it doesn't know.", says: "How do I pack the returns for route 12?" },
					act: { text: "Books refills, stock moves and tickets, and reads each one back first.", says: "Refill B14, two boxes." },
					talk: { text: "Gets the message to the right person, translated.", says: "Kitting needs cable harnesses, three left." },
					record: { text: "Logs tasks, photos and near misses with time and place.", says: "Starting decant, aisle 7." },
					learn: { text: "Coaches new staff and shows where the floor gets stuck.", says: "First day here. Where do the empty totes go?" },
				},
			},
			systems: {
				heading: "What does it connect to?",
				text: "Mandy reads from what you already have and writes back to it. There is nothing new to buy.",
				groups: [
					{ name: "Your documents", items: "SharePoint, SOPs, manuals, packing rules" },
					{ name: "Your systems", items: "SAP, WMS, ServiceNow, Jira, Zendesk" },
					{ name: "Your team", items: "Teams, Slack, WhatsApp, SMS, a phone call" },
				],
			},
			runs: { heading: "Where does it run?", text: "In the EU cloud, on your own servers, or fully offline for plants without internet. It is built for GDPR and security reviews." },
			pilot: {
				heading: "How do we start?",
				steps: [
					{ when: "Week 0", what: "Pick one use case and 5 to 12 workers." },
					{ when: "Week 1", what: "We load your SOPs and connect your systems." },
					{ when: "Weeks 2\u201313", what: "Your team uses Mandy every day." },
					{ when: "Week 14", what: "You get the time saved, measured." },
				],
			},
			faq: {
				heading: "Questions we often get",
				items: [
					{ q: "Does Mandy work without internet?", a: "Yes. It runs on your own servers or fully offline." },
					{ q: "Is voice always the right interface?", a: "No. Requests that come up often become one-tap buttons on the glove." },
					{ q: "How is this different from pick-by-voice?", a: "Pick-by-voice follows a fixed script. Mandy answers open questions and books things in your systems." },
					{ q: "What if Mandy doesn't know?", a: "It says so, and brings in a person when the standard procedure doesn't cover the case." },
				],
			},
		},
		verticals: {
			warehouse: {
				name: "Warehouse",
				slug: "warehouse",
				seo: {
					title: "Voice AI for warehouse and 3PL workers",
					description: "Mandy answers warehouse workers at the rack in their own language: client packing rules, refills and stock moves by voice, on the ProGlove MAI glove.",
				},
				headline: ["Answers at the rack,", "in every language."],
				does: [
					{ verb: "learn", text: "Each client's process, from day one." },
					{ verb: "know", text: "Packing and labelling rules per client." },
					{ verb: "act", text: "Stock moves booked by voice, read back." },
				],
				gain: "Productive from the first shift.",
				card: {
					question: "How does Mandy help in a warehouse?",
					answer: "Every client has its own packing and labelling rules, and half the crew is new. Mandy answers at the rack, in each worker's language.",
					story: {
						meaning: "How does client B want this pallet labelled?",
						answer: "Two labels on opposite sides, max height 1.8 m.",
						lands: "Answered from client B's SOP",
					},
					result: "Fewer walks to the office.",
				},
				voices: {
					picker: [
						{ ask: "How does client B want this pallet labelled?", answer: "Two labels on opposite sides, max height 1.8 m.", lang: "uk" },
						{ ask: "Refill B14, two cartons.", answer: "Booked: two cartons to B14, due at 10:40." },
					],
					receiver: [{ ask: "Pallet 4 is damaged, two cartons crushed.", answer: "Photo filed and your team lead told.", lang: "ro" }],
					replenisher: [{ ask: "Move the rest of this pallet to zone C.", answer: "Transfer to C-03 posted. Scan the slot to confirm." }],
					driver: [{ ask: "Near miss at dock 3, a forklift came round blind.", answer: "Logged with time and place. Safety has it." }],
				},
			},
			manufacturing: {
				name: "Manufacturing",
				slug: "manufacturing",
				seo: {
					title: "Voice AI for production and assembly lines",
					description: "Mandy sends part shortages to logistics with part number and station, explains fault codes and translates shift handovers, hands-free on the line.",
				},
				headline: ["Keep the line moving", "when parts run short."],
				does: [
					{ verb: "talk", text: "Part shortages go straight to logistics." },
					{ verb: "know", text: "Fault codes and changeover steps." },
					{ verb: "record", text: "Shift handovers spoken once, translated." },
				],
				gain: "Fewer line stops, and supervisors cover more of the floor.",
				card: {
					question: "How does Mandy help on a production line?",
					answer: "A missing part stops the station while the supervisor is three areas away. Mandy sends logistics the part number and station in one message.",
					story: {
						meaning: "Kitting is down to three cable harnesses.",
						answer: "Logistics has the part number and your station. Tugger due in 8 min.",
						lands: "Message to logistics, in Teams",
					},
					result: "Fewer line stops.",
				},
				voices: {
					lineA: [
						{ ask: "Kitting is down to three cable harnesses.", answer: "Logistics has the part number. Tugger due in 8 min." },
						{ ask: "Nutrunner shows error E-47.", answer: "The socket isn't seated. Reseat it and re-torque bolt 3." },
					],
					lineB: [{ ask: "Note for the next shift: the labeller skips.", answer: "Added to the handover, in German and Polish.", lang: "pl" }],
					tugger: [{ ask: "Which station needs material next?", answer: "Line B, station 5: door clips, in 12 minutes." }],
				},
			},
			parcel: {
				name: "Parcel",
				slug: "parcel",
				seo: {
					title: "Voice AI for parcel and postal hubs",
					description: "Mandy tells sorters what to do with unlabelled, damaged or oversize parcels and connects sorting and loading teams, so trucks leave full.",
				},
				headline: ["Exceptions sorted at the sorter,", "trucks out full."],
				does: [
					{ verb: "know", text: "Oversize, damaged, unlabelled: what to do." },
					{ verb: "talk", text: "Sort and loading teams on one channel." },
					{ verb: "act", text: "Broken belts reported with spot and photo." },
				],
				gain: "Fuller trucks and a clear floor at shift end.",
				card: {
					question: "How does Mandy help in a parcel hub?",
					answer: "The sorter runs until a parcel has no label. Mandy says what to do with it and logs the scan and a photo.",
					story: {
						meaning: "This parcel has no label.",
						answer: "Take it to the exceptions bench. Scan and photo are logged.",
						lands: "Exception logged with scan and photo",
					},
					result: "Trucks leave full.",
				},
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
				slug: "ecommerce",
				seo: {
					title: "Voice AI for eCommerce fulfilment",
					description: "Seasonal pickers and packers ask Mandy what they would otherwise guess: which carton, how to pack glass, where a short pick goes. In their own language.",
				},
				headline: ["Seasonal staff,", "productive in the first hour."],
				does: [
					{ verb: "learn", text: "New pickers get answers at the station." },
					{ verb: "know", text: "Carton and packaging rules per product." },
					{ verb: "record", text: "Rework and cleaning logged as they happen." },
				],
				gain: "Peak teams up to speed in hours.",
				card: {
					question: "How does Mandy help in eCommerce fulfilment?",
					answer: "Peak season brings hundreds of people who have never seen your site. With Mandy they ask instead of guessing.",
					story: {
						meaning: "First day here. How do I pack glass?",
						answer: "Wrap it twice, use carton M and a fragile label.",
						lands: "Answered from the packaging rules",
					},
					result: "New staff up to speed in hours.",
				},
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
				slug: "grocery",
				seo: {
					title: "Voice AI for grocery stores and dark stores",
					description: "Store staff order refills the moment they see an empty shelf, get substitutions while picking online orders and log fridge temperatures by voice.",
				},
				headline: ["Full shelves and complete orders,", "run from the aisle."],
				does: [
					{ verb: "act", text: "Empty shelf spotted, refill ordered." },
					{ verb: "know", text: "Substitutions and order status mid-pick." },
					{ verb: "record", text: "Fridge temperatures, time-stamped." },
				],
				gain: "Fewer gaps on the shelves and in orders.",
				card: {
					question: "How does Mandy help in grocery retail?",
					answer: "Whoever sees the empty shelf orders the refill, right there. No terminal, no note for later.",
					story: {
						meaning: "The oat drink shelf is almost empty.",
						answer: "Two cases ordered. They're in the backroom.",
						lands: "Refill order in the store system",
					},
					result: "Fewer empty shelves.",
				},
				voices: {
					shelves: [
						{ ask: "The oat drink shelf is almost empty.", answer: "Two cases ordered. They're in the backroom." },
						{ ask: "Pasta 500 g is out of stock.", answer: "Substitute approved: wholewheat, same size." },
					],
					fridges: [{ ask: "Fridge six is at seven degrees.", answer: "Logged. Move the yogurt to the backroom chiller.", lang: "tr" }],
					floor: [{ ask: "Spill in aisle 3.", answer: "Cleaning is on it. Please put out the warning sign." }],
				},
			},
			fashion: {
				name: "Fashion",
				slug: "fashion",
				seo: {
					title: "Voice AI for fashion returns and resale",
					description: "Mandy gives every returns grader the same rules per brand and material, files damage photos with the return and shows buying which defects recur.",
				},
				headline: ["Returns graded the same way,", "back on sale sooner."],
				does: [
					{ verb: "know", text: "Grading rules per brand and material." },
					{ verb: "record", text: "Damage photos attached to the return." },
					{ verb: "learn", text: "Buying sees which defects keep coming back." },
				],
				gain: "More resale value recovered on every shift.",
				card: {
					question: "How does Mandy help with fashion returns?",
					answer: "One grader resells a jacket with a split seam, the next one sends it to repair. Mandy gives everyone the same rules.",
					story: {
						meaning: "Seam is split. Resell or repair?",
						answer: "Repair. It costs less than two euros.",
						lands: "Grade logged with the return",
					},
					result: "The same grade on every shift.",
				},
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
				slug: "pharma",
				seo: {
					title: "Voice AI for GMP pharma warehouses",
					description: "Mandy guides pharma warehouse staff through GMP checklists by voice, logs every step with who, when and where, and reports deviations to QA at once.",
				},
				headline: ["GMP documentation,", "hands-free."],
				does: [
					{ verb: "record", text: "Every step logged: who, when, where." },
					{ verb: "know", text: "Lot status and the SOP for each step." },
					{ verb: "talk", text: "Deviations reach QA at once." },
				],
				gain: "Audit-ready without a keyboard.",
				card: {
					question: "How does Mandy help in a pharma warehouse?",
					answer: "Under GMP every step needs a record. Mandy walks workers through the checklist by voice and logs each step as they go.",
					story: {
						meaning: "The cold room door was open for five minutes.",
						answer: "Deviation logged with the time. QA has it.",
						lands: "Deviation report to QA",
					},
					result: "Audit-ready, without typing.",
				},
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
				slug: "aviation",
				seo: {
					title: "Voice AI for aircraft maintenance and ground handling",
					description: "Mandy reads out task cards and torque values, records defects with photo and position, and lets ramp, catering and maintenance coordinate the turnaround.",
				},
				headline: ["More time on the aircraft,", "less on paperwork."],
				does: [
					{ verb: "know", text: "Task cards and torque values, hands-free." },
					{ verb: "record", text: "Defects logged with photo and position." },
					{ verb: "talk", text: "Ramp, catering and maintenance in sync." },
				],
				gain: "Turnarounds stay on time.",
				card: {
					question: "How does Mandy help in aviation?",
					answer: "Technicians lose a large part of a shift to paperwork. Mandy reads out the task card and logs defects while their hands stay on the aircraft.",
					story: {
						meaning: "Torque value for the fan cowl latch?",
						answer: "12 Nm, per the task card.",
						lands: "Step signed off on the task card",
					},
					result: "Turnarounds stay on time.",
				},
				voices: {
					ramp: [{ ask: "Cart 3 has a bag without a tag.", answer: "Photo filed. Baggage services know." }],
					mechanic: [
						{ ask: "Torque value for the fan cowl latch?", answer: "12 Nm, per the task card. Logged." },
						{ ask: "Hydraulic leak at the left main gear.", answer: "Defect reported with a photo. Maintenance is on the way." },
					],
					tug: [{ ask: "Is stand 14 clear for pushback?", answer: "Not yet. Catering clears the aft door in 2 minutes." }],
				},
			},
		},
	},
};
