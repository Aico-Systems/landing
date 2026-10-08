// Precompresses the built site: beside every file worth it, a .br, .zst and
// .gz at each format's highest level, which Caddy serves as they are
// (`file_server { precompressed }`, deploy/landing.caddy) instead of
// compressing on every request at a fast level, or not at all: Caddy's
// `encode` leaves the scenes (.glb) alone, and they shrink most (a hall's
// geometry repeats: warehouse.glb 345K, 13K as zstd).
//
// Run after `vite build` (package.json "build"); writes into build/.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { brotliCompressSync, constants, gzipSync, zstdCompressSync } from "node:zlib";

const ROOT = "build";
/** Text and the scenes; images (png, woff2) are compressed already. */
const WORTH = /\.(html|js|css|json|txt|xml|svg|wasm|glb)$/;
/** Below this a compressed copy saves less than a packet. */
const MIN_BYTES = 1024;

let files = 0;
let before = 0;
let after = 0;
for (const entry of await readdir(ROOT, { recursive: true, withFileTypes: true })) {
	if (!entry.isFile() || !WORTH.test(entry.name)) continue;
	const path = join(entry.parentPath, entry.name);
	const data = await readFile(path);
	if (data.length < MIN_BYTES) continue;
	const br = brotliCompressSync(data, {
		params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: data.length },
	});
	await Promise.all([
		writeFile(`${path}.br`, br),
		writeFile(`${path}.zst`, zstdCompressSync(data, { params: { [constants.ZSTD_c_compressionLevel]: 19 } })),
		writeFile(`${path}.gz`, gzipSync(data, { level: 9 })),
	]);
	files++;
	before += data.length;
	after += br.length;
}
const kb = (n: number) => `${Math.round(n / 1024)}K`;
console.log(`precompressed ${files} files: ${kb(before)} → ${kb(after)} (brotli)`);
