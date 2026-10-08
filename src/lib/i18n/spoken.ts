import type { VerticalId } from "$lib/verticals";

/**
 * What people say to Mandy in their own language, as the cards replay it:
 * the same on every page, whatever the page's language, so it lives here
 * once. Each line's meaning, in the page's language, is in the locale files.
 */
export interface Spoken {
	/** BCP 47 code of the language it is said in. */
	lang: string;
	text: string;
}

/** The exchange each vertical's card replays: the worker's words. */
export const SPOKEN: Record<VerticalId, Spoken> = {
	warehouse: { lang: "uk", text: "Як клієнт B хоче маркувати цю палету?" },
	manufacturing: { lang: "pl", text: "Na kittingu zostały tylko trzy wiązki kablowe." },
	parcel: { lang: "ro", text: "Coletul acesta nu are etichetă." },
	ecommerce: { lang: "bg", text: "Първи ден съм. Как да опаковам стъкло?" },
	grocery: { lang: "tr", text: "Yulaf içeceği rafı neredeyse boş." },
	fashion: { lang: "vi", text: "Đường may bị bung. Bán lại hay sửa?" },
	pharma: { lang: "pl", text: "Drzwi chłodni były otwarte przez pięć minut." },
	aviation: { lang: "es", text: "¿Qué par de apriete lleva el cierre del capó del motor?" },
};

/** The message the card about Mandy follows round: said in Ukrainian, read
 *  by the team lead in German, answered with one tap, heard back in
 *  Ukrainian. The same on every page: the point is the languages. */
export const FLOW_SPOKEN = {
	ask: { lang: "uk", text: "Палета 4 пошкоджена, дві коробки розчавлені." },
	read: { lang: "de", text: "Palette 4 beschädigt, zwei Kartons eingedrückt." },
	tap: { lang: "de", text: "Ich komme." },
	reply: { lang: "uk", text: "Вже йду." },
} satisfies Record<string, Spoken>;
