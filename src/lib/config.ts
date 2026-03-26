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

export const landingRuntimeConfig = {
  DEMO_API_KEY: readRuntimeValue(
    "VITE_DEMO_API_KEY",
    import.meta.env.VITE_DEMO_API_KEY,
  ),
  DEMO_FLOW_SLUG: readRuntimeValue(
    "VITE_DEMO_FLOW_SLUG",
    import.meta.env.VITE_DEMO_FLOW_SLUG,
  ),
  DEMO_API_URL: normalizeUrl(
    readRuntimeValue("VITE_DEMO_API_URL", import.meta.env.VITE_DEMO_API_URL),
  ),
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
