<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { theme, toggleTheme } from "../../stores/theme";
  import {
    SECTION_IDS,
    isSectionId,
    requestSectionNavigation,
    type SectionId,
  } from "../utils/sectionNavigation";
  import Icon from "./Icon.svelte";

  const sections: Array<{ id: SectionId; label: string }> = [
    { id: "how-it-works", label: "Launch Plan" },
    { id: "features", label: "Platform" },
    { id: "use-cases", label: "Solutions" },
    { id: "booking", label: "Book Live" },
    { id: "testimonials", label: "Customers" },
    { id: "contact", label: "Contact" },
  ];

  let isScrolled = false;
  let activeSection: SectionId = "hero";
  let sectionObserver: IntersectionObserver | null = null;
  let sectionMutationObserver: MutationObserver | null = null;

  function navigate(sectionId: SectionId) {
    activeSection = sectionId;
    requestSectionNavigation(sectionId);
  }

  function updateScrolledState() {
    if (typeof window === "undefined") return;
    isScrolled = window.scrollY > 8;
    if (window.scrollY <= 8) {
      activeSection = "hero";
    }
  }

  function observeSections() {
    sectionObserver?.disconnect();

    sectionObserver = new IntersectionObserver(
      (entries) => {
        if (window.scrollY <= 8) {
          activeSection = "hero";
          return;
        }

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (entryA, entryB) =>
              entryB.intersectionRatio - entryA.intersectionRatio ||
              entryA.boundingClientRect.top - entryB.boundingClientRect.top,
          );

        const nextSectionId = visibleEntries[0]?.target.id;
        if (isSectionId(nextSectionId)) {
          activeSection = nextSectionId;
        }
      },
      {
        rootMargin: "-120px 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.65],
      },
    );

    for (const sectionId of SECTION_IDS) {
      const section = document.getElementById(sectionId);
      if (section) {
        sectionObserver.observe(section);
      }
    }
  }

  onMount(() => {
    updateScrolledState();
    observeSections();

    sectionMutationObserver = new MutationObserver(() => {
      observeSections();
    });
    sectionMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("scroll", updateScrolledState, { passive: true });
    window.addEventListener("resize", observeSections, { passive: true });
  });

  onDestroy(() => {
    window.removeEventListener("scroll", updateScrolledState);
    window.removeEventListener("resize", observeSections);
    sectionObserver?.disconnect();
    sectionMutationObserver?.disconnect();
  });
</script>

<nav class:scrolled={isScrolled}>
  <div class="nav-frame">
    <div class="nav-shell">
      <button
        type="button"
        class="brand"
        on:click={() => navigate("hero")}
        aria-label="Go to hero"
      >
        <img src="/Logo.svg" alt="AICO" class="logo-img" />
        <span class="logo-text">AICO</span>
        <span class="brand-pill">Voice AI</span>
      </button>
      <div class="nav-center">
        {#each sections as section}
          <button
            type="button"
            class="nav-link"
            class:active={activeSection === section.id}
            on:click={() => navigate(section.id)}
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
          {#if $theme === "light"}<Icon name="moon" size={18} />{:else}<Icon
              name="sun"
              size={18}
            />{/if}
        </button>
        <button
          type="button"
          class="btn btn-secondary ghost"
          on:click={() => navigate("use-cases")}>See AICO in action</button
        >
        <button
          type="button"
          class="btn btn-primary nav-cta"
          on:click={() => navigate("booking")}>Book a pilot</button
        >
      </div>
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
    padding-top: 14px;
    transition: padding 0.2s ease;
  }
  nav.scrolled {
    padding-top: 0;
  }
  .nav-frame {
    width: min(100%, 1600px);
    margin: 0 auto;
    padding: 0 24px;
    transition:
      width 0.24s ease,
      padding 0.24s ease;
  }
  nav.scrolled .nav-frame {
    width: 100%;
    padding: 0;
  }
  .nav-shell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin: 0 auto;
    padding: 10px 14px;
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(14px);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
    transition:
      border-radius 0.24s ease,
      padding 0.24s ease,
      box-shadow 0.24s ease,
      background-color 0.24s ease,
      border-color 0.24s ease;
  }
  nav.scrolled .nav-shell {
    width: 100%;
    border-radius: 0;
    border-left-color: transparent;
    border-right-color: transparent;
    padding: 10px 18px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  }
  :global([data-theme="dark"]) .nav-shell {
    border-color: rgba(148, 163, 184, 0.16);
    background: rgba(11, 18, 38, 0.74);
    box-shadow: 0 8px 24px rgba(2, 6, 23, 0.18);
  }
  :global([data-theme="dark"]) nav.scrolled .nav-shell {
    box-shadow: 0 10px 30px rgba(2, 6, 23, 0.24);
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 12px;
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
    color: var(--text-primary);
  }
  .brand:hover {
    background: rgba(20, 91, 122, 0.06);
    border-color: rgba(20, 91, 122, 0.12);
  }
  .logo-img {
    height: 28px;
    width: auto;
  }
  .logo-text {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .brand-pill {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #145b7a;
    border: 1px solid rgba(20, 91, 122, 0.16);
    border-radius: 999px;
    padding: 5px 8px;
    background: rgba(20, 91, 122, 0.05);
    white-space: nowrap;
  }
  :global([data-theme="dark"]) .brand-pill {
    color: #a7f3d0;
    border-color: rgba(167, 243, 208, 0.16);
    background: rgba(167, 243, 208, 0.06);
  }
  .nav-center {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .nav-link {
    position: relative;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-tertiary);
    white-space: nowrap;
    transition:
      color 0.2s ease,
      background 0.2s ease,
      border-color 0.2s ease;
  }
  .nav-link:hover {
    color: var(--text-primary);
    background: rgba(20, 91, 122, 0.05);
    border-color: rgba(20, 91, 122, 0.1);
  }
  .nav-link .indicator {
    display: none;
  }
  .nav-link.active {
    color: var(--text-primary);
    background: rgba(20, 91, 122, 0.08);
    border-color: rgba(20, 91, 122, 0.16);
  }
  :global([data-theme="dark"]) .nav-link:hover {
    background: rgba(167, 243, 208, 0.05);
    border-color: rgba(167, 243, 208, 0.08);
  }
  :global([data-theme="dark"]) .nav-link.active {
    background: rgba(167, 243, 208, 0.08);
    border-color: rgba(167, 243, 208, 0.14);
  }
  .nav-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(20, 91, 122, 0.16);
    background: rgba(20, 91, 122, 0.05);
    color: #145b7a;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      color 0.2s ease;
  }
  .theme-toggle:hover {
    border-color: rgba(20, 91, 122, 0.22);
    background: rgba(20, 91, 122, 0.1);
  }
  :global([data-theme="dark"]) .theme-toggle {
    color: #a7f3d0;
    background: rgba(167, 243, 208, 0.06);
    border-color: rgba(167, 243, 208, 0.14);
  }
  .ghost {
    min-height: 40px !important;
    padding: 9px 14px !important;
    font-size: 13px !important;
    background: rgba(255, 255, 255, 0.4) !important;
    color: #145b7a !important;
    border-color: rgba(20, 91, 122, 0.16) !important;
  }
  :global([data-theme="dark"]) .ghost {
    background: rgba(15, 23, 42, 0.62) !important;
    color: #cbd5e1 !important;
    border-color: rgba(148, 163, 184, 0.16) !important;
  }
  .ghost:hover {
    border-color: rgba(20, 91, 122, 0.24) !important;
    background: rgba(20, 91, 122, 0.08) !important;
  }
  .nav-cta {
    min-height: 40px !important;
    padding: 9px 16px !important;
    font-size: 13px !important;
  }
  @media (max-width: 960px) {
    .nav-center {
      display: none;
    }
  }
  @media (max-width: 640px) {
    .nav-frame {
      padding: 0 12px;
    }
    nav.scrolled .nav-frame {
      padding: 0;
    }
    .nav-shell {
      gap: 16px;
      padding: 9px 10px;
    }
    .brand {
      padding: 6px 8px;
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
