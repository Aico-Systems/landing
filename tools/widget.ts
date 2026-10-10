// Brings the AICO widget into the built site: builds clients/widget (its
// client core included) and copies what an embed loads into static/aico/ —
// everything in its dist/ but the preview SPA (index.html, assets/). One
// bundle from this site's own host, precompressed and cached, instead of
// the platform's widget host, which on the host plane is a dev server
// sending each source module on its own.
// Generated, not committed (.gitignore); the build runs it (development
// loads the widget from its own dev server, src/lib/site.ts ASSISTANT).
import { cpSync, readdirSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const widget = resolve(import.meta.dirname, "../../clients/widget");
const dist = resolve(widget, "dist");
const out = resolve(import.meta.dirname, "../static/aico");
const PREVIEW = new Set(["index.html", "assets"]);

execSync("bun install --silent && bun run build", { cwd: widget, stdio: ["ignore", "ignore", "inherit"] });
rmSync(out, { recursive: true, force: true });
for (const file of readdirSync(dist).filter((f) => !PREVIEW.has(f))) {
	cpSync(resolve(dist, file), resolve(out, file), { recursive: true });
}
console.log(`[widget] clients/widget/dist -> static/aico/`);
