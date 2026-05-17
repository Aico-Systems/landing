declare global {
  interface Window {
    __ENV__?: Record<string, string | undefined>;
  }
}

function readRuntimeValue(
  key: string,
  buildValue: string | boolean | undefined,
): string | undefined {
  if (typeof window !== "undefined") {
    const runtimeValue = window.__ENV__?.[key];
    if (typeof runtimeValue === "string" && runtimeValue.length > 0) {
      return runtimeValue;
    }
  }

  return typeof buildValue === "string" && buildValue.length > 0
    ? buildValue
    : undefined;
}

function normalizeUrl(value: string | undefined): string | undefined {
  const normalized = value?.trim().replace(/\/+$/, "");
  return normalized || undefined;
}

// Dev-mode fallbacks for the AICOYO demo. These match the values in
// `seeds-demo/profiles/demo/flows/demo.json` (slug `demomesse`, org
// `DEMO`) and the host-mode backend port. In production, env vars are
// required — the widget + hero orb just won't render without them.
const DEV_FALLBACK = {
  DEMO_FLOW_SLUG: "demomesse",
  DEMO_FLOW_ORG: "DEMO",
  DEMO_API_URL: "http://localhost:8000",
} as const;

function devDefault(
  value: string | undefined,
  key: keyof typeof DEV_FALLBACK,
): string | undefined {
  if (value) return value;
  if (import.meta.env.DEV) return DEV_FALLBACK[key];
  return undefined;
}

export const landingRuntimeConfig = {
  // `<aico-flow>` widget — bottom-right floating chat/voice + hero orb.
  // Resolved at runtime via slug+org because flow UUIDs aren't stable
  // across backend reseeds.
  DEMO_FLOW_SLUG: devDefault(
    readRuntimeValue(
      "VITE_DEMO_FLOW_SLUG",
      import.meta.env.VITE_DEMO_FLOW_SLUG,
    )?.trim() || undefined,
    "DEMO_FLOW_SLUG",
  ),
  DEMO_FLOW_ORG: devDefault(
    readRuntimeValue(
      "VITE_DEMO_FLOW_ORG",
      import.meta.env.VITE_DEMO_FLOW_ORG,
    )?.trim() || undefined,
    "DEMO_FLOW_ORG",
  ),
  DEMO_API_URL: devDefault(
    normalizeUrl(
      readRuntimeValue("VITE_DEMO_API_URL", import.meta.env.VITE_DEMO_API_URL),
    ),
    "DEMO_API_URL",
  ),
  // Standalone booking widget (separate product — kept as-is).
  BOOKING_API_URL: normalizeUrl(
    readRuntimeValue(
      "VITE_BOOKING_API_URL",
      import.meta.env.VITE_BOOKING_API_URL,
    ),
  ),
  BOOKING_WIDGET_URL: normalizeUrl(
    readRuntimeValue(
      "VITE_BOOKING_WIDGET_URL",
      import.meta.env.VITE_BOOKING_WIDGET_URL,
    ),
  ),
  BOOKING_WIDGET_ORG:
    readRuntimeValue(
      "VITE_BOOKING_WIDGET_ORG",
      import.meta.env.VITE_BOOKING_WIDGET_ORG,
    )?.trim() || undefined,
};
