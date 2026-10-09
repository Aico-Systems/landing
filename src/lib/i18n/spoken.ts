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
	manufacturing: { lang: "sr", text: "Ovaj deo je oštećen. Šta da radim?" },
	parcel: { lang: "ro", text: "Eticheta e ruptă, lipsește jumătate din codul poștal. Unde merge?" },
	ecommerce: { lang: "bg", text: "Мястото за артикула, завършващ на 4471, е празно. Можеш ли да заявиш попълване?" },
	grocery: { lang: "tr", text: "3. reyondaki dolap 9 derece gösteriyor. Kaydediyorum, kimi aramalıyım?" },
	fashion: { lang: "vi", text: "Đường may hơi bị tuột, không còn mác. Bán lại hay tân trang?" },
	pharma: { lang: "pl", text: "Rejestrator na tym pojemniku pokazuje 9,2 stopnia. Mam go dać do kwarantanny?" },
	aviation: { lang: "es", text: "Este contenedor para el vuelo de las 14:20 a Madrid está lleno. Necesito un conductor." },
};

/** One worker's side of the round: the report, and the answer heard back. */
export interface WorkerExchange {
	ask: Spoken;
	reply: Spoken;
}

/** The message the card about Mandy follows round: said by a worker in
 *  their language, read by the team lead in German, answered with one tap,
 *  heard back in the worker's language. The worker's side turns through
 *  several languages, the same report each time — the point is that any of
 *  them works. The same on every page. */
export const FLOW_SPOKEN = {
	read: { lang: "de", text: "Palette 4 beschädigt, zwei Kartons eingedrückt." },
	tap: { lang: "de", text: "Ich komme." },
	workers: [
		{ ask: { lang: "uk", text: "Палета 4 пошкоджена, дві коробки розчавлені." }, reply: { lang: "uk", text: "Вже йду." } },
		{ ask: { lang: "pl", text: "Paleta 4 uszkodzona, dwa kartony zgniecione." }, reply: { lang: "pl", text: "Już idę." } },
		{ ask: { lang: "tr", text: "Palet 4 hasarlı, iki koli ezilmiş." }, reply: { lang: "tr", text: "Geliyorum." } },
		{ ask: { lang: "ro", text: "Paletul 4 e deteriorat, două cutii sunt strivite." }, reply: { lang: "ro", text: "Vin imediat." } },
		{ ask: { lang: "vi", text: "Pallet số 4 bị hỏng, hai thùng bị móp." }, reply: { lang: "vi", text: "Tôi đến ngay." } },
		{ ask: { lang: "es", text: "El palé 4 está dañado, dos cajas aplastadas." }, reply: { lang: "es", text: "Ya voy." } },
		{ ask: { lang: "bg", text: "Палет 4 е повреден, два кашона са смачкани." }, reply: { lang: "bg", text: "Идвам." } },
		{ ask: { lang: "ar", text: "المنصة 4 تالفة، وصندوقان مسحوقان." }, reply: { lang: "ar", text: "أنا قادم." } },
	] satisfies WorkerExchange[],
};
