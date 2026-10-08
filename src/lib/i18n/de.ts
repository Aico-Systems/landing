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
		close: "Schließen",
		cardHeadings: { asks: "Was Mitarbeitende fragen", helps: "Was Mandy übernimmt", result: "Was sich ändert" },
		verbs: { know: "Wissen", act: "Handeln", talk: "Abstimmen", record: "Erfassen", learn: "Lernen" },
		mandy: {
			question: "Was ist Mandy?",
			answer: [
				"Mandy ist ein Sprachassistent für Menschen, die in Lager und Produktion arbeiten. Mandy läuft auf dem ProGlove MAI Handschuh, auf einem Android-Smartphone oder einer Uhr. Wer eine Frage hat, drückt einmal, fragt in der eigenen Sprache und bekommt eine Antwort aus den Dokumenten und Systemen des Standorts.",
				"Mandy setzt auch um, was sie hört: Sie bucht Nachschub in SAP, schreibt dem Team oder legt einen Wartungsauftrag an und hält fest, wer wann wo gefragt hat.",
			],
			sections: [
				{
					heading: "Warum sind Ausnahmen so teuer?",
					text: [
						"Ein fehlendes Teil, ein beschädigter Karton oder ein unklarer Arbeitsschritt hält eine Person 3 bis 15 Minuten auf, drei- bis fünfmal pro Schicht. Die Hände sind voll, also geht sie los und sucht jemanden, der Bescheid weiß. Die Antwort steht meist in einer SOP, die niemand gelesen hat, am wenigsten die neue Aushilfe.",
						"Meister betreuen mehrere Bereiche gleichzeitig, und oft spricht die Hälfte der Schicht nicht die Sprache des Standorts. Keine dieser Fragen landet in einem System, also sieht das Management nie, woran es auf der Fläche hakt.",
					],
				},
				{
					heading: "Welche Sprachen spricht Mandy?",
					text: [
						"Mandy hört und antwortet in der Sprache der jeweiligen Person und übersetzt jede Nachricht unterwegs. Ein Mitarbeiter fragt auf Ukrainisch, der Meister liest Deutsch, und die SOP bleibt auf Deutsch. Eine Durchsage des Meisters hört jede Person in ihrer Sprache.",
					],
				},
				{
					heading: "Mit welchen Systemen arbeitet Mandy?",
					text: ["Mandy nutzt die Systeme, die ein Standort schon hat. Neu kaufen müssen Sie nichts:"],
					list: [
						"SAP und andere ERP-, WMS- und Personalsysteme für Abfragen und Buchungen",
						"ServiceNow, Jira und Zendesk für Tickets",
						"SharePoint und Ihre eigenen SOPs als Quelle der Antworten",
						"Teams, Slack, SMS und WhatsApp für Nachrichten, und ein Anruf, wenn eine Nachricht nicht reicht",
					],
				},
				{
					heading: "Wo läuft Mandy?",
					text: [
						"In der Cloud mit Datenhaltung in der EU, im eigenen Rechenzentrum oder komplett offline für Werke ohne Internet. Mandy ist für die DSGVO und für IT-Sicherheitsprüfungen in Unternehmen ausgelegt. Fällt das WLAN aus, speichert Mandy das Gesagte zwischen und gleicht es ab, sobald wieder Empfang da ist.",
					],
				},
				{
					heading: "Wie läuft ein Pilot ab?",
					text: [
						"Ein Pilot umfasst einen Standort, einen Anwendungsfall und 5 bis 12 Mitarbeitende über 14 Wochen. In Woche 1 laden wir Ihre SOPs, binden Ihre Systeme an und legen die Sprachen der Schicht fest. Ab Woche 2 nutzt das Team Mandy täglich, und häufige Anfragen werden zu Ein-Tipp-Tasten. In Woche 14 bekommen Sie die eingesparte Zeit, gemessen an dem Ziel, das Sie festgelegt haben.",
					],
				},
			],
			verbsHeading: "Was kann Mandy?",
			verbs: {
				know: "Antwortet aus Ihren SOPs, Verpackungsvorgaben, Auftragsständen und Maschinenhandbüchern und sagt es offen, wenn sie etwas nicht weiß.",
				act: "Bucht Nachschub, Umlagerungen, Zählungen und Serviceaufträge in ERP und WMS und liest jede Buchung vorher noch einmal vor.",
				talk: "Schickt strukturierte Nachrichten an das richtige Team, ruft bei Dringendem den Meister an und übernimmt die Schichtübergabe.",
				record: "Erfasst Aufgaben, Fotos, Checklisten und Beinahe-Unfälle mit Zeit, Ort und Namen.",
				learn: "Arbeitet neue und Leihkräfte in ihrer Sprache ein und zeigt dem Management die Fragen der Woche und wie lange Eskalationen warten.",
			},
			faqHeading: "Häufige Fragen",
			faq: [
				{ q: "Funktioniert Mandy ohne Internet?", a: "Ja. Mandy läuft auch im eigenen Rechenzentrum oder komplett offline." },
				{
					q: "Ist Sprache immer die richtige Bedienung?",
					a: "Nein. Anfragen, die immer wieder kommen, werden zu Ein-Tipp-Tasten auf dem Handschuh, und für alles andere bleibt die Sprache.",
				},
				{
					q: "Was unterscheidet Mandy von Pick-by-Voice oder einer Wissens-App?",
					a: "Pick-by-Voice folgt einem festen Ablauf, und eine Wissens-App beantwortet Fragen, kann aber nichts buchen. Mandy beantwortet offene Fragen und schreibt zurück in Ihre Systeme.",
				},
				{
					q: "Was passiert, wenn Mandy die Antwort nicht kennt?",
					a: "Sie sagt es. Wenn das Standardvorgehen einen Fall nicht abdeckt, holt Mandy einen Menschen dazu.",
				},
			],
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
					answer: [
						"In der Kontraktlogistik hat jeder Kunde eigene Regeln f\u00fcr Verpackung, Etiketten und Retouren, und ein gro\u00dfer Teil der Schicht sind Leihkr\u00e4fte, neu am Standort und oft ohne Deutschkenntnisse. Mandy beantwortet ihre Fragen direkt am Regal, in ihrer Sprache, aus den Vorgaben des jeweiligen Kunden.",
						"Nachschub und Umlagerungen buchen die Mitarbeitenden per Sprache. Mandy liest jede Buchung vor dem Buchen noch einmal vor und h\u00e4lt fest, wer sie wann und wo ausgel\u00f6st hat.",
					],
					asks: [
						"Wie will Kunde B diese Palette etikettiert haben?",
						"Wann kommt der Nachschub f\u00fcr B14?",
						"Rest der Palette in Zone C umlagern.",
					],
					helps: [
						{ verb: "know", text: "Verpackungs- und Etikettierregeln je Kunde, aus Ihren vorhandenen SOPs." },
						{ verb: "act", text: "Nachschub, Umlagerungen und Z\u00e4hlungen per Sprache im WMS gebucht." },
						{ verb: "record", text: "Indirekte Arbeit wie Umpacken und Reinigen, mit Zeit und Ort erfasst. Sie macht bis zu 40 % eines Tages aus, und kein WMS sieht sie." },
						{ verb: "learn", text: "Leihkr\u00e4fte, die ab der ersten Schicht selbstst\u00e4ndig arbeiten." },
					],
					result: "Weniger Wege ins B\u00fcro, und neue Kr\u00e4fte sind ab der ersten Schicht produktiv.",
				},
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
					answer: [
						"An der Montagelinie h\u00e4lt ein fehlendes Teil oder ein Fehlercode eine Station an, und der Meister betreut oft vier Bereiche gleichzeitig. Mandy nimmt den zuletzt gescannten Barcode und das Gesagte und schickt der Logistik eine vollst\u00e4ndige Anforderung mit Teilenummer, Station und Restmenge.",
						"Fehlercodes, R\u00fcstschritte und Einstellungen jeder Linie sind eine Frage entfernt, und die Schicht\u00fcbergabe wird einmal gesprochen und f\u00fcr die n\u00e4chste Schicht \u00fcbersetzt.",
					],
					asks: [
						"Am Kitting sind nur noch drei Kabelb\u00e4ume.",
						"Was bedeutet Fehler E-47 am Schrauber?",
						"Sag der n\u00e4chsten Schicht, dass der Etikettierer an Linie 2 aussetzt.",
					],
					helps: [
						{ verb: "talk", text: "Fehlteile erreichen die Logistik in einer Nachricht, mit Teilenummer und Station." },
						{ verb: "know", text: "Fehlercodes, R\u00fcstschritte und Maschineneinstellungen je Station." },
						{ verb: "act", text: "Eine defekte Maschine \u00f6ffnet einen Wartungsauftrag mit Ort, Scan und Foto." },
						{ verb: "record", text: "Schicht\u00fcbergaben zusammengefasst und f\u00fcr die n\u00e4chste Schicht \u00fcbersetzt." },
					],
					result: "Weniger Linienstopps, und Meister betreuen mehr Fl\u00e4che.",
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
					answer: [
						"Ein Sorter l\u00e4uft schnell, bis ein Paket kein Label hat, besch\u00e4digt ankommt oder zu gro\u00df f\u00fcr das Band ist. Mandy sagt, was damit zu tun ist, und erfasst Scan und Foto.",
						"Sortierung, Packerei und Verladung sprechen auf einem Kanal. Fragt die Verladung per Sprache, ob noch Pakete f\u00fcr die 20-Uhr-Tour \u00fcbrig sind, landet die Frage bei der Packerei in Teams und wird mit einem Tipp beantwortet. So fahren keine halbleeren Lkw mehr los.",
					],
					asks: [
						"Dieses Paket hat kein Label.",
						"Sind noch Pakete f\u00fcr die 20-Uhr-Tour da?",
						"Tor 3 geht nicht zu.",
					],
					helps: [
						{ verb: "know", text: "Regeln f\u00fcr \u00dcberma\u00df, Sch\u00e4den und Pakete ohne Label." },
						{ verb: "talk", text: "Fragen zwischen Sortierung, Packerei und Verladung in Sekunden beantwortet." },
						{ verb: "act", text: "Defekte B\u00e4nder und Tore mit Ort und Foto gemeldet." },
					],
					result: "Vollere Lkw, und zum Schichtende bleibt kein Stapel Sonderf\u00e4lle liegen.",
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
					answer: [
						"In der Hochsaison kommen Hunderte Kommissionierer und Packer, die den Standort noch nie gesehen haben. Mit Mandy fragen sie in ihrer Sprache, statt zu raten: welcher Karton, wie Glas verpackt wird, was bei einem Fehlpick zu tun ist.",
						"Die Antworten kommen aus Ihren Verpackungsvorgaben je Artikel. So geht jede Bestellung im richtigen Karton mit dem richtigen Polster raus.",
					],
					asks: [
						"Mein erster Tag. Wie packe ich Glas?",
						"Welcher Karton f\u00fcr Auftrag 8840?",
						"In Beh\u00e4lter 118 fehlt ein Artikel.",
					],
					helps: [
						{ verb: "learn", text: "Einarbeitung am Packplatz, in der Sprache jeder Person." },
						{ verb: "know", text: "Kartongr\u00f6\u00dfe und Verpackungsregeln je Artikel." },
						{ verb: "record", text: "Fehlpicks, Nacharbeit und Umpacken sofort erfasst." },
					],
					result: "Saisonteams in wenigen Stunden eingearbeitet, und weniger besch\u00e4digte oder zu gro\u00dfe Sendungen.",
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
					answer: [
						"Im Markt oder im Dark Store sollte die Person, die das leere Regal sieht, auch den Nachschub bestellen. Mit Mandy sagt sie es einfach, und die Bestellung ist ausgel\u00f6st, ohne Weg zum Terminal.",
						"Wer Onlinebestellungen pickt, bekommt Ersatzartikel und Auftragsstatus w\u00e4hrend des Pickens, und K\u00fchltemperaturen und Frischekontrollen werden per Sprache mit Zeitstempel erfasst.",
					],
					asks: [
						"Das Haferdrink-Regal ist fast leer.",
						"Nudeln 500 g sind aus. Was nehme ich als Ersatz?",
						"K\u00fchlregal sechs hat sieben Grad.",
					],
					helps: [
						{ verb: "act", text: "Nachschubbestellungen und Regaldaten per Sprache aktualisiert." },
						{ verb: "know", text: "Ersatzartikel und Auftragsstatus w\u00e4hrend des Pickens." },
						{ verb: "record", text: "Temperatur- und Frischekontrollen mit Zeitstempel." },
					],
					result: "Weniger L\u00fccken im Regal und weniger fehlende Artikel in Onlinebestellungen.",
				},
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
					answer: [
						"Wie eine Retoure bewertet wird, h\u00e4ngt davon ab, wer sie pr\u00fcft: Die eine verkauft die Jacke mit offener Naht wieder, der n\u00e4chste schickt sie in die Reparatur. Mandy gibt allen dieselben Regeln je Marke und Material.",
						"Ein Doppeldruck auf den Handschuh macht ein Foto, Mandy beschreibt den Schaden und h\u00e4ngt ihn an die Retoure. Weil jeder Mangel erfasst ist, sehen Qualit\u00e4t und Einkauf, welche M\u00e4ngel immer wiederkommen.",
					],
					asks: [
						"Naht ist offen. Wiederverkaufen oder reparieren?",
						"Wie pr\u00fcfe ich, ob das Label echt ist?",
						"Fleck am \u00c4rmel, ich mache ein Foto.",
					],
					helps: [
						{ verb: "know", text: "Bewertungsregeln je Marke und Material, in jeder Schicht gleich." },
						{ verb: "record", text: "Sch\u00e4den fotografiert, beschrieben und an die Retoure geh\u00e4ngt." },
						{ verb: "learn", text: "Wiederkehrende M\u00e4ngel landen bei Qualit\u00e4t und Einkauf." },
					],
					result: "Einheitliche Bewertungen, und mehr Retouren schneller wieder im Verkauf.",
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
					answer: [
						"Unter GMP braucht jeder Schritt einen Nachweis, wer ihn wann und wo erledigt hat, und ein falscher Pick kann Patienten schaden. Mandy f\u00fchrt per Sprache durch Checklisten und erfasst jeden Schritt, w\u00e4hrend er passiert.",
						"Chargenstatus, Lagerbedingungen und SOPs kommen direkt aus Ihren Systemen, und Abweichungen erreichen die QA sofort mit Zeit und Ort.",
					],
					asks: [
						"Ist Charge 24-117 freigegeben?",
						"K\u00fchlketten-Checkliste starten.",
						"Diese Seriennummer l\u00e4sst sich nicht verifizieren.",
					],
					helps: [
						{ verb: "record", text: "Gef\u00fchrte Checklisten, jeder Schritt mit wer, wann und wo erfasst." },
						{ verb: "know", text: "Chargenstatus, Lagerbedingungen und die SOP zu jedem Schritt." },
						{ verb: "talk", text: "Abweichungen sofort an die QA gemeldet." },
					],
					result: "Auditf\u00e4hige Nachweise, ohne dass jemand sie abtippen muss.",
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
					answer: [
						"Techniker und Bodenpersonal verbringen viel ihrer Schicht mit Dokumentation statt am Flugzeug. Mandy liest Taskcards und Drehmomente vor und erfasst M\u00e4ngel mit Foto und Position, w\u00e4hrend die H\u00e4nde an der Arbeit bleiben.",
						"Vorfeld, Catering, Gep\u00e4ck und Wartung stimmen den Turnaround auf einem Kanal ab, jede Gruppe in ihrer Sprache.",
					],
					asks: [
						"Drehmoment f\u00fcr den Verschluss der Triebwerksverkleidung?",
						"Hydraulikleck am linken Hauptfahrwerk.",
						"Ist Position 14 frei zum Pushback?",
					],
					helps: [
						{ verb: "know", text: "Taskcards und Drehmomente, freih\u00e4ndig vorgelesen." },
						{ verb: "record", text: "M\u00e4ngel mit Foto und Position am Flugzeug erfasst." },
						{ verb: "talk", text: "Vorfeld, Catering und Wartung auf einem Kanal." },
					],
					result: "Mehr Zeit am Flugzeug, und Turnarounds bleiben im Plan.",
				},
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
