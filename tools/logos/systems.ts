// The systems' logo sources as JSON for fetch.py: the registry, and the
// Simple Icons mark for those that have one.
import * as icons from "simple-icons";
import { SYSTEMS } from "../../src/lib/systems";

type Icon = { slug: string; hex: string; path: string };
const bySlug = new Map((Object.values(icons) as Icon[]).filter((i) => i?.slug).map((i) => [i.slug, i]));

console.log(
	JSON.stringify(
		Object.fromEntries(
			Object.entries(SYSTEMS).map(([id, s]) => {
				const icon = "icon" in s ? bySlug.get(s.icon) : undefined;
				return [id, { ...s, svg: icon && { hex: icon.hex, path: icon.path } }];
			}),
		),
	),
);
