import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { fileURLToPath } from "node:url";

// @aico/blueprint is the monorepo's shared UI package: its tokens are the
// brand, used from source like the frontend and Studio do.
const blueprint = fileURLToPath(new URL("../blueprint/src", import.meta.url));

export default defineConfig({
  plugins: [sveltekit()],
  // PUBLIC_AICO_DOMAIN: the platform the page talks to (src/lib/site.ts)
  envPrefix: ["VITE_", "PUBLIC_"],
  resolve: {
    alias: { "@aico/blueprint": blueprint },
  },
  server: {
    // clear of the host plane's frontend (5173) and widget (5174)
    port: 5175,
    fs: { allow: [blueprint, ".."] },
  },
});
