<script lang="ts">
  import Navigation from "../components/Navigation.svelte";
  import Footer from "../components/Footer.svelte";
  import {
    requestAppNavigation,
    shouldHandleClientNavigation,
    type AppPath,
  } from "../utils/appNavigation";

  export let title = "";
  export let description = "";
  export let eyebrow = "";
  export let lede = "";
  export let activePath: AppPath | null = null;
  export let maxWidth = "980px";
  export let shellWidth: string | null = null;
  export let showBackHome = true;
  export let backHomeLabel = "Zurück zur Startseite";

  function handleNavigate(event: MouseEvent, path: AppPath) {
    if (!shouldHandleClientNavigation(event)) return;
    event.preventDefault();
    requestAppNavigation(path);
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AICOYO",
    url: "https://aicoyo.com",
    logo: "https://aicoyo.com/Logo.svg",
    description: "AI-powered voice agent infrastructure. Design, deploy, and monitor voice agents with enterprise telephony, RAG, and live tooling.",
    sameAs: [
      "https://www.linkedin.com/company/aicoyo",
      "https://x.com/aicoyo"
    ]
  })}<\/script>`}
</svelte:head>

<Navigation currentPath={activePath || "/"} />

<main
  class="legal-main"
  style={`--legal-main-width: ${maxWidth}; --legal-shell-width: ${shellWidth || maxWidth};`}
>
  <span class="eyebrow">{eyebrow}</span>
  <h1>{title}</h1>
  <p class="lede">{lede}</p>
  <slot />
  {#if showBackHome}
    <a class="back-home" href="/" on:click={(event) => handleNavigate(event, "/")}
      >{backHomeLabel}</a
    >
  {/if}
</main>

<Footer />

<style>
  :global(body) {
    background:
      radial-gradient(circle at 65% -10%, rgba(94, 234, 212, 0.18), transparent 34%),
      linear-gradient(180deg, #050b16 0%, #09101d 100%);
  }

  .legal-main {
    width: min(var(--legal-main-width, 980px), calc(100% - 32px));
    margin: 0 auto;
    padding: 128px 0 88px;
    color: var(--text-primary);
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(94, 234, 212, 0.2);
    background: rgba(94, 234, 212, 0.08);
    color: #5eead4;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  h1 {
    margin: 18px 0 14px;
    font-size: clamp(34px, 6vw, 56px);
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .lede {
    margin: 0 0 28px;
    font-size: 18px;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 64ch;
  }

  .back-home {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid rgba(86, 141, 171, 0.18);
    background: rgba(86, 141, 171, 0.08);
    color: var(--text-primary);
    text-decoration: none;
    transition: var(--transition-button);
  }

  .back-home:hover {
    border-color: rgba(86, 141, 171, 0.3);
    background: rgba(86, 141, 171, 0.14);
  }

  @media (max-width: 640px) {
    .legal-main {
      padding: 110px 0 72px;
    }

    .lede {
      font-size: 16px;
    }
  }
</style>
