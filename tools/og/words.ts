// The words the share images carry, as JSON for og.py: the same text files
// the pages are built from.
import { MESSAGES } from "../../src/lib/i18n/messages";
import { VERTICALS } from "../../src/lib/verticals";

const out = Object.fromEntries(
	Object.entries(MESSAGES).map(([locale, m]) => [
		locale,
		{
			brand: m.site.brand,
			home: { name: m.site.brand, line: m.site.seo.title },
			verticals: Object.fromEntries(
				Object.entries(m.home.verticals).map(([id, v]) => [id, { name: v.name, line: v.headline.join(" ") }]),
			),
		},
	]),
);
const scenes = Object.fromEntries(VERTICALS.map((v) => [v.id, v.scene.replace(/^.*\/(\w+)\.glb$/, "$1")]));
console.log(JSON.stringify({ words: out, scenes }));
