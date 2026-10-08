// A landing page is read before it is used: every route is prerendered to
// plain HTML at build time (adapter-static, no SPA fallback), so the first
// paint and search engines get the page itself, not an empty shell.
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
};

export default config;
