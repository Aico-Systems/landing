/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_FLOW_SLUG: string;
  readonly VITE_DEMO_FLOW_ORG: string;
  readonly VITE_DEMO_API_URL: string;
  readonly VITE_BOOKING_API_URL: string;
  readonly VITE_BOOKING_WIDGET_URL: string;
  readonly VITE_BOOKING_WIDGET_ORG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Widget IIFE bundle imported with Vite's `?url` query — returns a
// string asset URL at build time. The bundle itself is loaded via a
// `<script>` tag at runtime; we never parse it as a module, so no
// types are needed beyond declaring the import-shape here.
declare module "*?url" {
  const src: string;
  export default src;
}
