/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_API_KEY: string;
  readonly VITE_DEMO_FLOW_SLUG: string;
  readonly VITE_DEMO_API_URL: string;
  readonly VITE_BOOKING_API_URL: string;
  readonly VITE_BOOKING_WIDGET_URL: string;
  readonly VITE_BOOKING_WIDGET_ORG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
