/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_API_KEY: string;
  readonly VITE_DEMO_FLOW_SLUG: string;
  readonly VITE_DEMO_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
