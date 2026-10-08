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
	warehouse: { lang: "uk", text: "Клієнт пише подарункове пакування, але на етикетці немає коду. Що робити?" },
	manufacturing: { lang: "pl", text: "Jaki moment dokręcania tylnych śrub ramy pomocniczej w wersji hybrydowej?" },
	parcel: { lang: "ro", text: "Eticheta e ruptă, lipsește jumătate din codul poștal. Unde merge?" },
	ecommerce: { lang: "bg", text: "Мястото за артикула, завършващ на 4471, е празно. Можеш ли да заявиш попълване?" },
	grocery: { lang: "tr", text: "3. reyondaki dolap 9 derece gösteriyor. Kaydediyorum, kimi aramalıyım?" },
	fashion: { lang: "vi", text: "Đường may hơi bị tuột, không còn mác. Bán lại hay tân trang?" },
	pharma: { lang: "pl", text: "Rejestrator na tym pojemniku pokazuje 9,2 stopnia. Mam go dać do kwarantanny?" },
	aviation: { lang: "es", text: "¿Número de pieza IPC del casquillo del brazo de torsión del tren principal izquierdo?" },
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
