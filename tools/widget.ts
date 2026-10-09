// Brings the AICO widget into the site: builds clients/widget (its client
// core included, `just web`) and copies what an embed loads into
// static/aico/: widget.js, the core's wasm, the 3D mascot (mascot3d.js and
// its model) and the clips beside it.
// Generated, not committed (.gitignore); the dev and build scripts run it.
import { cpSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const widget = resolve(import.meta.dirname, "../../clients/widget");
const out = resolve(import.meta.dirname, "../static/aico");

execSync("bun install --silent && bun run build", { cwd: widget, stdio: ["ignore", "ignore", "inherit"] });
rmSync(out, { recursive: true, force: true });
for (const file of ["widget.js", "aico-core.wasm", "mascot3d.js", "mascot"]) {
	cpSync(resolve(widget, "dist", file), resolve(out, file), { recursive: true });
}
console.log(`[widget] clients/widget/dist -> static/aico/`);
