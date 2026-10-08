import type { Messages } from "./types";

export const de: Messages = {
	site: {
		brand: "Mandy",
		tagline: "Einmal drücken und fragen, in der eigenen Sprache.",
		demo: "Demo vereinbaren",
		updated: (date) => `Stand: ${date}`,
		seo: {
			title: "KI-Sprachassistent für die Fläche",
			description:
				"Mandy ist ein Sprachassistent auf dem ProGlove MAI Handschuh. Mitarbeitende in Lager und Produktion fragen in ihrer Sprache und bekommen Antworten aus Ihren SOPs und Systemen.",
		},
		language: "Deutsch",
	},
	gateway: {
		intro:
			"Mandy ist ein Sprachassistent für Mitarbeitende in Lager und Produktion. Sie drücken einmal auf den MAI Handschuh, fragen in ihrer Sprache, und Mandy antwortet aus den Dokumenten und Systemen des Standorts.",
		enter: "Weiter auf Deutsch",
	},
	home: {
		stage: (vertical) => `${vertical}: Menschen bei der Arbeit, die Mandy nebenbei fragen`,
		industries: "Branchen",
		askedIn: (language) => `Auf ${language} gefragt`,
		about: "Was ist Mandy?",
		replay: "Noch einmal abspielen",
		close: "Schließen",
		heardIn: (language) => `Auf ${language} gesagt`,
		verbs: { know: "Wissen", act: "Handeln", talk: "Abstimmen", record: "Erfassen", learn: "Lernen" },
		mandy: {
			question: "Was ist Mandy?",
			answer: "Mandy ist ein Sprachassistent f\u00fcr Lager und Produktion. Einmal auf den Handschuh dr\u00fccken, in der eigenen Sprache fragen, und die Antwort kommt aus Ihren SOPs und Systemen.",
			why: { heading: "Warum sind Ausnahmen so teuer?", text: "Ein fehlendes Teil oder ein unklarer Schritt kostet eine Person 3 bis 15 Minuten, drei- bis f\u00fcnfmal pro Schicht. Die Antwort steht oft irgendwo geschrieben. Auf der Fl\u00e4che hat niemand Zeit, sie nachzuschlagen." },
			flow: {
				heading: "Welche Sprachen spricht Mandy?",
				steps: [
					{ who: "Mitarbeiter", text: "Sagt es auf Ukrainisch, die H\u00e4nde noch an der Palette." },
					{ who: "Mandy", text: "\u00dcbersetzt und h\u00e4ngt Scan, Station und Foto an." },
					{ who: "Teamleitung", text: "Liest es auf Deutsch in Teams und antwortet mit einem Tipp." },
					{ who: "Mitarbeiter", text: "H\u00f6rt die Antwort auf Ukrainisch." },
				],
			},
			verbs: {
				heading: "Was kann Mandy?",
				items: {
					know: { text: "Antwortet aus Ihren SOPs und Systemen und sagt, wenn sie etwas nicht wei\u00df.", says: "Wie packe ich die Retouren f\u00fcr Tour 12?" },
					act: { text: "Bucht Nachschub, Umlagerungen und Tickets und liest jede Buchung vorher vor.", says: "Nachschub f\u00fcr B14, zwei Kartons." },
					talk: { text: "Bringt die Nachricht \u00fcbersetzt zur richtigen Person.", says: "Kitting braucht Kabelb\u00e4ume, noch drei da." },
					record: { text: "Erfasst Aufgaben, Fotos und Beinahe-Unf\u00e4lle mit Zeit und Ort.", says: "Fange mit dem Umpacken in Gang 7 an." },
					learn: { text: "Arbeitet neue Leute ein und zeigt, wo es auf der Fl\u00e4che hakt.", says: "Erster Tag. Wohin kommen die leeren Beh\u00e4lter?" },
				},
			},
			systems: {
				heading: "Mit welchen Systemen arbeitet Mandy?",
				text: "Mandy liest aus dem, was Sie schon haben, und schreibt dorthin zur\u00fcck. Neu kaufen m\u00fcssen Sie nichts.",
				groups: [
					{ name: "Ihre Dokumente", items: "SharePoint, SOPs, Handb\u00fccher, Packvorgaben" },
					{ name: "Ihre Systeme", items: "SAP, WMS, ServiceNow, Jira, Zendesk" },
					{ name: "Ihr Team", items: "Teams, Slack, WhatsApp, SMS, ein Anruf" },
				],
			},
			runs: { heading: "Wo l\u00e4uft Mandy?", text: "In der EU-Cloud, auf Ihren eigenen Servern oder komplett offline f\u00fcr Werke ohne Internet. Ausgelegt f\u00fcr DSGVO und IT-Sicherheitspr\u00fcfungen." },
			pilot: {
				heading: "Wie fangen wir an?",
				steps: [
					{ when: "Woche 0", what: "Einen Anwendungsfall und 5 bis 12 Leute ausw\u00e4hlen." },
					{ when: "Woche 1", what: "Wir laden Ihre SOPs und binden Ihre Systeme an." },
					{ when: "Woche 2\u201313", what: "Ihr Team nutzt Mandy jeden Tag." },
					{ when: "Woche 14", what: "Sie bekommen die eingesparte Zeit, gemessen." },
				],
			},
			faq: {
				heading: "H\u00e4ufige Fragen",
				items: [
					{ q: "Funktioniert Mandy ohne Internet?", a: "Ja. Mandy l\u00e4uft auf Ihren eigenen Servern oder komplett offline." },
					{ q: "Ist Sprache immer die richtige Bedienung?", a: "Nein. H\u00e4ufige Anfragen werden zu Ein-Tipp-Tasten auf dem Handschuh." },
					{ q: "Was ist der Unterschied zu Pick-by-Voice?", a: "Pick-by-Voice folgt einem festen Ablauf. Mandy beantwortet offene Fragen und bucht in Ihren Systemen." },
					{ q: "Was, wenn Mandy etwas nicht wei\u00df?", a: "Sie sagt es und holt einen Menschen dazu, wenn das Standardvorgehen den Fall nicht abdeckt." },
				],
			},
		},
		verticals: {
			warehouse: {
				name: "Lager",
				slug: "lager",
				seo: {
					title: "KI-Sprachassistent f\u00fcr Lager und Kontraktlogistik",
					description: "Mandy beantwortet Fragen direkt am Regal in der Sprache der Mitarbeitenden: Verpackungsregeln je Kunde, Nachschub und Umlagerungen per Sprache.",
				},
				headline: ["Antworten am Regal,", "in jeder Sprache."],
				does: [
					{ verb: "learn", text: "Die Abläufe jedes Kunden, ab Tag eins." },
					{ verb: "know", text: "Pack- und Etikettierregeln je Kunde." },
					{ verb: "act", text: "Umlagerungen per Sprache gebucht." },
				],
				gain: "Produktiv ab der ersten Schicht.",
				card: {
					question: "Wie hilft Mandy im Lager?",
					answer: "Jeder Kunde hat eigene Pack- und Etikettierregeln, und die halbe Schicht ist neu. Mandy antwortet direkt am Regal, in der Sprache jeder Person.",
					story: {
						meaning: "Wie will Kunde B diese Palette etikettiert haben?",
						answer: "Zwei Etiketten auf gegen\u00fcberliegenden Seiten, h\u00f6chstens 1,8 m hoch.",
						lands: "Beantwortet aus der SOP von Kunde B",
					},
					result: "Weniger Wege ins B\u00fcro.",
				},
				voices: {
					picker: [
						{ ask: "Wie will Kunde B diese Palette etikettiert haben?", answer: "Zwei Etiketten auf gegenüberliegenden Seiten, höchstens 1,8 m hoch.", lang: "uk" },
						{ ask: "Nachschub für B14, zwei Kartons.", answer: "Gebucht: zwei Kartons nach B14, um 10:40 da." },
					],
					receiver: [{ ask: "Palette 4 ist beschädigt, zwei Kartons eingedrückt.", answer: "Foto abgelegt, deine Teamleitung weiß Bescheid.", lang: "ro" }],
					replenisher: [{ ask: "Rest der Palette in Zone C umlagern.", answer: "Umlagerung nach C-03 gebucht. Scann den Platz zur Bestätigung." }],
					driver: [{ ask: "Beinahe-Unfall an Tor 3, ein Stapler kam ohne Sicht um die Ecke.", answer: "Mit Zeit und Ort erfasst. Die Arbeitssicherheit hat es." }],
				},
			},
			manufacturing: {
				name: "Produktion",
				slug: "produktion",
				seo: {
					title: "KI-Sprachassistent f\u00fcr Produktion und Montage",
					description: "Mandy meldet Fehlteile mit Teilenummer und Station an die Logistik, erkl\u00e4rt Fehlercodes und \u00fcbersetzt die Schicht\u00fcbergabe, freih\u00e4ndig an der Linie.",
				},
				headline: ["Die Linie läuft weiter,", "auch wenn Teile knapp werden."],
				does: [
					{ verb: "talk", text: "Fehlteile gehen direkt an die Logistik." },
					{ verb: "know", text: "Fehlercodes und Rüstschritte." },
					{ verb: "record", text: "Schichtübergabe einmal gesagt, übersetzt." },
				],
				gain: "Weniger Linienstopps, und Meister betreuen mehr Fläche.",
				card: {
					question: "Wie hilft Mandy in der Produktion?",
					answer: "Ein fehlendes Teil h\u00e4lt die Station an, und der Meister ist drei Bereiche weiter. Mandy schickt der Logistik Teilenummer und Station in einer Nachricht.",
					story: {
						meaning: "Am Kitting sind nur noch drei Kabelb\u00e4ume.",
						answer: "Die Logistik hat Teilenummer und Station. Der Routenzug kommt in 8 Minuten.",
						lands: "Nachricht an die Logistik, in Teams",
					},
					result: "Weniger Linienstopps.",
				},
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
				slug: "paket",
				seo: {
					title: "KI-Sprachassistent f\u00fcr Paket- und Postzentren",
					description: "Mandy sagt am Sorter, was mit Paketen ohne Label, besch\u00e4digten oder sperrigen Sendungen passiert, und verbindet Sortierung und Verladung.",
				},
				headline: ["Sonderfälle am Sorter gelöst,", "Lkw fahren voll los."],
				does: [
					{ verb: "know", text: "Was bei Übermaß, Schaden, fehlendem Label gilt." },
					{ verb: "talk", text: "Sortier- und Verladeteams auf einem Kanal." },
					{ verb: "act", text: "Defekte Bänder mit Ort und Foto gemeldet." },
				],
				gain: "Vollere Lkw und eine leere Halle zum Schichtende.",
				card: {
					question: "Wie hilft Mandy im Paketzentrum?",
					answer: "Der Sorter l\u00e4uft, bis ein Paket kein Label hat. Mandy sagt, was damit passiert, und erfasst Scan und Foto.",
					story: {
						meaning: "Dieses Paket hat kein Label.",
						answer: "Bring es zum Kl\u00e4rplatz. Scan und Foto sind erfasst.",
						lands: "Sonderfall mit Scan und Foto erfasst",
					},
					result: "Lkw fahren voll los.",
				},
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
				slug: "e-commerce",
				seo: {
					title: "KI-Sprachassistent f\u00fcr E-Commerce-Fulfillment",
					description: "Saisonkr\u00e4fte fragen Mandy, statt zu raten: welcher Karton, wie Glas verpackt wird, wohin ein Fehlpick geht. In ihrer eigenen Sprache.",
				},
				headline: ["Saisonkräfte,", "produktiv ab der ersten Stunde."],
				does: [
					{ verb: "learn", text: "Neue Kommissionierer fragen direkt am Platz." },
					{ verb: "know", text: "Karton- und Verpackungsregeln je Artikel." },
					{ verb: "record", text: "Nacharbeit und Reinigung sofort erfasst." },
				],
				gain: "Peak-Teams in wenigen Stunden eingearbeitet.",
				card: {
					question: "Wie hilft Mandy im E-Commerce-Fulfillment?",
					answer: "In der Hochsaison kommen Hunderte Leute, die den Standort nie gesehen haben. Mit Mandy fragen sie, statt zu raten.",
					story: {
						meaning: "Mein erster Tag. Wie packe ich Glas?",
						answer: "Zweimal einwickeln, Karton M und ein Zerbrechlich-Etikett.",
						lands: "Beantwortet aus den Verpackungsvorgaben",
					},
					result: "Neue Leute in Stunden eingearbeitet.",
				},
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
				slug: "lebensmittel",
				seo: {
					title: "KI-Sprachassistent f\u00fcr Lebensmittelhandel und Dark Stores",
					description: "Mitarbeitende bestellen Nachschub, sobald sie ein leeres Regal sehen, bekommen Ersatzartikel beim Picken und erfassen K\u00fchltemperaturen per Sprache.",
				},
				headline: ["Volle Regale, vollständige Bestellungen,", "gesteuert aus dem Gang."],
				does: [
					{ verb: "act", text: "Leeres Regal gesehen, Nachschub bestellt." },
					{ verb: "know", text: "Ersatzartikel und Auftragsstatus beim Picken." },
					{ verb: "record", text: "Kühltemperaturen mit Zeitstempel." },
				],
				gain: "Weniger Lücken im Regal und in den Bestellungen.",
				card: {
					question: "Wie hilft Mandy im Lebensmittelhandel?",
					answer: "Wer das leere Regal sieht, bestellt den Nachschub sofort. Kein Terminal, kein Zettel f\u00fcr sp\u00e4ter.",
					story: {
						meaning: "Das Haferdrink-Regal ist fast leer.",
						answer: "Zwei Kisten bestellt. Sie stehen im Lager.",
						lands: "Nachschubbestellung im Warenwirtschaftssystem",
					},
					result: "Weniger leere Regale.",
				},
				voices: {
					shelves: [
						{ ask: "Das Haferdrink-Regal ist fast leer.", answer: "Zwei Kisten bestellt. Sie stehen im Lager." },
						{ ask: "Nudeln 500 g sind aus.", answer: "Ersatz freigegeben: Vollkorn, gleiche Größe." },
					],
					fridges: [{ ask: "Kühlregal sechs hat sieben Grad.", answer: "Erfasst. Bring den Joghurt in die Kühlzelle hinten.", lang: "tr" }],
					floor: [{ ask: "In Gang 3 ist was ausgelaufen.", answer: "Die Reinigung kommt. Stell bitte das Warnschild auf." }],
				},
			},
			fashion: {
				name: "Mode",
				slug: "mode",
				seo: {
					title: "KI-Sprachassistent f\u00fcr Retouren in der Modebranche",
					description: "Mandy gibt jeder Person in der Retourenbewertung dieselben Regeln je Marke und Material, h\u00e4ngt Schadensfotos an und zeigt dem Einkauf wiederkehrende M\u00e4ngel.",
				},
				headline: ["Retouren einheitlich bewertet,", "schneller wieder im Verkauf."],
				does: [
					{ verb: "know", text: "Bewertungsregeln je Marke und Material." },
					{ verb: "record", text: "Schadensfotos hängen an der Retoure." },
					{ verb: "learn", text: "Der Einkauf sieht, welche Mängel wiederkehren." },
				],
				gain: "Mehr Wiederverkaufswert in jeder Schicht.",
				card: {
					question: "Wie hilft Mandy bei Mode-Retouren?",
					answer: "Die eine verkauft die Jacke mit offener Naht wieder, der n\u00e4chste schickt sie in die Reparatur. Mandy gibt allen dieselben Regeln.",
					story: {
						meaning: "Naht ist offen. Wiederverkaufen oder reparieren?",
						answer: "Reparieren. Das kostet unter zwei Euro.",
						lands: "Bewertung an der Retoure erfasst",
					},
					result: "Dieselbe Bewertung in jeder Schicht.",
				},
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
				slug: "pharma",
				seo: {
					title: "KI-Sprachassistent f\u00fcr GMP-Pharmalager",
					description: "Mandy f\u00fchrt Mitarbeitende im Pharmalager per Sprache durch GMP-Checklisten, erfasst jeden Schritt mit wer, wann und wo und meldet Abweichungen sofort an die QA.",
				},
				headline: ["GMP-Dokumentation,", "freihändig."],
				does: [
					{ verb: "record", text: "Jeder Schritt erfasst: wer, wann, wo." },
					{ verb: "know", text: "Chargenstatus und die SOP zu jedem Schritt." },
					{ verb: "talk", text: "Abweichungen gehen sofort an die QA." },
				],
				gain: "Auditfähig ohne Tastatur.",
				card: {
					question: "Wie hilft Mandy im Pharmalager?",
					answer: "Unter GMP braucht jeder Schritt einen Nachweis. Mandy f\u00fchrt per Sprache durch die Checkliste und erfasst jeden Schritt sofort.",
					story: {
						meaning: "Die K\u00fchlraumt\u00fcr war f\u00fcnf Minuten offen.",
						answer: "Abweichung mit Uhrzeit erfasst. Die QA hat es.",
						lands: "Abweichungsmeldung an die QA",
					},
					result: "Auditf\u00e4hig, ohne zu tippen.",
				},
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
				slug: "luftfahrt",
				seo: {
					title: "KI-Sprachassistent f\u00fcr Flugzeugwartung und Bodenabfertigung",
					description: "Mandy liest Taskcards und Drehmomente vor, erfasst M\u00e4ngel mit Foto und Position und bringt Vorfeld, Catering und Wartung beim Turnaround zusammen.",
				},
				headline: ["Mehr Zeit am Flugzeug,", "weniger mit Papierkram."],
				does: [
					{ verb: "know", text: "Taskcards und Drehmomente, freihändig." },
					{ verb: "record", text: "Mängel mit Foto und Position erfasst." },
					{ verb: "talk", text: "Vorfeld, Catering und Wartung abgestimmt." },
				],
				gain: "Turnarounds bleiben im Plan.",
				card: {
					question: "Wie hilft Mandy in der Luftfahrt?",
					answer: "Techniker verlieren einen gro\u00dfen Teil der Schicht an Papierkram. Mandy liest die Taskcard vor und erfasst M\u00e4ngel, w\u00e4hrend die H\u00e4nde am Flugzeug bleiben.",
					story: {
						meaning: "Drehmoment f\u00fcr den Verschluss der Triebwerksverkleidung?",
						answer: "12 Nm laut Taskcard.",
						lands: "Schritt auf der Taskcard abgezeichnet",
					},
					result: "Turnarounds bleiben im Plan.",
				},
				voices: {
					ramp: [{ ask: "Auf Wagen 3 ist ein Koffer ohne Anhänger.", answer: "Foto abgelegt. Der Gepäckservice weiß Bescheid." }],
					mechanic: [
						{ ask: "Drehmoment für den Verschluss der Triebwerksverkleidung?", answer: "12 Nm laut Taskcard. Erfasst." },
						{ ask: "Hydraulikleck am linken Hauptfahrwerk.", answer: "Mangel mit Foto gemeldet. Die Wartung ist unterwegs." },
					],
					tug: [{ ask: "Ist Position 14 frei zum Pushback?", answer: "Noch nicht. Das Catering gibt die hintere Tür in 2 Minuten frei." }],
				},
			},
		},
	},
};
