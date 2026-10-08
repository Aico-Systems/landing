import type { VerticalId } from "$lib/verticals";

/**
 * Every word on the site, one shape for every language: a locale file that
 * misses a key, or has one too many, does not compile.
 *
 * Grouped by where the words appear (site-wide, the gateway at "/", the
 * home page with its verticals and cards), so a new page is a new group
 * here and in each locale. The same words feed the HTML, the search
 * snippets, the structured data and llms.txt.
 */
export interface Messages {
	site: {
		brand: string;
		tagline: string;
		demo: string;
		/** Under a card: when its facts were last checked. */
		updated: (date: string) => string;
		/** Search snippet and share text of the home page. */
		seo: Seo;
		/** The language's own name, for the gateway's links ("Deutsch"). */
		language: string;
	};
	gateway: {
		/** What "/" says to a reader who is not sent on (no script, a crawler). */
		intro: string;
		/** Above the links into this language. */
		enter: string;
	};
	home: {
		/** What the 3D stage shows, for screen readers. */
		stage: (vertical: string) => string;
		/** The label of the row of industries. */
		industries: string;
		/** Under a question asked in another language; [language] arrives
		 *  already named in the page's language (Intl.DisplayNames). */
		askedIn: (language: string) => string;
		/** The link that opens the card about Mandy itself (a vertical's card
		 *  opens on its own question). */
		about: string;
		close: string;
		/** Headings of the parts of every vertical's card. */
		cardHeadings: { asks: string; helps: string; result: string };
		verbs: Record<Verb, string>;
		/** The card about Mandy as a whole: the home page's long text. */
		mandy: AboutWords;
		verticals: Record<VerticalId, VerticalWords>;
	};
}

export interface Seo {
	/** The page title before " | Mandy": about 50 characters. */
	title: string;
	/** About 150 characters, the answer first. */
	description: string;
}

/** The five things Mandy does on the floor (the pitch deck's own words). */
export type Verb = "know" | "act" | "talk" | "record" | "learn";

export interface VerticalWords {
	name: string;
	/** Its address under the language: /en/<slug>/. Never change one that
	 *  is live: links and search results point at it. */
	slug: string;
	seo: Seo;
	/** What Mandy changes here, in two lines, broken where the thought breaks. */
	headline: [string, string];
	/** Three things Mandy does here, each under one of its verbs; each a
	 *  single line on a wide screen (about 42 characters in English). */
	does: [Doing, Doing, Doing];
	/** What the customer gains: one short line. */
	gain: string;
	/** What the people of the scene ask Mandy, by their voice (verticals.ts),
	 *  each in turn. */
	voices: Record<string, Exchange[]>;
	card: VerticalCard;
}

/** The longer text behind a vertical, for whoever wants to know more. */
export interface VerticalCard {
	/** The question the card answers, as a searcher would ask it. */
	question: string;
	/** The answer, first sentence first: it has to stand on its own. */
	answer: string[];
	/** What workers here say to Mandy, as they would say it. */
	asks: string[];
	helps: Doing[];
	result: string;
}

export interface AboutWords {
	question: string;
	answer: string[];
	/** Parts of the card, each under a heading phrased as a question. */
	sections: { heading: string; text: string[]; list?: string[] }[];
	verbsHeading: string;
	/** What each of the five verbs covers. */
	verbs: Record<Verb, string>;
	faqHeading: string;
	faq: { q: string; a: string }[];
}

export interface Doing {
	verb: Verb;
	text: string;
}

export interface Exchange {
	/** What the person asks, out loud, in the page's language. */
	ask: string;
	/** What Mandy answers. */
	answer: string;
	/** The language it was really asked (and answered) in, as a BCP 47 code,
	 *  when that is not the page's: translation runs through everything
	 *  Mandy does. */
	lang?: string;
}
