<script lang="ts">
  /**
   * Hero CTA — the dotted-sphere `<aico-orb>`, click to start a voice
   * conversation. Owns its own LiveKit session; no relationship to the
   * `<aico-flow>` chat panel anchored at the page corner.
   *
   * When the demo env (slug / org / api-url) isn't set, the orb still
   * renders (so the hero has a visual) but the inner web component
   * shows its own "Set api-url + flow-slug to enable" status instead of
   * connecting on click.
   */
  import { onMount } from "svelte";
  import { theme } from "../../stores/theme";
  import { landingRuntimeConfig } from "../config";
  import { ensureWidgetScript } from "../utils/widgetBundle";
  import { accentFor } from "../utils/widgetTheme";
  import { t } from "../../i18n";

  let ready = $state(false);

  const apiUrl = landingRuntimeConfig.DEMO_API_URL ?? "";
  const flowSlug = landingRuntimeConfig.DEMO_FLOW_SLUG ?? "";
  const flowOrg = landingRuntimeConfig.DEMO_FLOW_ORG ?? "";

  onMount(() => {
    ensureWidgetScript()
      .then(() => {
        ready = true;
      })
      .catch((err) => {
        console.warn("[aico-orb] widget bundle unavailable", err);
      });
  });
</script>

<div class="hero-orb" data-theme={$theme}>
  {#if ready}
    <aico-orb
      api-url={apiUrl}
      flow-slug={flowSlug}
      org={flowOrg}
      size="260"
      accent={accentFor($theme)}
      label={$t("hero.orb.label", { default: "Tap to talk" })}
    ></aico-orb>
  {:else}
    <div class="orb-placeholder" aria-hidden="true">
      <span class="orb-fallback"></span>
    </div>
  {/if}
</div>

<style>
  .hero-orb {
    width: 100%;
    min-height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .orb-placeholder {
    width: 260px;
    height: 260px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(167, 243, 208, 0.18),
      rgba(20, 91, 122, 0.32) 70%,
      transparent
    );
    box-shadow: 0 0 28px rgba(94, 234, 212, 0.16);
    animation: orb-pulse 2.4s ease-in-out infinite;
  }

  .orb-fallback {
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background: radial-gradient(
      circle at 35% 30%,
      rgba(167, 243, 208, 0.35),
      rgba(20, 91, 122, 0.55) 75%
    );
    box-shadow: 0 0 36px rgba(94, 234, 212, 0.24);
  }

  @keyframes orb-pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.85;
    }
    50% {
      transform: scale(1.04);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .hero-orb {
      min-height: 280px;
    }
    .orb-placeholder {
      width: 220px;
      height: 220px;
    }
  }
</style>
