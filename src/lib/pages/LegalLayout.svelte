<script lang="ts">
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

  const navLinks: Array<{ path: AppPath; label: string }> = [
    { path: "/imprint/", label: "Impressum" },
    { path: "/privacy/", label: "Datenschutz" },
    { path: "/terms/", label: "Nutzungsbedingungen" },
    { path: "/policies/", label: "Richtlinien" },
  ];

  function handleNavigate(event: MouseEvent, path: AppPath) {
    if (!shouldHandleClientNavigation(event)) return;
    event.preventDefault();
    requestAppNavigation(path);
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<header class="legal-header">
  <div class="legal-shell">
    <a class="brand-link" href="/" on:click={(event) => handleNavigate(event, "/")}>
      <span class="brand-copy">
        <img src="/Logo.svg" alt="AICOYO" />
        <span>AICOYO</span>
      </span>
      <span class="brand-pill">Voice AI</span>
    </a>
    <nav class="legal-nav" aria-label="Legal navigation">
      {#each navLinks as link}
        <a
          href={link.path}
          aria-current={activePath === link.path ? "page" : undefined}
          on:click={(event) => handleNavigate(event, link.path)}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
</header>

<main class="legal-main">
  <span class="eyebrow">{eyebrow}</span>
  <h1>{title}</h1>
  <p class="lede">{lede}</p>
  <slot />
  <a class="back-home" href="/" on:click={(event) => handleNavigate(event, "/")}
    >Zurueck zur Startseite</a
  >
</main>

<footer class="legal-footer">
  <div class="legal-shell">
    © 2026 AICOYO. Landing Pages und rechtliche Hinweise.
  </div>
</footer>

<style>
  :global(body) {
    background:
      radial-gradient(circle at 65% -10%, rgba(94, 234, 212, 0.18), transparent 34%),
      linear-gradient(180deg, #050b16 0%, #09101d 100%);
  }

  .legal-header {
    position: sticky;
    top: 0;
    z-index: 20;
    border-bottom: 1px solid rgba(86, 141, 171, 0.14);
    background: rgba(5, 11, 22, 0.84);
    backdrop-filter: blur(16px);
  }

  .legal-shell {
    width: min(1120px, calc(100% - 32px));
    margin: 0 auto;
  }

  .legal-header .legal-shell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 18px 0;
  }

  .brand-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .brand-link img {
    height: 30px;
    width: auto;
  }

  .brand-copy {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .brand-pill {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid rgba(94, 234, 212, 0.22);
    background: rgba(94, 234, 212, 0.1);
    color: #5eead4;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .legal-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
  }

  .legal-nav a {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid transparent;
    color: var(--text-secondary);
    text-decoration: none;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
  }

  .legal-nav a:hover,
  .legal-nav a[aria-current="page"] {
    color: var(--text-primary);
    border-color: rgba(86, 141, 171, 0.2);
    background: rgba(86, 141, 171, 0.08);
  }

  .legal-main {
    width: min(980px, calc(100% - 32px));
    margin: 0 auto;
    padding: 72px 0 88px;
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

  .legal-footer {
    border-top: 1px solid rgba(86, 141, 171, 0.14);
    color: var(--text-secondary);
  }

  .legal-footer .legal-shell {
    padding: 22px 0 40px;
    font-size: 14px;
  }

  @media (max-width: 860px) {
    .legal-header .legal-shell {
      flex-direction: column;
      align-items: flex-start;
    }

    .legal-nav {
      justify-content: flex-start;
    }
  }

  @media (max-width: 640px) {
    .legal-main {
      padding: 56px 0 72px;
    }

    .lede {
      font-size: 16px;
    }
  }
</style>
