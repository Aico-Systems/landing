<script lang="ts">
  /**
   * Bottom-right `<aico-flow>` chat panel. **Text-only** — the voice CTA
   * lives in the hero as a standalone `<aico-orb>` and runs its own
   * LiveKit session, so the launcher's mic button is disabled here to
   * avoid two concurrent voice paths from one page.
   *
   * No-op when the demo env vars aren't set (slug / org / api-url). The
   * user gets no widget at all rather than a panel that opens to a
   * "Missing required attribute" message — strictly better UX for the
   * "developer just running landing dev" case.
   */
  import { onDestroy, onMount } from "svelte";
  import { locale } from "../../i18n";
  import { theme } from "../../stores/theme";
  import { landingRuntimeConfig } from "../config";
  import { ensureWidgetScript } from "../utils/widgetBundle";
  import { applyWidgetTheme, accentFor } from "../utils/widgetTheme";

  let widgetEl: HTMLElement | null = null;
  let widgetLocale: "en" | "de" = "en";

  const apiUrl = landingRuntimeConfig.DEMO_API_URL ?? "";
  const flowSlug = landingRuntimeConfig.DEMO_FLOW_SLUG ?? "";
  const flowOrg = landingRuntimeConfig.DEMO_FLOW_ORG ?? "";
  const isConfigured = Boolean(apiUrl && flowSlug && flowOrg);

  $: widgetLocale = $locale === "de" ? "de" : "en";

  function mountWidget() {
    if (!isConfigured || widgetEl) return;
    widgetEl = document.createElement("aico-flow");
    widgetEl.setAttribute("flow-slug", flowSlug);
    widgetEl.setAttribute("org", flowOrg);
    widgetEl.setAttribute("api-url", apiUrl);
    widgetEl.setAttribute("mode", "launcher");
    widgetEl.setAttribute("position", "bottom-right");
    widgetEl.setAttribute("voice", "off");
    widgetEl.setAttribute("theme", $theme);
    widgetEl.setAttribute("locale", widgetLocale);
    widgetEl.setAttribute("accent", accentFor($theme));
    widgetEl.setAttribute("title-text", "AICOYO");
    widgetEl.setAttribute(
      "subtitle",
      widgetLocale === "de" ? "Frag uns alles" : "Ask us anything",
    );
    applyWidgetTheme(widgetEl, $theme);
    document.body.appendChild(widgetEl);
  }

  onMount(() => {
    if (!isConfigured) return;
    ensureWidgetScript()
      .then(() => mountWidget())
      .catch((err) => {
        console.warn("[aico-flow] widget bundle unavailable", err);
      });
  });

  onDestroy(() => {
    widgetEl?.remove();
    widgetEl = null;
  });

  $: if (widgetEl) {
    widgetEl.setAttribute("theme", $theme);
    widgetEl.setAttribute("locale", widgetLocale);
    widgetEl.setAttribute("accent", accentFor($theme));
    applyWidgetTheme(widgetEl, $theme);
  }
</script>
