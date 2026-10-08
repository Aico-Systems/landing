import type { VerticalId } from "$lib/verticals";

/**
 * Every word on the site, one shape for every language: a locale file that
 * misses a key, or has one too many, does not compile.
 *
 * Grouped by where the words appear (site-wide, then per page), so a new
 * page is a new group here and in each locale.
 */
export interface Messages {
	site: {
		/** The browser tab and search results. */
		title: string;
		description: string;
		brand: string;
		tagline: string;
		demo: string;
	};
	home: {
		/** What the 3D stage shows, for screen readers. */
		stage: (vertical: string) => string;
		/** The label of the row of industries. */
		industries: string;
		/** Under a question asked in another language; [language] arrives
		 *  already named in the page's language (Intl.DisplayNames). */
		askedIn: (language: string) => string;
		verbs: Record<Verb, string>;
		verticals: Record<VerticalId, VerticalWords>;
	};
}

/** The five things Mandy does on the floor (the pitch deck's own words). */
export type Verb = "know" | "act" | "talk" | "record" | "learn";

export interface VerticalWords {
	name: string;
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
