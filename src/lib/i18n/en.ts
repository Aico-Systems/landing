import type { Messages } from "./types";

export const en: Messages = {
	site: {
		brand: "Mandy",
		tagline: "Ask in any language. Mandy answers and gets it done.",
		demo: "Book a demo",
		updated: (date) => `Updated ${date}`,
		seo: {
			title: "Voice AI for frontline teams",
			description:
				"Mandy is a voice assistant for frontline teams. Workers ask in their own language on whatever they carry; Mandy answers from your documents and does the work in your systems.",
		},
		language: "English",
	},
	gateway: {
		intro:
			"Mandy is a voice assistant for frontline teams. Workers ask in their own language, on a glove scanner, a phone, a watch or a call, and Mandy answers from the site's documents and does the work in its systems.",
		enter: "Read on in English",
	},
	home: {
		stage: (vertical) => `${vertical}: people at work, asking Mandy as they go`,
		industries: "Industries",
		askedIn: (language) => `Asked in ${language}`,
		about: "What is Mandy?",
		try: {
			open: "Try Mandy",
			idle: "Press the glove's button to start.",
			connecting: "Connecting…",
			live: "Hold the button and talk. Let go to send.",
			ended: "That was it. Press to start again.",
			failed: "Mandy could not be reached. Try again in a moment.",
			hold: "Hold to talk",
			start: "Start",
			glove: "The glove, with Mandy on its screen",
		},
		replay: "Play again",
		close: "Close",
		heardIn: (language) => `Said in ${language}`,
		systemKinds: {
			erp: "ERP",
			wms: "WMS",
			mes: "MES",
			maintenance: "Maintenance",
			quality: "Quality",
			workforce: "Workforce",
			documents: "Documents",
			messaging: "Messaging",
			tickets: "Tickets",
			shop: "Shop",
			shipping: "Shipping",
			returns: "Returns",
			resale: "Resale",
			sorting: "Sortation",
			yard: "Yard and dock",
			customs: "Customs",
			routing: "Routing",
			serialisation: "Serialisation",
			temperature: "Temperature",
			mro: "MRO",
			techdocs: "Technical docs",
			groundops: "Ground ops",
			baggage: "Baggage",
			safety: "Safety",
			plm: "PLM",
			replenishment: "Replenishment",
			tasks: "Tasks",
			voice: "Voice picking",
			instructions: "Work instructions",
			andon: "Andon",
			marketplace: "Marketplace",
			helpdesk: "Helpdesk",
		},
		systems: { heading: "Works with what you already run", note: "Connected through Activepieces where a piece exists, otherwise through the system's own API or a webhook." },
		verbs: { know: "Know", act: "Act", talk: "Talk", record: "Record", learn: "Learn" },
		mandy: {
			question: "What is Mandy?",
			answer: "Mandy is a voice assistant for frontline teams in warehouses, plants, stores and hangars. Workers ask in their own language, on whatever they carry, and Mandy answers from your documents and gets the work done in your systems.",
			why: {
				heading: "Why do exceptions cost so much?",
				each: "3–15\u00a0min each",
				perShift: "3–5 per worker, per shift",
				text: "A missing part or an unclear step stops the worker. They walk off to find someone who knows, or put down what they hold to type it into a terminal, and go to the office to see that someone is on it. The answer is often written down somewhere, but nobody on the floor has time to look it up.",
			},
			flow: {
				heading: "Which languages does Mandy speak?",
				glove: ["On the glove", "On the phone", "On the watch"],
				teams: ["In Teams", "In Slack", "In WhatsApp", "By SMS"],
				bridge: "Translated, with scan, place and photo",
				caption: "The worker speaks Ukrainian, the team lead reads German in the app they already use, and neither has to switch.",
			},
			verbs: {
				heading: "What can Mandy do?",
				items: {
					know: { text: "Answers from any document you give it, from work instructions to client specs, and says when it doesn't know.", says: "How do I pack the returns for route 12?" },
					act: { text: "Books refills, updates records, opens tickets and runs checklists, reading each one back first.", says: "Refill B14, two boxes." },
					talk: { text: "Reaches the right person in their app, or calls them, and tells the worker someone is on it.", says: "Kitting needs cable harnesses, three left." },
					record: { text: "Logs tasks, photos and near misses with time and place.", says: "Starting decant, aisle 7." },
					learn: { text: "Coaches new staff and shows where the floor gets stuck.", says: "First day here. Where do the empty totes go?" },
				},
			},
			systems: {
				heading: "Where does Mandy work?",
				text: "People reach Mandy on whatever they carry. Mandy works in what you already run, and there is nothing new to buy.",
				devices: ["ProGlove MAI glove", "Android phone or scanner", "Smartwatch", "Phone call", "Browser"],
				groups: [
					{ name: "Your documents", items: "Work instructions, manuals, specs, spreadsheets, SharePoint" },
					{ name: "Your systems", items: "SAP, WMS, ServiceNow, Jira, Zendesk" },
					{ name: "Your team", items: "Teams, Slack, WhatsApp, SMS, a phone call" },
				],
			},
			integrations: {
				heading: "What else can it work with?",
				text: (count) => `Mandy connects through Activepieces, an open catalog of ${count} apps, and to any system with a REST API or a webhook.`,
				groups: {
					erp: "ERP and planning",
					service: "Tickets and service",
					messaging: "Messages",
					documents: "Documents",
					data: "Data",
				},
				more: "and hundreds more",
			},
			runs: {
				heading: "Where does it run?",
				options: [
					{ name: "EU cloud", text: "Hosted in the EU, built for GDPR and security reviews." },
					{ name: "Your servers", text: "On premises, inside your own network." },
					{ name: "Offline", text: "For plants without internet. Dead spots sync later." },
				],
			},
			pilot: {
				heading: "How do we start?",
				week: "Week",
				phases: [
					{ name: "Scope", from: 0, to: 0, what: "One use case, 5 to 12 workers" },
					{ name: "Setup", from: 1, to: 1, what: "Your documents loaded, systems connected" },
					{ name: "Live", from: 2, to: 13, what: "Your team uses Mandy every day" },
					{ name: "Decide", from: 14, to: 14, what: "Time saved, measured" },
				],
			},
			faq: {
				heading: "Questions we often get",
				items: [
					{ q: "Does Mandy work without internet?", a: "Yes. It runs on your own servers or fully offline." },
					{ q: "Is voice always the right interface?", a: "No. Requests that come up often become one-tap buttons on the glove." },
					{ q: "How is this different from pick-by-voice?", a: "Pick-by-voice follows a fixed script. Mandy answers open questions and books things in your systems." },
					{ q: "What if Mandy doesn't know?", a: "It says so, and brings in a person when the standard procedure doesn't cover the case." },
					{ q: "Is the microphone always on?", a: "No. Mandy listens only while the button is pressed." },
					{ q: "What about gloves and loud halls?", a: "One press on the glove scanner works with gloves on, and requests that come up often become one-tap buttons, so a loud hall doesn't stop them." },
				],
			},
		},
		verticals: {
			warehouse: {
				name: "Warehouse",
				slug: "warehouse",
				seo: {
					title: "Voice AI for warehouse and 3PL teams",
					description: "Each client's SOP at the rack, in every worker's language. Mandy gets agency staff working on their own sooner and books moves in your WMS.",
				},
				headline: ["Every client's rules,", "in every worker's language."],
				does: [
					{ verb: "know", text: "Each client's SOP, at the rack." },
					{ verb: "act", text: "Refills and moves booked in the WMS." },
					{ verb: "record", text: "Decanting and cleaning logged by voice." },
				],
				gain: "Fewer walks to the team leader, fewer SLA misses.",
				card: {
					question: "How does Mandy help in a warehouse?",
					answer: "A 3PL runs a different SOP for every client, often with agency staff who started this week. Mandy answers from the right client's documents at the rack, in the worker's language, and books the result in your WMS and logs the indirect work no WMS sees.",
					story: {
						meaning: "Client says gift wrap, but there's no wrap code on the label. What do I do?",
						answer: "Client B's SOP: wrap it and add code GW1 at pack station 3.",
						lands: "Answered from client B's SOP, logged",
					},
					result: "Fewer walks to the team leader.",
				},
				voices: {
					picker: [
						{ ask: "Client B wants gift wrap but there's no wrap code. What now?", answer: "Wrap it and add GW1 at pack station 3. That's client B's SOP.", lang: "uk" },
						{ ask: "Refill B14, two cartons.", answer: "Booked: two cartons to B14, due at 10:40." },
					],
					receiver: [
						{ ask: "Pallet 4 is damaged, two cartons crushed.", answer: "Photo filed and an inbound exception opened for client A.", lang: "ro" },
					],
					replenisher: [
						{ ask: "Move the rest of this pallet to zone C.", answer: "Transfer to C-03 posted. Scan the slot to confirm." },
					],
					driver: [
						{ ask: "Near miss at dock 3, a forklift came round blind.", answer: "Near miss logged with time and place. Safety has it." },
					],
				},
			},
			manufacturing: {
				name: "Manufacturing",
				slug: "manufacturing",
				seo: {
					title: "Voice AI for production and assembly lines",
					description: "Work instructions for the right variant, shortages to logistics with part number and station, shift handovers in every language. Shorter line stops.",
				},
				headline: ["Shorter line stops,", "first time right."],
				does: [
					{ verb: "know", text: "The standard fix for a damaged or missing part." },
					{ verb: "talk", text: "Shortages to logistics, part number included." },
					{ verb: "record", text: "Shift handovers, spoken and translated." },
				],
				gain: "Less waiting on the andon, less rework.",
				card: {
					question: "How does Mandy help on a production line?",
					answer: "When a part is damaged, missing or in the wrong bin, the worker goes looking for a key user, though the fix is usually the standard one. Mandy walks them through it in their own language, tells logistics, and brings in a person only when the standard path doesn't apply.",
					story: {
						meaning: "This part is damaged. What do I do?",
						answer: "Put it in the service area and take the next one from bin 4. Logistics has the part number.",
						lands: "Exception logged, logistics notified",
					},
					result: "Fewer walks to find a key user.",
				},
				voices: {
					lineA: [
						{ ask: "Kitting is down to three cable harnesses.", answer: "Logistics has part 4471-B and your station. Tugger due in 8\u00a0min." },
						{ ask: "Nutrunner shows error E-47.", answer: "The socket isn't seated. Reseat it and re-torque bolt 3." },
					],
					lineB: [
						{ ask: "Note for the next shift: the labeller on line 2 skips.", answer: "Added to the handover, in German and Polish.", lang: "pl" },
					],
					tugger: [
						{ ask: "Which station needs material next?", answer: "Line B, station 5: door clips, in 12 minutes." },
					],
				},
			},
			parcel: {
				name: "Parcel",
				slug: "parcel",
				seo: {
					title: "Voice AI for parcel and postal hubs",
					description: "Seasonal staff clear no-reads, damaged and out-of-gauge parcels by voice, and loading checks the cut-off without leaving the belt.",
				},
				headline: ["Exceptions cleared at the belt,", "trucks out on time."],
				does: [
					{ verb: "know", text: "No-reads, damages, out-of-gauge: what to do." },
					{ verb: "talk", text: "Help without hunting for a radio." },
					{ verb: "act", text: "Faults reported with place and photo." },
				],
				gain: "Fewer missorts, departures that make the cut-off.",
				card: {
					question: "How does Mandy help in a parcel hub?",
					answer: "Peak brings thousands of seasonal workers to a sorter that doesn't wait. Mandy tells them what to do with a no-read, a torn label or an out-of-gauge parcel, without leaving the belt or looking for a supervisor.",
					story: {
						meaning: "The label's torn, half the postcode is gone. Where does it go?",
						answer: "Exceptions bay 2. Scan it there and add a photo.",
						lands: "Logged as a no-read with scan and photo",
					},
					result: "Departures that make the cut-off.",
				},
				voices: {
					sorter: [
						{ ask: "This parcel has no label.", answer: "Exceptions bay 2. Scan and photo are logged." },
						{ ask: "The cage at chute 9 is full.", answer: "Swap requested. An empty cage is on its way." },
					],
					packer: [
						{ ask: "Anything left for the 8 p.m. linehaul?", answer: "Two cages upstairs. They're coming down now.", lang: "de" },
					],
					driver: [
						{ ask: "Door 3 won't close.", answer: "Maintenance ticket opened with the door and a photo." },
					],
				},
			},
			ecommerce: {
				name: "eCommerce",
				slug: "ecommerce",
				seo: {
					title: "Voice AI for eCommerce fulfilment",
					description: "Short picks and packing questions answered at the station, replenishment booked by voice, and orders that still make the cut-off in peak.",
				},
				headline: ["Peak staff productive,", "orders out by cut-off."],
				does: [
					{ verb: "act", text: "Short picks, full crates, no barcode: said, not typed." },
					{ verb: "learn", text: "New pickers ask instead of guessing." },
					{ verb: "know", text: "The right carton for every SKU." },
				],
				gain: "Fewer mis-picks, same-day dispatch held.",
				card: {
					question: "How does Mandy help in eCommerce fulfilment?",
					answer: "In peak, hundreds of new pickers meet SKUs they have never seen, and every exception means a template on the handheld. Mandy takes the exception by voice, books the replenishment when a location is empty, and the order still makes the cut-off.",
					story: {
						meaning: "Location's empty for the SKU ending 4471. Can you book a refill?",
						answer: "Refill booked from reserve R-12. Pick from 07-B for now.",
						lands: "Replenishment booked in the WMS",
					},
					result: "Orders that make the cut-off.",
				},
				voices: {
					newcomer: [
						{ ask: "First day here. How do I pack glass?", answer: "Wrap it twice, use carton M and a fragile label.", lang: "bg" },
						{ ask: "Starting decant in aisle 7.", answer: "Logged at 14:02, aisle 7." },
					],
					packer: [
						{ ask: "Which carton for order 8840?", answer: "Size M with padding. One item is glass." },
					],
					picker: [
						{ ask: "Location empty for SKU 4471.", answer: "Refill booked. Pick from 07-B for now." },
						{ ask: "Crate is full, item still in hand.", answer: "New crate 2231 assigned. Put it there and scan it." },
					],
					driver: [
						{ ask: "Where am I needed for the 3 p.m. wave?", answer: "Pack station 4. Its packer is going on break." },
					],
				},
			},
			grocery: {
				name: "Grocery",
				slug: "grocery",
				seo: {
					title: "Voice AI for grocery stores and dark stores",
					description: "Gaps reported and refilled from the aisle, the right substitution while picking, and temperature checks logged with a time stamp.",
				},
				headline: ["Full shelves, the right subs,", "fresh on time."],
				does: [
					{ verb: "act", text: "Missing items reported, no trip to the terminal." },
					{ verb: "know", text: "Substitution rules while picking." },
					{ verb: "record", text: "Temperature checks, time-stamped." },
				],
				gain: "Better availability, less waste.",
				card: {
					question: "How does Mandy help in grocery retail?",
					answer: "In a grocery DC or store, a missing item or a warm chiller usually means a walk back to the office, sometimes with a colleague to translate. Mandy gives the right step the first time, in the worker's language, and logs it on the spot.",
					story: {
						meaning: "Chiller in aisle 3 reads 9 degrees. Logging it, who do I call?",
						answer: "Logged at 09:12. Move the dairy to the backroom chiller; the manager is on the way.",
						lands: "Temperature check logged, manager alerted",
					},
					result: "Fewer gaps, less waste.",
				},
				voices: {
					shelves: [
						{ ask: "The oat drink shelf is almost empty.", answer: "Two cases ordered. They're in the backroom." },
						{ ask: "Pasta 500\u00a0g is out. What do I sub?", answer: "Wholewheat, same size. This customer allows subs." },
					],
					fridges: [
						{ ask: "Fridge six is at seven degrees.", answer: "Logged. Move the yogurt to the backroom chiller.", lang: "tr" },
					],
					floor: [
						{ ask: "Spill in aisle 3.", answer: "Cleaning is on it. Please put out the warning sign." },
					],
				},
			},
			fashion: {
				name: "Fashion",
				slug: "fashion",
				seo: {
					title: "Voice AI for fashion returns and resale",
					description: "Every grader applies the brand's grading spec the same way, logs photo evidence for each disposition, and returns get back to stock sooner.",
				},
				headline: ["Returns graded the same way,", "back to stock sooner."],
				does: [
					{ verb: "know", text: "The brand's grading spec, every time." },
					{ verb: "record", text: "Photo evidence for every disposition." },
					{ verb: "learn", text: "Recurring defects reach quality." },
				],
				gain: "More A-grade back to stock.",
				card: {
					question: "How does Mandy help with fashion returns?",
					answer: "Whether a mark makes a B or a C depends on who grades it. Mandy gives every grader the brand's spec and logs a photo as evidence for the decision, which matters now that the EU bans destroying unsold clothing.",
					story: {
						meaning: "Small pull on the seam, no tags. Resale or refurb?",
						answer: "Refurb: re-tag and steam it. Grade B per the spec.",
						lands: "Grade and photo logged with the return",
					},
					result: "Consistent grades, back to stock sooner.",
				},
				voices: {
					grader: [
						{ ask: "Seam is split. Resell or repair?", answer: "Repair. It costs less than two euros." },
						{ ask: "Stain on the sleeve, taking a photo.", answer: "Attached to the return. Grade C, outlet." },
					],
					checker: [
						{ ask: "How do I check this label is genuine?", answer: "Look at the stitching, care label and tag code.", lang: "vi" },
					],
					returns: [
						{ ask: "This return has no label.", answer: "Matched by the order slip and logged." },
					],
				},
			},
			pharma: {
				name: "Pharma",
				slug: "pharma",
				seo: {
					title: "Voice AI for GDP pharma warehouses",
					description: "The current approved SOP step by voice, and excursions and deviations captured on the spot with a timestamped audit trail to the Responsible Person.",
				},
				headline: ["Right first time,", "with an audit trail."],
				does: [
					{ verb: "know", text: "The current SOP step, by voice." },
					{ verb: "record", text: "Deviations captured on the spot." },
					{ verb: "talk", text: "Excursions routed to the RP." },
				],
				gain: "Fewer findings, faster deviation closure.",
				card: {
					question: "How does Mandy help in a pharma warehouse?",
					answer: "Under GDP every step needs a record, and a deviation that waits becomes a finding. Mandy reads out the current approved SOP step and captures an excursion or deviation on the spot, timestamped and routed to the Responsible Person: Mandy logs and routes, people decide.",
					story: {
						meaning: "Logger on this tote shows 9.2 degrees. Quarantine it?",
						answer: "Yes, move it to quarantine Q2. The deviation is open and the RP is informed.",
						lands: "Deviation logged with timestamp, RP notified",
					},
					result: "Audit-ready records, without typing.",
				},
				voices: {
					picker: [
						{ ask: "Is lot 24-117 released?", answer: "Not yet. QA releases it at 2 p.m." },
						{ ask: "Start the cold-chain checklist.", answer: "Step 1: is the data logger attached and running?" },
					],
					verifier: [
						{ ask: "This serial number won't verify.", answer: "Treat it as suspect: quarantine the unit. QA has it." },
					],
					coldRoom: [
						{ ask: "The cold room door was open for five minutes.", answer: "Deviation logged with the time. The RP has it.", lang: "pl" },
					],
				},
			},
			aviation: {
				name: "Aviation",
				slug: "aviation",
				seo: {
					title: "Voice AI for ground handling and aircraft maintenance",
					description: "Drivers called and damaged bags reported by voice on the ramp, AMM and IPC references and handovers in the hangar. The certifying engineer still signs.",
				},
				headline: ["On the ramp and in the hangar,", "nothing waits for the office."],
				does: [
					{ verb: "talk", text: "A driver for a full container, no second app." },
					{ verb: "record", text: "Damaged bags reported where they are found." },
					{ verb: "know", text: "AMM and IPC references, hands-free." },
				],
				gain: "Transfer bags on their flight, task cards on the record.",
				card: {
					question: "How does Mandy help in aviation?",
					answer: "On the ramp, gloves stay on and phones stay away, yet calling a driver for a full container or reporting a damaged bag still means a second app or a trip to the office. Mandy takes both by voice, in the agent's own language. In the hangar it finds the AMM or IPC reference and records the handover; the certifying engineer still signs.",
					story: {
						meaning: "This container for the 14:20 to Madrid is full. I need a driver.",
						answer: "Driver requested. Tug 7 is at your stand in 4 minutes.",
						lands: "Request sent to ramp dispatch",
					},
					result: "Nothing waits for the office.",
				},
				voices: {
					ramp: [
						{ ask: "Damaged bag on belt 3, handle torn off.", answer: "Logged with photo and tag number. Baggage services have it." },
						{ ask: "Belt loader contact at stand 14, small dent by the aft cargo door.", answer: "Occurrence logged with photo. Maintenance and the duty manager have it." },
					],
					mechanic: [
						{ ask: "Torque value for the fan cowl latch?", answer: "12\u00a0Nm, per the AMM task. Logged." },
						{ ask: "Hydraulic leak at the left main gear.", answer: "Defect reported with a photo. Maintenance is on the way." },
					],
					tug: [
						{ ask: "Is stand 14 clear for pushback?", answer: "Not yet. Catering clears the aft door in 2 minutes." },
					],
				},
			},
		},
	},
};
