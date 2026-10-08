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
		close: "Close",
		cardHeadings: { story: "Watch one exchange", asks: "What workers ask", helps: "What Mandy does", result: "What changes" },
		heardIn: (language) => `Said in ${language}`,
		verbs: { know: "Know", act: "Act", talk: "Talk", record: "Record", learn: "Learn" },
		mandy: {
			question: "What is Mandy?",
			answer: [
				"Mandy is a voice assistant for people who work on warehouse and factory floors. It runs on the ProGlove MAI glove, on an Android phone or on a watch. A worker presses once, asks in their own language, and Mandy answers from the site's own documents and systems.",
				"It can also act on what it hears: Mandy books a refill in SAP, messages the team or opens a maintenance ticket, and logs who asked, where and when.",
			],
			figures: [
				{ value: "3\u201315", unit: "min", label: "lost every time a worker hits an exception" },
				{ value: "3\u20135", unit: "\u00d7", label: "exceptions per worker, per shift" },
				{ value: "40", unit: "%", label: "of the day can be indirect work no WMS sees" },
				{ value: "14", unit: "weeks", label: "from first call to a measured result" },
			],
			whyHeading: "Why do exceptions cost so much?",
			why: [
				"A missing part, a damaged carton or an unclear step stops a worker mid-task. Their hands are full, so they walk off to find someone who knows. The answer is often in an SOP that nobody had time to read, least of all the new hire.",
				"Supervisors cover several areas at once, and half the crew may not speak the site language. None of these questions show up in any system, so management never sees what the floor struggles with.",
			],
			flowHeading: "Which languages does Mandy speak?",
			flowText: "Whichever the worker speaks. Mandy translates every message on the way, so the supervisor reads German, the SOP stays in German, and nobody has to switch.",
			flow: [
				{ who: "Worker", text: "Says it into the glove in Ukrainian, hands still on the pallet." },
				{ who: "Mandy", text: "Transcribes and translates it, and adds the scan, the station and a photo." },
				{ who: "Team lead", text: "Reads a clean report in German in Teams and answers with one tap." },
				{ who: "Worker", text: "Hears the answer in Ukrainian, on the glove." },
			],
			verbsHeading: "What can Mandy do?",
			verbs: {
				know: "Answers from your SOPs, packaging instructions, order status and machine manuals, and says so when it doesn't know.",
				act: "Books refills, stock transfers, counts and service tickets in ERP and WMS, and reads each booking back first.",
				talk: "Sends structured messages to the right team, calls the supervisor when it is urgent and handles shift handovers.",
				record: "Logs tasks, photos, checklists and near misses with time, place and name.",
				learn: "Coaches new and agency staff in their language and shows management the questions of the week and how long escalations wait.",
			},
			systemsHeading: "Which systems does it connect to?",
			systemsText: "The ones the site already runs: ERP, WMS and labour systems for lookups and bookings, ticketing for faults, your SOPs as the source of answers, and the team's messengers. Nothing new to buy.",
			runsHeading: "Where does it run?",
			runs: [
				{ name: "Cloud", text: "EU data residency, built for GDPR and security reviews." },
				{ name: "On premises", text: "On your own servers, inside your network." },
				{ name: "Air-gapped", text: "For plants that stay offline. Dead Wi-Fi zones are buffered and synced later." },
			],
			pilotHeading: "How does a pilot work?",
			pilotText: "One site, one use case, 5 to 12 workers. You set the target, and we report against it.",
			pilot: [
				{ when: "Week 0", what: "Pick the use case, the crew and a supervisor who wants it solved." },
				{ when: "Week 1", what: "We load your SOPs, connect your systems and set the crew's languages." },
				{ when: "Weeks 2\u201313", what: "Workers use Mandy every day. Requests that keep coming back become one-tap buttons." },
				{ when: "Week 14", what: "Time saved, measured, and the next use case scoped." },
			],
			faqHeading: "Questions we often get",
			faq: [
				{ q: "Does Mandy work without internet?", a: "Yes. It runs on premises or air-gapped as well as in the cloud." },
				{ q: "Is voice always the right interface?", a: "No. Requests that keep coming back become one-tap buttons on the glove, and voice is there for everything else." },
				{ q: "How is Mandy different from pick-by-voice or a knowledge app?", a: "Pick-by-voice follows a fixed script, and a knowledge app can answer questions but cannot book anything. Mandy answers open questions and writes back to your systems." },
				{ q: "What happens when Mandy doesn't know the answer?", a: "It says so. When the standard procedure doesn't cover a case, Mandy brings in a person." },
			],
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
					answer: [
						"In a contract logistics warehouse every client has its own packing, labelling and returns rules, and much of the crew is agency staff who are new to the site and its language. Mandy answers their questions at the rack, in their language, from each client's own instructions.",
						"Workers also book refills and stock moves by voice. Mandy reads every booking back before it posts it, and logs who booked it, where and when.",
					],
					story: {
						meaning: "How does client B want this pallet labelled?",
						answer: "Two labels on opposite sides, max height 1.8 m.",
						lands: "Answered from client B's SOP",
					},
					asks: [
						"How does client B want this pallet labelled?",
						"When does the refill for B14 arrive?",
						"Move the rest of this pallet to zone C.",
					],
					helps: [
						{ verb: "know", text: "Packing and labelling rules per client, from the SOPs you already have." },
						{ verb: "act", text: "Refills, stock transfers and counts booked in your WMS by voice." },
						{ verb: "record", text: "Indirect work like decanting and cleaning, logged with time and place. It can take up to 40% of a day, and no WMS sees it." },
						{ verb: "learn", text: "Agency staff who can work on their own from the first shift." },
					],
					result: "Fewer walks to the office, and new staff productive from their first shift.",
				},
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
					answer: [
						"On an assembly line a missing part or a fault code stops a station, and the supervisor is often covering four areas at once. Mandy takes the last scanned barcode and what the worker says, and sends logistics a complete request with part number, station and the quantity left.",
						"Fault codes, changeover steps and settings for each line are one question away, and the shift handover is spoken once and translated for the next crew.",
					],
					story: {
						meaning: "Kitting is down to three cable harnesses.",
						answer: "Logistics has the part number and your station. Tugger due in 8 min.",
						lands: "Message to logistics, in Teams",
					},
					asks: [
						"Kitting is down to three cable harnesses.",
						"What does error E-47 on the nutrunner mean?",
						"Tell the next shift the labeller on line 2 skips.",
					],
					helps: [
						{ verb: "talk", text: "Shortages reach logistics in one message, with part number and station." },
						{ verb: "know", text: "Fault codes, changeover steps and machine settings per station." },
						{ verb: "act", text: "A broken machine opens a maintenance ticket with location, scan and photo." },
						{ verb: "record", text: "Shift handovers summarised and translated for the next crew." },
					],
					result: "Fewer line stops, and supervisors who can cover more of the floor.",
				},
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
					answer: [
						"A sorter runs fast until a parcel has no label, arrives damaged or is too big for the belt. Mandy tells the worker what to do with it and logs the scan and a photo.",
						"Sorting, packing and loading teams talk on one channel. When the loading team asks by voice whether parcels are left for the 8 p.m. route, packing gets the question in Teams and answers with one tap, so trucks stop leaving half empty.",
					],
					story: {
						meaning: "This parcel has no label.",
						answer: "Take it to the exceptions bench. Scan and photo are logged.",
						lands: "Exception logged with scan and photo",
					},
					asks: [
						"This parcel has no label.",
						"Are there still parcels for the 8 p.m. route?",
						"Door 3 won't close.",
					],
					helps: [
						{ verb: "know", text: "Handling rules for oversize, damaged and unlabelled parcels." },
						{ verb: "talk", text: "Questions between sorting, packing and loading answered in seconds." },
						{ verb: "act", text: "Broken belts and doors reported with location and photo." },
					],
					result: "Fuller trucks, and no pile of exceptions left at the end of the shift.",
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
					answer: [
						"Peak season brings in hundreds of pickers and packers who have never seen the site. Mandy lets them ask, in their own language, what they would otherwise guess: which carton, how to pack glass, what to do with a short pick.",
						"The answers come from your packaging rules for each product, so orders leave in the right box with the right padding.",
					],
					story: {
						meaning: "First day here. How do I pack glass?",
						answer: "Wrap it twice, use carton M and a fragile label.",
						lands: "Answered from the packaging rules",
					},
					asks: [
						"First day here. How do I pack glass?",
						"Which carton for order 8840?",
						"Tote 118 is one item short.",
					],
					helps: [
						{ verb: "learn", text: "Onboarding at the pack station, in each worker's language." },
						{ verb: "know", text: "Carton size and packaging rules per product." },
						{ verb: "record", text: "Short picks, rework and decanting logged as they happen." },
					],
					result: "Seasonal teams up to speed in hours, and fewer damaged or oversized shipments.",
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
					answer: [
						"In a store or a dark store, the person who sees an empty shelf should be the one who orders the refill. With Mandy they say so and the order is placed, without a trip to a terminal.",
						"Staff picking online orders get substitutions and order status while they pick, and fridge temperatures and fresh-food checks are logged by voice with a time stamp.",
					],
					story: {
						meaning: "The oat drink shelf is almost empty.",
						answer: "Two cases ordered. They're in the backroom.",
						lands: "Refill order in the store system",
					},
					asks: [
						"The oat drink shelf is almost empty.",
						"Pasta 500 g is out of stock. What do I substitute?",
						"Fridge six is at seven degrees.",
					],
					helps: [
						{ verb: "act", text: "Refill orders and shelf data updated by voice." },
						{ verb: "know", text: "Substitutions and order status during the pick." },
						{ verb: "record", text: "Temperature and fresh-food checks with a time stamp." },
					],
					result: "Fewer gaps on the shelf and fewer missing items in online orders.",
				},
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
					answer: [
						"Returns grading depends on who does it: one person resells a jacket with a split seam, the next sends it to repair. Mandy gives every grader the same rules for each brand and material.",
						"A double press on the glove takes a photo, and Mandy describes the damage and files it with the return. Because every defect is recorded, buying and quality can see which ones keep coming back.",
					],
					story: {
						meaning: "Seam is split. Resell or repair?",
						answer: "Repair. It costs less than two euros.",
						lands: "Grade logged with the return",
					},
					asks: [
						"Seam is split. Resell or repair?",
						"How do I check this label is genuine?",
						"Stain on the sleeve, taking a photo.",
					],
					helps: [
						{ verb: "know", text: "Grading rules per brand and material, the same on every shift." },
						{ verb: "record", text: "Damage photographed, described and attached to the return." },
						{ verb: "learn", text: "Recurring defects reported to quality and buying." },
					],
					result: "Consistent grades, and more returns back on sale sooner.",
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
					answer: [
						"Under GMP every step needs a record of who did it, when and where, and a wrong pick can harm a patient. Mandy guides workers through checklists by voice and logs each step as it happens.",
						"Lot status, storage conditions and SOPs come straight from your systems, and deviations go to QA on the spot, with the time and place.",
					],
					story: {
						meaning: "The cold room door was open for five minutes.",
						answer: "Deviation logged with the time. QA has it.",
						lands: "Deviation report to QA",
					},
					asks: [
						"Is lot 24-117 released?",
						"Start the cold-chain checklist.",
						"This serial number won't verify.",
					],
					helps: [
						{ verb: "record", text: "Guided checklists, every step logged with who, when and where." },
						{ verb: "know", text: "Lot status, storage conditions and the SOP for each step." },
						{ verb: "talk", text: "Deviations reported to QA on the spot." },
					],
					result: "Records ready for an audit, without anyone typing them up.",
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
					answer: [
						"Technicians and ground staff spend much of their shift on documentation instead of the aircraft. Mandy reads out task cards and torque values and records defects with photo and position while their hands stay on the job.",
						"Ramp, catering, baggage and maintenance coordinate the turnaround on one channel, each in their own language.",
					],
					story: {
						meaning: "Torque value for the fan cowl latch?",
						answer: "12 Nm, per the task card.",
						lands: "Step signed off on the task card",
					},
					asks: [
						"Torque value for the fan cowl latch?",
						"Hydraulic leak at the left main gear.",
						"Is stand 14 clear for pushback?",
					],
					helps: [
						{ verb: "know", text: "Task cards and torque values, read out hands-free." },
						{ verb: "record", text: "Defects logged with photo and position on the aircraft." },
						{ verb: "talk", text: "Ramp, catering and maintenance on one channel." },
					],
					result: "More time on the aircraft, and turnarounds that stay on schedule.",
				},
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
