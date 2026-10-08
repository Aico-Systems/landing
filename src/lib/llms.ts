import { VERTICALS } from "$lib/verticals";
import { LOCALES, type Locale } from "$lib/i18n/locales";
import { MESSAGES } from "$lib/i18n/messages";
import { SPOKEN } from "$lib/i18n/spoken";
import type { Verb } from "$lib/i18n/types";
import { UPDATED } from "$lib/site";
import { APPS, PIECES, type AppGroup } from "$lib/integrations";
import { SYSTEMS, VERTICAL_SYSTEMS } from "$lib/systems";
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
		`> ${en.home.mandy.answer}`,
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
	const out = [`# ${a.question}`, "", `Source: ${absolute(pagePath(locale))}`, "", a.answer, ""];
	out.push(`## ${a.why.heading}`, "", `${a.why.figure} ${a.why.unit}. ${a.why.text}`, "");
	out.push(`## ${a.flow.heading}`, "", a.flow.caption, "");
	out.push(`## ${a.verbs.heading}`, "");
	for (const [verb, v] of Object.entries(a.verbs.items)) out.push(`- ${m.home.verbs[verb as Verb]}: ${v.text} ("${v.says}")`);
	out.push("", `## ${a.systems.heading}`, "", a.systems.text, "", ...a.systems.groups.map((g) => `- ${g.name}: ${g.items}`), "");
	out.push(`## ${a.integrations.heading}`, "", a.integrations.text(String(PIECES)), "");
	out.push(...Object.entries(APPS).map(([g, apps]) => `- ${a.integrations.groups[g as AppGroup]}: ${apps.join(", ")}`), "");
	out.push(`## ${a.runs.heading}`, "", ...a.runs.options.map((o) => `- ${o.name}: ${o.text}`), "");
	out.push(`## ${a.pilot.heading}`, "", ...a.pilot.phases.map((p) => `- ${a.pilot.week} ${p.from === p.to ? p.from : `${p.from}–${p.to}`}, ${p.name}: ${p.what}`), "");
	out.push(`## ${a.faq.heading}`, "");
	for (const f of a.faq.items) out.push(`### ${f.q}`, "", f.a, "");
	for (const v of VERTICALS) {
		const c = m.home.verticals[v.id].card;
		const said = SPOKEN[v.id];
		out.push(`## ${c.question}`, "", `Source: ${absolute(pagePath(locale, v.id))}`, "", c.answer, "");
		out.push(`> "${said.text}" (${said.lang}): ${c.story.meaning}`, `> Mandy: ${c.story.answer}`, `> ${c.story.lands}`, "", c.result, "");
		out.push(`${m.home.systems.heading}: ${VERTICAL_SYSTEMS[v.id].map((id) => SYSTEMS[id].name).join(", ")}`, "");
	}
	out.push(m.site.updated(UPDATED));
	return out.join("\n");
}

