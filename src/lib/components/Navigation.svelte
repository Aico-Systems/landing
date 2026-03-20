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
  let mobileMenuOpen = false;

  function navigate(sectionId: SectionId) {
    activeSection = sectionId;
    mobileMenuOpen = false;
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
    window.addEventListener("resize", closeMobileMenuOnDesktop, { passive: true });
  });

  onDestroy(() => {
    window.removeEventListener("scroll", updateScrolledState);
    window.removeEventListener("resize", observeSections);
    window.removeEventListener("resize", closeMobileMenuOnDesktop);
    sectionObserver?.disconnect();
    sectionMutationObserver?.disconnect();
  });

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenuOnDesktop() {
    if (window.innerWidth > 640) {
      mobileMenuOpen = false;
    }
  }
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
        <img src="/Logo.svg" alt="AICOYO" class="logo-img" />
        <span class="logo-text">AICOYO</span>
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
          on:click={() => navigate("use-cases")}>See AICOYO in action</button
        >
        <button
          type="button"
          class="btn btn-primary nav-cta"
          on:click={() => navigate("booking")}>Book a pilot</button
        >
        <button
          type="button"
          class="menu-toggle"
          class:expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          on:click={toggleMobileMenu}
        >
          <span class="toggle-icon" aria-hidden="true">
            <span class="line line-1"></span>
            <span class="line line-2"></span>
            <span class="line line-3"></span>
          </span>
        </button>
      </div>
    </div>
    <div class="mobile-panel" class:open={mobileMenuOpen}>
      <div class="mobile-links">
        {#each sections as section}
          <button
            type="button"
            class="mobile-link"
            class:active={activeSection === section.id}
            on:click={() => navigate(section.id)}
          >
            {section.label}
          </button>
        {/each}
        <button
          type="button"
          class="mobile-link mobile-link-secondary"
          on:click={() => navigate("use-cases")}
        >
          See AICOYO in action
        </button>
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
    padding: 10px 12px;
    border-radius: var(--blueprint-radius-lg);
    border: 1px solid var(--border-subtle);
    background: var(--surface-overlay);
    backdrop-filter: blur(10px);
    box-shadow: var(--panel-shadow);
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
    padding: 10px 16px;
    box-shadow: var(--panel-shadow-lg);
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
    background: var(--surface-muted);
    border-color: var(--accent-border);
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--control-height-sm);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    line-height: 1;
    color: var(--accent-primary);
    border: 1px solid var(--accent-border);
    border-radius: 999px;
    padding: 0 8px;
    background: var(--accent-soft);
    white-space: nowrap;
  }
  .nav-center {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .nav-link {
    position: relative;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    min-height: var(--control-height-md);
    padding: 0 10px;
    border-radius: var(--blueprint-radius-md);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-secondary);
    white-space: nowrap;
    transition:
      color 0.2s ease,
      background 0.2s ease,
      border-color 0.2s ease;
  }
  .nav-link:hover {
    color: var(--text-primary);
    background: var(--surface-muted);
    border-color: var(--border-subtle);
  }
  .nav-link .indicator {
    display: none;
  }
  .nav-link.active {
    color: var(--text-primary);
    background: var(--accent-soft);
    border-color: var(--accent-border);
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
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition-button);
  }
  .menu-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition-button);
  }
  .menu-toggle:hover {
    background: var(--surface-muted);
    color: var(--text-primary);
  }
  .menu-toggle:active {
    transform: scale(0.96);
  }
  .toggle-icon {
    position: relative;
    width: 18px;
    height: 14px;
  }
  .line {
    position: absolute;
    display: block;
    left: 0;
    width: 18px;
    height: 2px;
    border-radius: 1px;
    background-color: currentColor;
    transition:
      transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
      opacity 220ms cubic-bezier(0.32, 0.72, 0, 1);
    will-change: transform, opacity;
  }
  .line-1 {
    top: 0;
  }
  .line-2 {
    top: 6px;
  }
  .line-3 {
    top: 12px;
  }
  .menu-toggle.expanded .line-1 {
    transform: translateY(6px) rotate(45deg);
  }
  .menu-toggle.expanded .line-2 {
    opacity: 0;
    transform: scaleX(0);
  }
  .menu-toggle.expanded .line-3 {
    transform: translateY(-6px) rotate(-45deg);
  }
  .mobile-panel {
    display: none;
  }
  .theme-toggle:hover {
    background: var(--surface-muted);
    color: var(--text-primary);
  }
  .ghost {
    min-height: var(--control-height-md) !important;
    padding: 0 12px !important;
    font-size: 13px !important;
    background: var(--surface-elevated) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-subtle) !important;
  }
  .ghost:hover {
    border-color: var(--accent-border) !important;
    background: var(--surface-elevated-strong) !important;
  }
  .nav-cta {
    min-height: var(--control-height-md) !important;
    padding: 0 14px !important;
    font-size: 13px !important;
  }
  @media (max-width: 960px) {
    .nav-frame {
      padding: 0 16px;
    }

    .nav-shell {
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }

    .nav-center {
      order: 3;
      width: 100%;
      overflow-x: auto;
      padding-bottom: 2px;
      scroll-snap-type: x proximity;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .nav-center::-webkit-scrollbar {
      display: none;
    }

    .nav-link {
      flex: 0 0 auto;
      scroll-snap-align: start;
    }

    .nav-actions {
      margin-left: auto;
    }
  }

  @media (max-width: 640px) {
    .nav-frame {
      padding: 0 10px;
    }
    nav.scrolled .nav-frame {
      padding: 0;
    }
    .nav-shell {
      gap: 8px;
      padding: 8px 10px;
      border-radius: 14px;
      background: var(--surface-overlay-strong);
      border-color: var(--border-subtle);
      box-shadow: var(--panel-shadow-lg);
      backdrop-filter: blur(10px);
    }
    .brand {
      gap: 8px;
      padding: 2px 2px;
    }
    .brand-pill {
      display: none;
    }
    .logo-img {
      height: 24px;
    }
    .logo-text {
      font-size: 14px;
    }
    .nav-center {
      display: none;
    }
    .nav-actions {
      gap: 5px;
    }
    .ghost {
      display: none !important;
    }
    .menu-toggle {
      display: inline-flex;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: transparent;
      color: var(--text-secondary);
    }
    .nav-cta {
      min-height: 34px !important;
      padding: 7px 12px !important;
      font-size: 12px !important;
      border-radius: 10px !important;
    }
    .theme-toggle {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: transparent;
      color: var(--text-secondary);
    }
    .mobile-panel {
      display: block;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition:
        max-height 0.24s ease,
        opacity 0.2s ease,
        transform 0.2s ease;
      transform: translateY(-4px);
      pointer-events: none;
    }
    .mobile-panel.open {
      max-height: 420px;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .mobile-links {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      margin-top: 6px;
      padding: 10px;
      border-radius: 14px;
      border: 1px solid var(--border-subtle);
      background: var(--surface-elevated-strong);
      box-shadow: var(--panel-shadow);
      backdrop-filter: blur(10px);
    }
    .mobile-link {
      width: 100%;
      display: flex;
      align-items: center;
      text-align: left;
      min-height: var(--control-height-md);
      padding: 0 12px;
      border-radius: var(--blueprint-radius-md);
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 600;
      line-height: 1.2;
      cursor: pointer;
      transition:
        background 0.2s ease,
        border-color 0.2s ease;
    }
    .mobile-link:hover {
      background: var(--surface-muted);
      border-color: var(--border-subtle);
    }
    .mobile-link.active {
      background: var(--accent-soft);
      border-color: var(--accent-border);
    }
    .mobile-link-secondary {
      color: var(--accent-primary);
    }
  }

  @media (max-width: 420px) {
    .nav-frame {
      padding: 0 8px;
    }

    .nav-shell {
      padding: 8px;
    }

    .nav-cta {
      padding: 8px 10px !important;
      font-size: 11px !important;
    }

    .mobile-links {
      gap: 6px;
      padding: 8px;
    }
  }
</style>
