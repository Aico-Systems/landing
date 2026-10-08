import type { Messages } from "./types";

export const de: Messages = {
	site: {
		title: "Mandy",
		description:
			"Mandy beantwortet Fragen aus Lager und Produktion in der Sprache der Mitarbeitenden. Einmal auf den Handschuh drücken, fragen, weiterarbeiten.",
		brand: "Mandy",
		tagline: "Einmal drücken und fragen, in der eigenen Sprache.",
		demo: "Demo vereinbaren",
	},
	home: {
		stage: (vertical) => `${vertical}: Menschen bei der Arbeit, die Mandy nebenbei fragen`,
		industries: "Branchen",
		askedIn: (language) => `Auf ${language} gefragt`,
		verbs: { know: "Wissen", act: "Handeln", talk: "Abstimmen", record: "Erfassen", learn: "Lernen" },
		verticals: {
			warehouse: {
				name: "Lager",
				headline: ["Antworten am Regal,", "in jeder Sprache."],
				does: [
					{ verb: "learn", text: "Die Abläufe jedes Kunden, ab Tag eins." },
					{ verb: "know", text: "Pack- und Etikettierregeln je Kunde." },
					{ verb: "act", text: "Umlagerungen per Sprache gebucht." },
				],
				gain: "Produktiv ab der ersten Schicht.",
				voices: {
					picker: [
						{ ask: "Wie will Kunde B diese Palette etikettiert haben?", answer: "Zwei Etiketten auf gegenüberliegenden Seiten, höchstens 1,8 m hoch.", lang: "uk" },
						{ ask: "Nachschub für B14, zwei Kartons.", answer: "Gebucht: zwei Kartons nach B14, um 10:40 da." },
					],
					receiver: [{ ask: "Palette 4 ist beschädigt, zwei Kartons eingedrückt.", answer: "Foto abgelegt, deine Teamleitung weiß Bescheid.", lang: "ro" }],
					replenisher: [{ ask: "Rest der Palette in Zone C umlagern.", answer: "Umlagerung nach C-03 gebucht. Scann den Platz zur Bestätigung." }],
					driver: [{ ask: "Beinahe-Unfall an Tor 3, ein Stapler kam ohne Sicht um die Ecke.", answer: "Mit Zeit und Ort erfasst. Die Arbeitssicherheit hat es." }],
				},
			},
			manufacturing: {
				name: "Produktion",
				headline: ["Die Linie läuft weiter,", "auch wenn Teile knapp werden."],
				does: [
					{ verb: "talk", text: "Fehlteile gehen direkt an die Logistik." },
					{ verb: "know", text: "Fehlercodes und Rüstschritte." },
					{ verb: "record", text: "Schichtübergabe einmal gesagt, übersetzt." },
				],
				gain: "Weniger Linienstopps, und Meister betreuen mehr Fläche.",
				voices: {
					lineA: [
						{ ask: "Am Kitting sind nur noch drei Kabelbäume.", answer: "Die Logistik hat die Teilenummer. Der Routenzug kommt in 8 Minuten." },
						{ ask: "Der Schrauber zeigt Fehler E-47.", answer: "Die Nuss sitzt nicht richtig. Neu aufsetzen und Schraube 3 nachziehen." },
					],
					lineB: [{ ask: "Notiz für die nächste Schicht: Der Etikettierer setzt aus.", answer: "In der Übergabe, auf Deutsch und Polnisch.", lang: "pl" }],
					tugger: [{ ask: "Welche Station braucht als Nächstes Material?", answer: "Linie B, Station 5: Türclips, in 12 Minuten." }],
				},
			},
			parcel: {
				name: "Paket",
				headline: ["Sonderfälle am Sorter gelöst,", "Lkw fahren voll los."],
				does: [
					{ verb: "know", text: "Was bei Übermaß, Schaden, fehlendem Label gilt." },
					{ verb: "talk", text: "Sortier- und Verladeteams auf einem Kanal." },
					{ verb: "act", text: "Defekte Bänder mit Ort und Foto gemeldet." },
				],
				gain: "Vollere Lkw und eine leere Halle zum Schichtende.",
				voices: {
					sorter: [
						{ ask: "Dieses Paket hat kein Label.", answer: "Bring es zum Klärplatz. Scan und Foto sind erfasst." },
						{ ask: "Der Rollwagen an Rutsche 9 ist voll.", answer: "Tausch angefordert. Ein leerer Wagen ist unterwegs." },
					],
					packer: [{ ask: "Ist noch was für die 20-Uhr-Tour übrig?", answer: "Zwei Rollwagen oben. Die Packerei schickt sie runter.", lang: "de" }],
					driver: [{ ask: "Tor 3 geht nicht zu.", answer: "Wartungsauftrag mit Tor und Foto angelegt." }],
				},
			},
			ecommerce: {
				name: "E-Commerce",
				headline: ["Saisonkräfte,", "produktiv ab der ersten Stunde."],
				does: [
					{ verb: "learn", text: "Neue Kommissionierer fragen direkt am Platz." },
					{ verb: "know", text: "Karton- und Verpackungsregeln je Artikel." },
					{ verb: "record", text: "Nacharbeit und Reinigung sofort erfasst." },
				],
				gain: "Peak-Teams in wenigen Stunden eingearbeitet.",
				voices: {
					newcomer: [
						{ ask: "Mein erster Tag. Wie packe ich Glas?", answer: "Zweimal einwickeln, Karton M und ein Zerbrechlich-Etikett.", lang: "bg" },
						{ ask: "Ich fange in Gang 7 mit dem Umpacken an.", answer: "Erfasst um 14:02, Gang 7." },
					],
					packer: [{ ask: "Welcher Karton für Auftrag 8840?", answer: "Größe M mit Polster. Ein Artikel ist aus Glas." }],
					picker: [{ ask: "In Behälter 118 fehlt ein Artikel.", answer: "Gemeldet. Eine Nachkommissionierung ist eingeplant." }],
					driver: [{ ask: "Wo werde ich für die 15-Uhr-Welle gebraucht?", answer: "Packplatz 4. Dort geht gerade jemand in die Pause." }],
				},
			},
			grocery: {
				name: "Lebensmittel",
				headline: ["Volle Regale, vollständige Bestellungen,", "gesteuert aus dem Gang."],
				does: [
					{ verb: "act", text: "Leeres Regal gesehen, Nachschub bestellt." },
					{ verb: "know", text: "Ersatzartikel und Auftragsstatus beim Picken." },
					{ verb: "record", text: "Kühltemperaturen mit Zeitstempel." },
				],
				gain: "Weniger Lücken im Regal und in den Bestellungen.",
				voices: {
					shelves: [
						{ ask: "Das Haferdrink-Regal ist fast leer.", answer: "Zwei Kisten bestellt. Sie stehen im Lager." },
						{ ask: "Nudeln 500 g sind aus.", answer: "Ersatz freigegeben: Vollkorn, gleiche Größe." },
					],
					fridges: [{ ask: "Kühlregal sechs hat sieben Grad.", answer: "Erfasst. Bring den Joghurt in die Kühlzelle hinten.", lang: "tr" }],
					floor: [{ ask: "In Gang 3 ist was ausgelaufen.", answer: "Die Reinigung kommt. Stell bitte das Warnschild auf." }],
				},
			},
			fashion: {
				name: "Mode",
				headline: ["Retouren einheitlich bewertet,", "schneller wieder im Verkauf."],
				does: [
					{ verb: "know", text: "Bewertungsregeln je Marke und Material." },
					{ verb: "record", text: "Schadensfotos hängen an der Retoure." },
					{ verb: "learn", text: "Der Einkauf sieht, welche Mängel wiederkehren." },
				],
				gain: "Mehr Wiederverkaufswert in jeder Schicht.",
				voices: {
					grader: [
						{ ask: "Naht ist offen. Wiederverkaufen oder reparieren?", answer: "Reparieren. Das kostet unter zwei Euro." },
						{ ask: "Fleck am Ärmel, ich mache ein Foto.", answer: "An der Retoure. Klasse C, Outlet." },
					],
					checker: [{ ask: "Wie prüfe ich, ob das Label echt ist?", answer: "Schau dir Nähte, Pflegeetikett und Code am Anhänger an.", lang: "vi" }],
					returns: [{ ask: "Diese Retoure hat kein Label.", answer: "Über den Lieferschein zugeordnet und erfasst." }],
				},
			},
			pharma: {
				name: "Pharma",
				headline: ["GMP-Dokumentation,", "freihändig."],
				does: [
					{ verb: "record", text: "Jeder Schritt erfasst: wer, wann, wo." },
					{ verb: "know", text: "Chargenstatus und die SOP zu jedem Schritt." },
					{ verb: "talk", text: "Abweichungen gehen sofort an die QA." },
				],
				gain: "Auditfähig ohne Tastatur.",
				voices: {
					picker: [
						{ ask: "Ist Charge 24-117 freigegeben?", answer: "Noch nicht. Die QA gibt sie um 14 Uhr frei." },
						{ ask: "Kühlketten-Checkliste starten.", answer: "Schritt 1: Ist der Datenlogger angebracht und läuft er?" },
					],
					verifier: [{ ask: "Diese Seriennummer lässt sich nicht verifizieren.", answer: "Stell die Einheit in Quarantäne. Die QA hat es." }],
					coldRoom: [{ ask: "Die Kühlraumtür war fünf Minuten offen.", answer: "Abweichung mit Uhrzeit erfasst. Die QA hat es.", lang: "pl" }],
				},
			},
			aviation: {
				name: "Luftfahrt",
				headline: ["Mehr Zeit am Flugzeug,", "weniger mit Papierkram."],
				does: [
					{ verb: "know", text: "Taskcards und Drehmomente, freihändig." },
					{ verb: "record", text: "Mängel mit Foto und Position erfasst." },
					{ verb: "talk", text: "Vorfeld, Catering und Wartung abgestimmt." },
				],
				gain: "Turnarounds bleiben im Plan.",
				voices: {
					ramp: [{ ask: "Auf Wagen 3 ist ein Koffer ohne Anhänger.", answer: "Foto abgelegt. Der Gepäckservice weiß Bescheid." }],
					mechanic: [
						{ ask: "Drehmoment für den Verschluss der Triebwerksverkleidung?", answer: "12 Nm laut Taskcard. Erfasst." },
						{ ask: "Hydraulikleck am linken Hauptfahrwerk.", answer: "Mangel mit Foto gemeldet. Die Wartung ist unterwegs." },
					],
					tug: [{ ask: "Ist Position 14 frei zum Pushback?", answer: "Noch nicht. Das Catering gibt die hintere Tür in 2 Minuten frei." }],
				},
			},
		},
	},
};
