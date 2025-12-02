<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { theme, toggleTheme } from "../../stores/theme";
  import Icon from "./Icon.svelte";

  const sections = [
    { id: "how-it-works", label: "Launch Plan" },
    { id: "features", label: "Platform" },
    { id: "use-cases", label: "Solutions" },
    { id: "testimonials", label: "Customers" },
    { id: "contact", label: "Contact" },
  ];

  let isScrolled = false;
  let activeSection = "hero";

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Throttled scroll handler for better performance
  let scrollTimeout: number;
  let rafId: number;

  function handleScroll() {
    if (typeof window === "undefined") return;

    // Cancel any pending RAF
    if (rafId) cancelAnimationFrame(rafId);

    // Use RAF for smooth updates
    rafId = requestAnimationFrame(() => {
      isScrolled = window.scrollY > 8;

      // Throttle active section calculation
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        const midpoint = window.scrollY + window.innerHeight / 2;
        const order = [
          "hero",
          "how-it-works",
          "features",
          "use-cases",
          "testimonials",
          "contact",
          "cta",
        ];

        for (const id of order) {
          const node = document.getElementById(id);
          if (!node) continue;
          const rect = node.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + rect.height;
          if (midpoint >= top && midpoint <= bottom) {
            activeSection = id;
            break;
          }
        }
      }, 50); // Throttle to every 50ms
    });
  }

  onMount(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
  });

  onDestroy(() => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
    clearTimeout(scrollTimeout);
    if (rafId) cancelAnimationFrame(rafId);
  });
</script>

<nav class:scrolled={isScrolled}>
  <div class="container nav-shell">
    <button
      type="button"
      class="brand"
      on:click={() => scrollToSection("hero")}
      aria-label="Go to hero"
    >
      <img src="/Logo.png" alt="Aico" class="logo-img" />
      <span class="logo-text">Aico</span>
      <span class="brand-pill">Voice AI</span>
    </button>

    <div class="nav-center">
      {#each sections as section}
        <button
          type="button"
          class="nav-link"
          class:active={activeSection === section.id}
          on:click={() => scrollToSection(section.id)}
        >
          <span>{section.label}</span>
          <span class="indicator"></span>
        </button>
      {/each}
    </div>

    <div class="nav-actions">
      <button
        type="button"
        on:click={toggleTheme}
        class="theme-toggle"
        aria-label="Toggle theme"
      >
        {#if $theme === "light"}
          <Icon name="moon" size={18} />
        {:else}
          <Icon name="sun" size={18} />
        {/if}
      </button>
      <button
        type="button"
        class="btn btn-secondary ghost"
        on:click={() => scrollToSection("use-cases")}
      >
        See Aico in action
      </button>
      <button
        type="button"
        class="btn btn-primary nav-cta"
        on:click={() => scrollToSection("cta")}
      >
        Book a pilot
      </button>
    </div>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    background: rgba(6, 10, 20, 0.24);
    border-bottom: 1px solid transparent;
    backdrop-filter: blur(16px);
    /* GPU acceleration */
    will-change: background, border-color;
    transform: translateZ(0);
  }

  :global([data-theme="light"]) nav {
    background: rgba(247, 248, 255, 0.7);
  }

  nav.scrolled {
    background: rgba(6, 10, 20, 0.6);
    border-bottom-color: rgba(102, 126, 234, 0.18);
    box-shadow: 0 18px 36px rgba(10, 15, 30, 0.25);
  }

  :global([data-theme="light"]) nav.scrolled {
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  }

  .nav-shell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 18px 0;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 14px;
    border-radius: 18px;
    transition:
      background 0.3s ease,
      transform 0.3s ease;
    color: var(--text-primary);
  }

  .brand:hover {
    background: rgba(102, 126, 234, 0.12);
    transform: translateY(-1px);
  }

  .logo-img {
    height: 28px;
    width: auto;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .brand-pill {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(118, 141, 255, 0.9);
    border: 1px solid rgba(102, 126, 234, 0.32);
    border-radius: 999px;
    padding: 4px 10px;
  }

  :global([data-theme="light"]) .brand-pill {
    color: #4c5fe3;
  }

  .nav-center {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .nav-link {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 0;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--text-tertiary);
    transition: color 0.3s ease;
  }

  .nav-link:hover {
    color: var(--text-secondary);
  }

  .nav-link .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -8px;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    opacity: 0;
    transform: scaleX(0.4);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .nav-link.active {
    color: var(--text-primary);
  }

  .nav-link.active .indicator {
    opacity: 1;
    transform: scaleX(1);
  }

  .nav-actions {
    display: inline-flex;
    align-items: center;
    gap: 14px;
  }

  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(102, 126, 234, 0.28);
    background: rgba(102, 126, 234, 0.12);
    color: #4c5fe3;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      border-color 0.3s ease,
      background 0.3s ease;
  }

  .theme-toggle:hover {
    transform: translateY(-1px);
    border-color: rgba(102, 126, 234, 0.45);
    background: rgba(102, 126, 234, 0.2);
  }

  :global([data-theme="dark"]) .theme-toggle {
    color: #e2e8f0;
    background: rgba(37, 47, 89, 0.4);
    border-color: rgba(102, 126, 234, 0.22);
  }

  .ghost {
    padding: 10px 20px !important;
    border-radius: 14px !important;
    border: 1px solid rgba(102, 126, 234, 0.3) !important;
    background: rgba(102, 126, 234, 0.1) !important;
    color: #dbe4ff !important;
  }

  :global([data-theme="light"]) .ghost {
    color: #4c5fe3 !important;
    background: rgba(102, 126, 234, 0.12) !important;
  }

  .ghost:hover {
    border-color: rgba(102, 126, 234, 0.6) !important;
    background: rgba(102, 126, 234, 0.2) !important;
  }

  .nav-cta {
    padding: 10px 22px !important;
    border-radius: 14px !important;
    font-size: 14px !important;
  }

  @media (max-width: 960px) {
    .nav-center {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .nav-shell {
      gap: 16px;
    }

    .brand {
      padding: 6px 10px;
    }

    .brand-pill {
      display: none;
    }

    .ghost {
      display: none !important;
    }

    .nav-cta {
      padding: 10px 18px !important;
    }
  }
</style>
