import { VERTICALS } from "$lib/verticals";
import { LOCALES, type Locale } from "$lib/i18n/locales";
import { MESSAGES } from "$lib/i18n/messages";
import { SPOKEN, SYSTEMS } from "$lib/i18n/spoken";
import { UPDATED } from "$lib/site";
import { absolute, pagePath } from "$lib/seo";

/**
 * The site as Markdown for language models (llmstxt.org): llms.txt is the
 * index, llms-full.txt every card in full. Written from the same words as
 * the pages, so the two never disagree.
 */
export function llmsIndex(): string {
	const en = MESSAGES[LOCALES[0]];
	const lines = [
		`# ${en.site.brand}`,
		"",
		`> ${en.home.mandy.answer[0]}`,
		"",
		en.home.mandy.answer[1],
		"",
		`Full text of every page: ${absolute("/llms-full.txt")}`,
		"",
	];
	for (const locale of LOCALES) {
		const m = MESSAGES[locale];
		lines.push(`## ${m.site.language}`, "");
		lines.push(`- [${m.home.mandy.question}](${absolute(pagePath(locale))}): ${m.site.seo.description}`);
		for (const v of VERTICALS) {
			const w = m.home.verticals[v.id];
			lines.push(`- [${w.card.question}](${absolute(pagePath(locale, v.id))}): ${w.seo.description}`);
		}
		lines.push("");
	}
	return lines.join("\n");
}

export function llmsFull(): string {
	return LOCALES.map(full).join("\n\n---\n\n");
}

function full(locale: Locale): string {
	const m = MESSAGES[locale];
	const a = m.home.mandy;
	const out = [`# ${a.question}`, "", `Source: ${absolute(pagePath(locale))}`, "", ...para(a.answer)];
	out.push(...a.figures.map((f) => `- ${f.value} ${f.unit}: ${f.label}`), "");
	out.push(`## ${a.whyHeading}`, "", ...para(a.why));
	out.push(`## ${a.flowHeading}`, "", a.flowText, "", ...a.flow.map((f, i) => `${i + 1}. ${f.who}: ${f.text}`), "");
	out.push(`## ${a.verbsHeading}`, "", ...Object.entries(a.verbs).map(([verb, text]) => `- ${m.home.verbs[verb as keyof typeof a.verbs]}: ${text}`), "");
	out.push(`## ${a.systemsHeading}`, "", `${a.systemsText} (${SYSTEMS.join(", ")})`, "");
	out.push(`## ${a.runsHeading}`, "", ...a.runs.map((r) => `- ${r.name}: ${r.text}`), "");
	out.push(`## ${a.pilotHeading}`, "", a.pilotText, "", ...a.pilot.map((p) => `- ${p.when}: ${p.what}`), "");
	out.push(`## ${a.faqHeading}`, "");
	for (const f of a.faq) out.push(`### ${f.q}`, "", f.a, "");
	for (const v of VERTICALS) {
		const w = m.home.verticals[v.id];
		const c = w.card;
		out.push(`## ${c.question}`, "", `Source: ${absolute(pagePath(locale, v.id))}`, "", ...para(c.answer));
		const said = SPOKEN[v.id];
		out.push(`### ${m.home.cardHeadings.story}`, "", `- "${said.text}" (${said.lang}): ${c.story.meaning}`, `- Mandy: ${c.story.answer}`, `- ${c.story.lands}`, "");
		out.push(`### ${m.home.cardHeadings.asks}`, "", ...c.asks.map((q) => `- "${q}"`), "");
		out.push(`### ${m.home.cardHeadings.helps}`, "", ...c.helps.map((d) => `- ${m.home.verbs[d.verb]}: ${d.text}`), "");
		out.push(`### ${m.home.cardHeadings.result}`, "", c.result, "");
	}
	out.push(m.site.updated(UPDATED));
	return out.join("\n");
}

const para = (ps: string[]) => ps.flatMap((p) => [p, ""]);
