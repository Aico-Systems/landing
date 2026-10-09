import type { VerticalId } from "$lib/verticals";
import type { AppGroup } from "$lib/integrations";
import type { SystemKind } from "$lib/systems";

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
		/** The web glove: a visitor talks to Mandy on it, in the page. */
		try: {
			/** The header's way in. */
			open: string;
			/** Above the glove, by where the session is. */
			idle: string;
			connecting: string;
			live: string;
			ended: string;
			failed: string;
			/** The button under the glove: held while talking. */
			hold: string;
			start: string;
			/** The glove's own name, for screen readers. */
			glove: string;
		};
		close: string;
		/** Plays a card's exchange again. */
		replay: string;
		/** Under a worker's words in their language: what they mean ([language]
		 *  already named in the page's language). */
		heardIn: (language: string) => string;
		/** What each kind of system is called. */
		systemKinds: Record<SystemKind, string>;
		/** A vertical card's systems: its heading, and how they connect. */
		systems: { heading: string; note: string };
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

/** The longer text behind a vertical, for whoever wants to know more:
 *  short, because the page beside it already says what Mandy does here. */
export interface VerticalCard {
	/** The question the card answers, as a searcher would ask it. */
	question: string;
	/** The answer in two sentences; the first has to stand on its own. */
	answer: string;
	/** The exchange the card replays: what the worker said (in their own
	 *  language, src/lib/i18n/spoken.ts) means this, Mandy answers, and the
	 *  result lands somewhere. */
	story: { meaning: string; answer: string; lands: string };
	/** What changes, in a few words. */
	result: string;
}

export interface AboutWords {
	question: string;
	/** What Mandy is, in two sentences. */
	answer: string;
	/** Each part under a heading phrased as the question a reader has. */
	/** The cost of an exception, drawn as one shift with its interruptions:
	 *  [each] labels one gap, [perShift] how many a shift has. */
	why: { heading: string; each: string; perShift: string; text: string };
	/** One message on its way round: the worker's thread on a device, the
	 *  team lead's in their app, Mandy between them. Each window's title
	 *  cycles through the options: devices for the one, apps for the other. */
	flow: { heading: string; glove: string[]; teams: string[]; bridge: string; caption: string };
	/** The five verbs: what each covers, and something a worker says. */
	verbs: { heading: string; items: Record<Verb, { text: string; says: string }> };
	/** How people reach Mandy (the devices along the diagram's top) and what
	 *  it works with (its three boxes). */
	systems: { heading: string; text: string; devices: string[]; groups: { name: string; items: string }[] };
	/** Everything else it can connect to ([count]: published pieces). */
	integrations: {
		heading: string;
		text: (count: string) => string;
		groups: Record<AppGroup, string>;
		more: string;
	};
	runs: { heading: string; options: { name: string; text: string }[] };
	/** The pilot as phases over its weeks (0 to [weeks]). */
	pilot: { heading: string; week: string; phases: { name: string; from: number; to: number; what: string }[] };
	faq: { heading: string; items: { q: string; a: string }[] };
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
