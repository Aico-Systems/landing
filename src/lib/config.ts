declare global {
  interface Window {
    __ENV__?: Record<string, string | undefined>;
  }
}

type RuntimeKey =
  | "VITE_DEMO_API_KEY"
  | "VITE_DEMO_FLOW_SLUG"
  | "VITE_DEMO_API_URL"
  | "VITE_BOOKING_API_URL"
  | "VITE_BOOKING_WIDGET_URL"
  | "VITE_BOOKING_WIDGET_ORG";

function readRuntimeValue(key: RuntimeKey): string | undefined {
  if (typeof window !== "undefined" && window.__ENV__?.[key]) {
    return window.__ENV__[key];
  }

  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function normalizeUrl(value: string | undefined): string | undefined {
  const normalized = value?.trim().replace(/\/+$/, "");
  return normalized || undefined;
}

export const landingRuntimeConfig = {
  DEMO_API_KEY: readRuntimeValue("VITE_DEMO_API_KEY"),
  DEMO_FLOW_SLUG: readRuntimeValue("VITE_DEMO_FLOW_SLUG"),
  DEMO_API_URL: normalizeUrl(readRuntimeValue("VITE_DEMO_API_URL")),
  BOOKING_API_URL: normalizeUrl(readRuntimeValue("VITE_BOOKING_API_URL")),
  BOOKING_WIDGET_URL: normalizeUrl(readRuntimeValue("VITE_BOOKING_WIDGET_URL")),
  BOOKING_WIDGET_ORG: readRuntimeValue("VITE_BOOKING_WIDGET_ORG")?.trim() || undefined,
};
