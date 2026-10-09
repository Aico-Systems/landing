import type { Messages } from "./types";

export const de: Messages = {
	site: {
		brand: "Mandy",
		tagline: "Fragen in jeder Sprache. Mandy antwortet und erledigt es.",
		demo: "Demo vereinbaren",
		updated: (date) => `Stand: ${date}`,
		seo: {
			title: "Sprach-KI für die Fläche",
			description:
				"Mandy ist ein Sprachassistent für Teams auf der Fläche. Gefragt wird in der eigenen Sprache auf jedem Gerät; Mandy antwortet aus Ihren Dokumenten und erledigt die Arbeit in Ihren Systemen.",
		},
		language: "Deutsch",
	},
	gateway: {
		intro:
			"Mandy ist ein Sprachassistent für Teams auf der Fläche. Gefragt wird in der eigenen Sprache, am Handschuh-Scanner, Smartphone, an der Uhr oder per Anruf, und Mandy antwortet aus den Dokumenten des Standorts und erledigt die Arbeit in seinen Systemen.",
		enter: "Weiter auf Deutsch",
	},
	home: {
		stage: (vertical) => `${vertical}: Menschen bei der Arbeit, die Mandy nebenbei fragen`,
		industries: "Branchen",
		askedIn: (language) => `Auf ${language} gefragt`,
		about: "Was ist Mandy?",
		assistant: { subtitle: "Schreiben oder sprechen", placeholder: "Nachricht schreiben…" },
		replay: "Noch einmal abspielen",
		close: "Schließen",
		heardIn: (language) => `Auf ${language} gesagt`,
		systemKinds: {
			erp: "ERP",
			wms: "WMS",
			mes: "MES",
			maintenance: "Instandhaltung",
			quality: "Qualität",
			workforce: "Personal",
			documents: "Dokumente",
			messaging: "Nachrichten",
			tickets: "Tickets",
			shop: "Shop",
			shipping: "Versand",
			returns: "Retouren",
			resale: "Wiederverkauf",
			sorting: "Sortierung",
			yard: "Hof und Rampe",
			customs: "Zoll",
			routing: "Tourenplanung",
			serialisation: "Serialisierung",
			temperature: "Temperatur",
			mro: "MRO",
			techdocs: "Technische Doku",
			groundops: "Bodenabfertigung",
			baggage: "Gepäck",
			safety: "Sicherheit",
			plm: "PLM",
			replenishment: "Disposition",
			tasks: "Aufgaben",
			voice: "Pick-by-Voice",
			instructions: "Arbeitsanweisungen",
			andon: "Andon",
			marketplace: "Marktplatz",
			helpdesk: "Helpdesk",
		},
		systems: { heading: "Arbeitet mit dem, was Sie schon nutzen", note: "Angebunden über Activepieces, wo es ein Piece gibt, sonst über die API des Systems oder einen Webhook." },
		verbs: { know: "Wissen", act: "Handeln", talk: "Abstimmen", record: "Erfassen", learn: "Lernen" },
		mandy: {
			question: "Was ist Mandy?",
			answer: "Mandy ist ein Sprachassistent für Teams in Lager, Werk, Markt und Hangar. Gefragt wird in der eigenen Sprache, auf jedem Gerät, das gerade zur Hand ist, und Mandy antwortet aus Ihren Dokumenten und erledigt die Arbeit in Ihren Systemen.",
			why: {
				heading: "Warum sind Ausnahmen so teuer?",
				each: "je 3–15 Min.",
				perShift: "3–5 pro Person und Schicht",
				text: "Ein fehlendes Teil oder ein unklarer Schritt hält die Person an. Sie geht los und sucht jemanden, der Bescheid weiß, oder legt ab, was sie in der Hand hat, um es am Terminal einzutippen, und geht ins Büro, um zu sehen, dass sich jemand kümmert. Die Antwort steht oft irgendwo geschrieben, aber auf der Fläche hat niemand Zeit, sie nachzuschlagen.",
			},
			flow: {
				heading: "Welche Sprachen spricht Mandy?",
				glove: ["Am Handschuh", "Am Smartphone", "An der Uhr"],
				teams: ["In Teams", "In Slack", "In WhatsApp", "Per SMS"],
				bridge: "Übersetzt, mit Scan, Ort und Foto",
				caption: (language) =>
					`Der Mitarbeiter spricht ${language}, die Teamleitung liest Deutsch in der App, die sie schon nutzt, und niemand muss umdenken.`,
			},
			verbs: {
				heading: "Was kann Mandy?",
				items: {
					know: { text: "Antwortet aus jedem Dokument, das Sie ihr geben, von Arbeitsanweisungen bis Kundenvorgaben, und sagt, wenn sie etwas nicht weiß.", says: "Wie packe ich die Retouren für Tour 12?" },
					act: { text: "Bucht Nachschub, pflegt Daten, legt Tickets an und führt durch Checklisten, jede Buchung vorher vorgelesen.", says: "Nachschub für B14, zwei Kartons." },
					talk: { text: "Erreicht die richtige Person in ihrer App oder ruft an, und sagt der Person auf der Fläche, dass sich jemand kümmert.", says: "Kitting braucht Kabelbäume, noch drei da." },
					record: { text: "Erfasst Aufgaben, Fotos und Beinahe-Unfälle mit Zeit und Ort.", says: "Fange mit dem Umpacken in Gang 7 an." },
					learn: { text: "Arbeitet neue Leute ein und zeigt, wo es auf der Fläche hakt.", says: "Erster Tag. Wohin kommen die leeren Behälter?" },
				},
			},
			systems: {
				heading: "Wo arbeitet Mandy?",
				text: "Erreichbar ist Mandy auf dem, was die Leute ohnehin dabeihaben, und gearbeitet wird in den Systemen, die Sie schon nutzen. Neue Geräte brauchen Sie nicht.",
				devices: ["Handschuh-Scanner", "Handy, Handheld", "Smartwatch", "Telefonanruf", "Web"],
				groups: [
					{ name: "Ihre Dokumente", items: "Arbeitsanweisungen, Handbücher, Vorgaben, Tabellen, SharePoint" },
					{ name: "Ihre Systeme", items: "SAP, WMS, ServiceNow, Jira, Zendesk" },
					{ name: "Ihr Team", items: "Teams, Slack, WhatsApp, SMS, ein Anruf" },
				],
			},
			integrations: {
				heading: "Womit arbeitet Mandy noch?",
				text: (count) => `Mandy verbindet sich über Activepieces, einen offenen Katalog mit ${count} Apps, und mit jedem System, das eine REST-API oder einen Webhook hat.`,
				groups: {
					erp: "ERP und Planung",
					service: "Tickets und Service",
					messaging: "Nachrichten",
					documents: "Dokumente",
					data: "Daten",
				},
				more: "und Hunderte mehr",
			},
			runs: {
				heading: "Wo läuft Mandy?",
				options: [
					{ name: "EU-Cloud", text: "In der EU gehostet, ausgelegt für DSGVO und IT-Prüfungen." },
					{ name: "Ihre Server", text: "Im eigenen Rechenzentrum, in Ihrem Netz." },
					{ name: "Offline", text: "Für Werke ohne Internet. Funklöcher werden später abgeglichen." },
				],
			},
			pilot: {
				heading: "Wie fangen wir an?",
				week: "Woche",
				phases: [
					{ name: "Planen", from: 0, to: 0, what: "Ein Anwendungsfall, 5 bis 12 Leute" },
					{ name: "Einrichten", from: 1, to: 1, what: "Dokumente geladen, Systeme angebunden" },
					{ name: "Im Einsatz", from: 2, to: 13, what: "Ihr Team nutzt Mandy jeden Tag" },
					{ name: "Entscheiden", from: 14, to: 14, what: "Eingesparte Zeit, gemessen" },
				],
			},
			faq: {
				heading: "Häufige Fragen",
				items: [
					{ q: "Funktioniert Mandy ohne Internet?", a: "Ja. Mandy läuft auf Ihren eigenen Servern oder komplett offline." },
					{ q: "Ist Sprache immer die richtige Bedienung?", a: "Nein. Was jemand oft fragt, wird zur Ein-Tipp-Taste auf seinem Gerät, mit den Angaben vom letzten Mal schon ausgefüllt." },
					{ q: "Was ist der Unterschied zu Pick-by-Voice?", a: "Pick-by-Voice folgt einem festen Ablauf. Mandy beantwortet offene Fragen und bucht in Ihren Systemen." },
					{ q: "Was, wenn Mandy etwas nicht weiß?", a: "Sie sagt es und holt einen Menschen dazu, wenn das Standardvorgehen den Fall nicht abdeckt." },
					{ q: "Ist das Mikrofon immer an?", a: "Nein. Am Handschuh hört Mandy nur, solange die Taste gedrückt ist; am Smartphone und im Browser nur während eines Gesprächs, das die Person selbst startet, und es lässt sich stummschalten." },
					{ q: "Was ist mit Handschuhen und lauten Hallen?", a: "Der Handschuh-Scanner funktioniert mit Handschuhen, eine Geräuschfilterung hält die Halle aus dem Mikrofon, und häufige Anfragen sind einen Tipp entfernt." },
				],
			},
		},
		verticals: {
			warehouse: {
				name: "Lager",
				slug: "lager",
				seo: {
					title: "Sprach-KI für Lager und Kontraktlogistik",
					description: "Die SOP jedes Kunden direkt am Regal, in der Sprache jeder Person. Mandy macht Leihkräfte schneller selbstständig und bucht Umlagerungen im WMS.",
				},
				headline: ["Die Regeln jedes Kunden,", "in der Sprache jeder Person."],
				does: [
					{ verb: "know", text: "Die SOP jedes Kunden, am Regal." },
					{ verb: "act", text: "Nachschub und Umlagerungen im WMS." },
					{ verb: "record", text: "Umpacken und Reinigen per Sprache erfasst." },
				],
				gain: "Weniger Wege zur Schichtleitung, weniger SLA-Verstöße.",
				card: {
					question: "Wie hilft Mandy im Lager?",
					answer: "In der Kontraktlogistik gilt für jeden Kunden eine andere SOP, oft mit Leihkräften, die diese Woche angefangen haben. Mandy antwortet am Regal aus den Dokumenten des richtigen Kunden, in der Sprache der Person, bucht das Ergebnis im WMS und erfasst die indirekte Arbeit, die kein WMS sieht.",
					story: {
						meaning: "Der Kunde will Geschenkverpackung, aber auf dem Label fehlt der Code. Was mache ich?",
						answer: "SOP von Kunde B: einpacken und am Packplatz 3 den Code GW1 setzen.",
						lands: "Beantwortet aus der SOP von Kunde B, erfasst",
					},
					result: "Weniger Wege zur Schichtleitung.",
				},
				voices: {
					picker: [
						{ ask: "Kunde B will Geschenkverpackung, aber es gibt keinen Code. Was jetzt?", answer: "Einpacken und am Packplatz 3 GW1 setzen. So steht es in der SOP von Kunde B.", lang: "uk" },
						{ ask: "Nachschub für B14, zwei Kartons.", answer: "Gebucht: zwei Kartons nach B14, um 10:40 da." },
					],
					receiver: [
						{ ask: "Palette 4 ist beschädigt, zwei Kartons eingedrückt.", answer: "Foto abgelegt und eine Wareneingangsabweichung für Kunde A eröffnet.", lang: "ro" },
					],
					replenisher: [
						{ ask: "Rest der Palette in Zone C umlagern.", answer: "Umlagerung nach C-03 gebucht. Scann den Platz zur Bestätigung." },
					],
					driver: [
						{ ask: "Beinahe-Unfall an Tor 3, ein Stapler kam ohne Sicht um die Ecke.", answer: "Beinahe-Unfall mit Zeit und Ort erfasst. Die Arbeitssicherheit hat es." },
					],
				},
			},
			manufacturing: {
				name: "Produktion",
				slug: "produktion",
				seo: {
					title: "Sprach-KI für Produktion und Montage",
					description: "Arbeitsanweisungen für die richtige Variante, Fehlteile mit Teilenummer und Station an die Logistik, Schichtübergaben in jeder Sprache. Kürzere Bandstopps.",
				},
				headline: ["Kürzere Bandstopps,", "beim ersten Mal richtig."],
				does: [
					{ verb: "know", text: "Das Standardvorgehen bei Schaden oder Fehlteil." },
					{ verb: "talk", text: "Fehlteile an die Logistik, mit Teilenummer." },
					{ verb: "record", text: "Schichtübergaben, gesprochen und übersetzt." },
				],
				gain: "Weniger Warten am Andon, weniger Nacharbeit.",
				card: {
					question: "Wie hilft Mandy in der Produktion?",
					answer: "Ist ein Teil beschädigt, fehlt es oder liegt es im falschen Fach, sucht der Werker einen Key User, obwohl meist das Standardvorgehen greift. Mandy führt in seiner Sprache durch, informiert die Logistik und holt nur dann einen Menschen dazu, wenn der Standardweg nicht passt.",
					story: {
						meaning: "Das Teil ist beschädigt. Was mache ich?",
						answer: "Leg es in den Servicebereich und nimm das nächste aus Fach 4. Die Logistik hat die Teilenummer.",
						lands: "Ausnahme erfasst, Logistik informiert",
					},
					result: "Weniger Wege zum Key User.",
				},
				voices: {
					lineA: [
						{ ask: "Am Kitting sind nur noch drei Kabelbäume.", answer: "Die Logistik hat Teil 4471-B und deine Station. Routenzug in 8 Minuten." },
						{ ask: "Der Schrauber zeigt Fehler E-47.", answer: "Die Nuss sitzt nicht richtig. Neu aufsetzen und Schraube 3 nachziehen." },
					],
					lineB: [
						{ ask: "Notiz für die nächste Schicht: Der Etikettierer an Linie 2 setzt aus.", answer: "In der Übergabe, auf Deutsch und Polnisch.", lang: "pl" },
					],
					tugger: [
						{ ask: "Welche Station braucht als Nächstes Material?", answer: "Linie B, Station 5: Türclips, in 12 Minuten." },
					],
				},
			},
			parcel: {
				name: "Paket",
				slug: "paket",
				seo: {
					title: "Sprach-KI für Paket- und Postzentren",
					description: "Saisonkräfte klären No-Reads, beschädigte und sperrige Sendungen per Sprache, und die Verladung prüft den Cut-off, ohne das Band zu verlassen.",
				},
				headline: ["Sonderfälle direkt am Band,", "Lkw pünktlich raus."],
				does: [
					{ verb: "know", text: "No-Read, Schaden, Sperrgut: was tun." },
					{ verb: "talk", text: "Hilfe, ohne nach dem Funkgerät zu suchen." },
					{ verb: "act", text: "Störungen mit Ort und Foto gemeldet." },
				],
				gain: "Weniger Fehlsortierungen, Abfahrten zum Cut-off.",
				card: {
					question: "Wie hilft Mandy im Paketzentrum?",
					answer: "In der Peak-Saison stehen Tausende Saisonkräfte an einem Sorter, der nicht wartet. Mandy sagt ihnen, was mit einem No-Read, einem zerrissenen Label oder einer sperrigen Sendung passiert, ohne dass sie das Band verlassen oder eine Schichtleitung suchen.",
					story: {
						meaning: "Das Label ist zerrissen, die halbe Postleitzahl fehlt. Wohin damit?",
						answer: "Klärplatz 2. Dort scannen und ein Foto anhängen.",
						lands: "Als No-Read mit Scan und Foto erfasst",
					},
					result: "Abfahrten zum Cut-off.",
				},
				voices: {
					sorter: [
						{ ask: "Dieses Paket hat kein Label.", answer: "Klärplatz 2. Scan und Foto sind erfasst." },
						{ ask: "Der Rollwagen an Rutsche 9 ist voll.", answer: "Tausch angefordert. Ein leerer Wagen ist unterwegs." },
					],
					packer: [
						{ ask: "Ist noch was für den 20-Uhr-Hauptlauf übrig?", answer: "Zwei Rollwagen oben. Sie kommen gerade runter.", lang: "de" },
					],
					driver: [
						{ ask: "Tor 3 geht nicht zu.", answer: "Wartungsauftrag mit Tor und Foto angelegt." },
					],
				},
			},
			ecommerce: {
				name: "E-Commerce",
				slug: "e-commerce",
				seo: {
					title: "Sprach-KI für E-Commerce-Fulfillment",
					description: "Fehlmengen und Verpackungsfragen direkt am Platz geklärt, Nachschub per Sprache gebucht, und Bestellungen schaffen auch in der Peak-Saison den Cut-off.",
				},
				headline: ["Peak-Personal produktiv,", "Bestellungen vor dem Cut-off raus."],
				does: [
					{ verb: "act", text: "Fehlmenge, voller Behälter, kein Barcode: gesagt, nicht getippt." },
					{ verb: "learn", text: "Neue Kommissionierer fragen, statt zu raten." },
					{ verb: "know", text: "Der richtige Karton für jede SKU." },
				],
				gain: "Weniger Fehlpicks, Versand am selben Tag gehalten.",
				card: {
					question: "Wie hilft Mandy im E-Commerce-Fulfillment?",
					answer: "In der Peak-Saison treffen Hunderte neue Kommissionierer auf Artikel, die sie nie gesehen haben, und jede Ausnahme heißt: Formular am Handgerät. Mandy nimmt die Ausnahme per Sprache auf, bucht Nachschub, wenn ein Fach leer ist, und die Bestellung schafft trotzdem den Cut-off.",
					story: {
						meaning: "Das Fach für die SKU mit Endung 4471 ist leer. Kannst du Nachschub buchen?",
						answer: "Nachschub aus Reserve R-12 gebucht. Bis dahin aus 07-B picken.",
						lands: "Nachschub im WMS gebucht",
					},
					result: "Bestellungen, die den Cut-off schaffen.",
				},
				voices: {
					newcomer: [
						{ ask: "Mein erster Tag. Wie packe ich Glas?", answer: "Zweimal einwickeln, Karton M und ein Zerbrechlich-Etikett.", lang: "bg" },
						{ ask: "Ich fange in Gang 7 mit dem Umpacken an.", answer: "Erfasst um 14:02, Gang 7." },
					],
					packer: [
						{ ask: "Welcher Karton für Auftrag 8840?", answer: "Größe M mit Polster. Ein Artikel ist aus Glas." },
					],
					picker: [
						{ ask: "Fach leer für SKU 4471.", answer: "Nachschub gebucht. Bis dahin aus 07-B picken." },
						{ ask: "Behälter ist voll, Artikel noch in der Hand.", answer: "Neuer Behälter 2231 zugewiesen. Dort ablegen und scannen." },
					],
					driver: [
						{ ask: "Wo werde ich für die 15-Uhr-Welle gebraucht?", answer: "Packplatz 4. Dort geht gerade jemand in die Pause." },
					],
				},
			},
			grocery: {
				name: "Lebensmittel",
				slug: "lebensmittel",
				seo: {
					title: "Sprach-KI für Lebensmittelhandel und Dark Stores",
					description: "Lücken direkt aus dem Gang gemeldet und nachbestellt, der richtige Ersatzartikel beim Picken und Temperaturkontrollen mit Zeitstempel.",
				},
				headline: ["Volle Regale, der richtige Ersatz,", "Frische pünktlich."],
				does: [
					{ verb: "act", text: "Fehlartikel gemeldet, ohne Weg zum Terminal." },
					{ verb: "know", text: "Ersatzregeln beim Picken." },
					{ verb: "record", text: "Temperaturkontrollen mit Zeitstempel." },
				],
				gain: "Bessere Verfügbarkeit, weniger Abschriften.",
				card: {
					question: "Wie hilft Mandy im Lebensmittelhandel?",
					answer: "Im Lebensmittellager oder im Markt heißt ein fehlender Artikel oder ein zu warmes Kühlregal meist: zurück ins Büro, manchmal mit jemandem, der übersetzt. Mandy gibt gleich beim ersten Mal den richtigen Schritt, in der Sprache der Person, und erfasst ihn sofort.",
					story: {
						meaning: "Das Kühlregal in Gang 3 zeigt 9 Grad. Ich erfasse es, wen rufe ich an?",
						answer: "Erfasst um 09:12. Molkereiprodukte in die Kühlzelle hinten; die Marktleitung kommt.",
						lands: "Temperaturkontrolle erfasst, Marktleitung informiert",
					},
					result: "Weniger Lücken, weniger Abschriften.",
				},
				voices: {
					shelves: [
						{ ask: "Das Haferdrink-Regal ist fast leer.", answer: "Zwei Kisten bestellt. Sie stehen im Lager." },
						{ ask: "Nudeln 500\u00a0g sind aus. Was nehme ich als Ersatz?", answer: "Vollkorn, gleiche Größe. Diese Kundin erlaubt Ersatz." },
					],
					fridges: [
						{ ask: "Kühlregal sechs hat sieben Grad.", answer: "Erfasst. Bring den Joghurt in die Kühlzelle hinten.", lang: "tr" },
					],
					floor: [
						{ ask: "In Gang 3 ist was ausgelaufen.", answer: "Die Reinigung kommt. Stell bitte das Warnschild auf." },
					],
				},
			},
			fashion: {
				name: "Mode",
				slug: "mode",
				seo: {
					title: "Sprach-KI für Retouren und Resale in der Mode",
					description: "Alle bewerten Retouren nach derselben Vorgabe der Marke, jede Entscheidung mit Foto belegt, und die Ware ist schneller wieder im Bestand.",
				},
				headline: ["Retouren einheitlich bewertet,", "schneller wieder im Bestand."],
				does: [
					{ verb: "know", text: "Die Bewertungsvorgabe der Marke, jedes Mal." },
					{ verb: "record", text: "Ein Foto als Beleg für jede Entscheidung." },
					{ verb: "learn", text: "Wiederkehrende Mängel landen bei der Qualität." },
				],
				gain: "Mehr A-Ware zurück im Bestand.",
				card: {
					question: "Wie hilft Mandy bei Mode-Retouren?",
					answer: "Ob ein Fleck B- oder C-Ware bedeutet, hängt davon ab, wer prüft. Mandy gibt allen die Vorgabe der Marke und legt ein Foto als Beleg für die Entscheidung ab, was zählt, seit die EU die Vernichtung unverkaufter Kleidung verbietet.",
					story: {
						meaning: "Die Naht zieht leicht, keine Etiketten. Wiederverkauf oder Aufbereitung?",
						answer: "Aufbereitung: neu etikettieren und dämpfen. Laut Vorgabe B-Ware.",
						lands: "Bewertung und Foto an der Retoure erfasst",
					},
					result: "Einheitliche Bewertungen, schneller zurück im Bestand.",
				},
				voices: {
					grader: [
						{ ask: "Naht ist offen. Wiederverkaufen oder reparieren?", answer: "Reparieren. Das kostet unter zwei Euro." },
						{ ask: "Fleck am Ärmel, ich mache ein Foto.", answer: "An der Retoure. Klasse C, Outlet." },
					],
					checker: [
						{ ask: "Wie prüfe ich, ob das Label echt ist?", answer: "Schau dir Nähte, Pflegeetikett und Code am Anhänger an.", lang: "vi" },
					],
					returns: [
						{ ask: "Diese Retoure hat kein Label.", answer: "Über den Lieferschein zugeordnet und erfasst." },
					],
				},
			},
			pharma: {
				name: "Pharma",
				slug: "pharma",
				seo: {
					title: "Sprach-KI für GDP-Pharmalager",
					description: "Der aktuell freigegebene SOP-Schritt per Sprache, Temperaturabweichungen und Abweichungen sofort erfasst, mit Audit-Trail an die verantwortliche Person.",
				},
				headline: ["Beim ersten Mal richtig,", "mit Audit-Trail."],
				does: [
					{ verb: "know", text: "Der aktuelle SOP-Schritt, per Sprache." },
					{ verb: "record", text: "Abweichungen sofort erfasst." },
					{ verb: "talk", text: "Temperaturabweichungen an die RP." },
				],
				gain: "Weniger Befunde, schnellerer Abschluss von Abweichungen.",
				card: {
					question: "Wie hilft Mandy im Pharmalager?",
					answer: "Unter GDP braucht jeder Schritt einen Nachweis, und eine Abweichung, die liegen bleibt, wird zum Befund. Mandy liest den aktuell freigegebenen SOP-Schritt vor und erfasst eine Temperatur- oder sonstige Abweichung sofort, mit Zeitstempel und an die verantwortliche Person geleitet: Mandy erfasst und leitet weiter, Menschen entscheiden.",
					story: {
						meaning: "Der Logger an diesem Behälter zeigt 9,2 Grad. In Quarantäne?",
						answer: "Ja, in Quarantäne Q2. Die Abweichung ist eröffnet, die RP ist informiert.",
						lands: "Abweichung mit Zeitstempel erfasst, RP informiert",
					},
					result: "Auditfähige Nachweise, ohne zu tippen.",
				},
				voices: {
					picker: [
						{ ask: "Ist Charge 24-117 freigegeben?", answer: "Noch nicht. Die QA gibt sie um 14 Uhr frei." },
						{ ask: "Kühlketten-Checkliste starten.", answer: "Schritt 1: Ist der Datenlogger angebracht und läuft er?" },
					],
					verifier: [
						{ ask: "Diese Seriennummer lässt sich nicht verifizieren.", answer: "Als verdächtig behandeln: Einheit in Quarantäne. Die QA hat es." },
					],
					coldRoom: [
						{ ask: "Die Kühlraumtür war fünf Minuten offen.", answer: "Abweichung mit Uhrzeit erfasst. Die RP hat es.", lang: "pl" },
					],
				},
			},
			aviation: {
				name: "Luftfahrt",
				slug: "luftfahrt",
				seo: {
					title: "Sprach-KI für Bodenabfertigung und Flugzeugwartung",
					description: "Fahrer gerufen und beschädigte Koffer per Sprache gemeldet auf dem Vorfeld, AMM- und IPC-Referenzen und Übergaben im Hangar. Unterschreiben tut weiter der freigabeberechtigte Techniker.",
				},
				headline: ["Auf dem Vorfeld und im Hangar,", "nichts wartet aufs Büro."],
				does: [
					{ verb: "talk", text: "Fahrer für den vollen Container, ohne zweite App." },
					{ verb: "record", text: "Beschädigte Koffer dort gemeldet, wo sie auffallen." },
					{ verb: "know", text: "AMM- und IPC-Referenzen, freihändig." },
				],
				gain: "Umsteigegepäck im richtigen Flug, Taskcards im Protokoll.",
				card: {
					question: "Wie hilft Mandy in der Luftfahrt?",
					answer: "Auf dem Vorfeld bleiben die Handschuhe an und das Handy weg, und trotzdem heißt einen Fahrer für den vollen Container rufen oder einen beschädigten Koffer melden: zweite App oder Weg ins Büro. Mandy nimmt beides per Sprache auf, in der Sprache der Person. Im Hangar findet Mandy die AMM- oder IPC-Referenz und nimmt die Übergabe auf; unterschreiben tut weiter der freigabeberechtigte Techniker.",
					story: {
						meaning: "Der Container für den 14:20 nach Madrid ist voll. Ich brauche einen Fahrer.",
						answer: "Fahrer angefordert. Schlepper 7 ist in 4 Minuten an deiner Position.",
						lands: "Anforderung an die Vorfelddisposition",
					},
					result: "Nichts wartet aufs Büro.",
				},
				voices: {
					ramp: [
						{ ask: "Beschädigter Koffer auf Band 3, Griff abgerissen.", answer: "Mit Foto und Anhängernummer erfasst. Der Gepäckservice hat es." },
						{ ask: "Bandlader hat an Position 14 angestoßen, kleine Delle an der hinteren Frachttür.", answer: "Vorfall mit Foto erfasst. Wartung und Dienstleitung haben es." },
					],
					mechanic: [
						{ ask: "Drehmoment für den Verschluss der Triebwerksverkleidung?", answer: "12\u00a0Nm laut AMM-Task. Erfasst." },
						{ ask: "Hydraulikleck am linken Hauptfahrwerk.", answer: "Mangel mit Foto gemeldet. Die Wartung ist unterwegs." },
					],
					tug: [
						{ ask: "Ist Position 14 frei zum Pushback?", answer: "Noch nicht. Das Catering gibt die hintere Tür in 2 Minuten frei." },
					],
				},
			},
		},
	},
};
