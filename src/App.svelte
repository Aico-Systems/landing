<script lang="ts">
  import { onMount, tick } from "svelte";
  import Navigation from "./lib/components/Navigation.svelte";
  import Footer from "./lib/components/Footer.svelte";
  import LazyComponent from "./lib/components/LazyComponent.svelte";
  import Hero from "./lib/sections/Hero.svelte";
  import {
    SECTION_NAVIGATION_EVENT,
    getSectionIdFromHash,
    scrollToSectionElement,
    type SectionId,
    type SectionNavigationDetail,
  } from "./lib/utils/sectionNavigation";

  const lazyHowItWorks = () => import("./lib/sections/HowItWorks.svelte");
  const lazyFeatures = () => import("./lib/sections/Features.svelte");
  const lazyUseCases = () => import("./lib/sections/UseCases.svelte");
  const lazyBookingSection = () => import("./lib/sections/BookingSection.svelte");
  const lazyTestimonials = () => import("./lib/sections/Testimonials.svelte");
  const lazyContactSection = () =>
    import("./lib/sections/ContactSection.svelte");
  const lazyCTASection = () => import("./lib/sections/CTASection.svelte");

  let WebGLBackground: any = null;
  let loadAllSections = false;
  let pendingNavigation: { sectionId: SectionId; behavior: ScrollBehavior } | null =
    null;

  const wait = (ms: number) =>
    new Promise<void>((resolve) => window.setTimeout(resolve, ms));

  async function waitForSectionElement(
    sectionId: SectionId,
    timeoutMs = 5000,
  ): Promise<boolean> {
    const start = performance.now();

    while (performance.now() - start <= timeoutMs) {
      if (document.getElementById(sectionId)) {
        return true;
      }

      await wait(50);
    }

    return false;
  }

  async function navigateToSection(
    sectionId: SectionId,
    behavior: ScrollBehavior = "smooth",
  ) {
    pendingNavigation = { sectionId, behavior };

    if (sectionId !== "hero") {
      loadAllSections = true;
    }

    await tick();
    const sectionReady =
      sectionId === "hero" ? true : await waitForSectionElement(sectionId);

    if (
      !sectionReady ||
      !pendingNavigation ||
      pendingNavigation.sectionId !== sectionId
    ) {
      return;
    }

    scrollToSectionElement(sectionId, behavior);
    pendingNavigation = null;
  }

  async function loadWebGLBackground() {
    if (WebGLBackground) return;

    const module = await import("./lib/components/WebGLBackground.svelte");
    WebGLBackground = module.default;
  }

  onMount(() => {
    const handleRequestedNavigation = (event: Event) => {
      const { sectionId, behavior = "smooth" } = (
        event as CustomEvent<SectionNavigationDetail>
      ).detail;

      void navigateToSection(sectionId, behavior);
    };

    const handleHashChange = () => {
      const sectionId = getSectionIdFromHash(window.location.hash);
      if (!sectionId) return;
      void navigateToSection(sectionId, "auto");
    };

    window.addEventListener(
      SECTION_NAVIGATION_EVENT,
      handleRequestedNavigation as EventListener,
    );
    window.addEventListener("hashchange", handleHashChange);

    const initialSection = getSectionIdFromHash(window.location.hash);
    if (initialSection) {
      void navigateToSection(initialSection, "auto");
    }

    if ("requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          void loadWebGLBackground();
        },
        { timeout: 2000 },
      );
    } else {
      setTimeout(() => {
        void loadWebGLBackground();
      }, 0);
    }

    return () => {
      window.removeEventListener(
        SECTION_NAVIGATION_EVENT,
        handleRequestedNavigation as EventListener,
      );
      window.removeEventListener("hashchange", handleHashChange);
    };
  });
</script>

{#if WebGLBackground}
  <svelte:component this={WebGLBackground} />
{/if}
<div class="blur-layer"></div>

<Navigation />

<main>
  <Hero />
  <svelte:component
    this={LazyComponent}
    component={lazyHowItWorks}
    eager={loadAllSections}
    rootMargin="200px"
  />
  <svelte:component
    this={LazyComponent}
    component={lazyFeatures}
    eager={loadAllSections}
    rootMargin="200px"
  />
  <svelte:component
    this={LazyComponent}
    component={lazyUseCases}
    eager={loadAllSections}
    rootMargin="200px"
  />
  <svelte:component
    this={LazyComponent}
    component={lazyBookingSection}
    eager={loadAllSections}
    rootMargin="200px"
  />
  <svelte:component
    this={LazyComponent}
    component={lazyTestimonials}
    eager={loadAllSections}
    rootMargin="200px"
  />
  <svelte:component
    this={LazyComponent}
    component={lazyContactSection}
    eager={loadAllSections}
    rootMargin="200px"
  />
  <svelte:component
    this={LazyComponent}
    component={lazyCTASection}
    eager={loadAllSections}
    rootMargin="200px"
  />
  <Footer />
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family:
      "Sora",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    overflow-x: hidden;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  main {
    width: 100%;
    overflow-x: hidden;
    position: relative;
    z-index: 2;
  }

  :global(section) {
    position: relative;
    z-index: 2;
  }

  :global(section[id]) {
    scroll-margin-top: 104px;
  }

  :global(h1, h2, h3, h4, h5, h6) {
    font-weight: 700;
    line-height: 1.2;
    /* Optimize text rendering */
    text-rendering: optimizeSpeed;
    /* Ensure readability over globe */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  :global([data-theme="dark"] h1),
  :global([data-theme="dark"] h2),
  :global([data-theme="dark"] h3),
  :global([data-theme="dark"] h4),
  :global([data-theme="dark"] h5),
  :global([data-theme="dark"] h6) {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }

  :global(a) {
    text-decoration: none;
    color: inherit;
  }

  :global(.container) {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  :global(.btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 10px 18px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
    border: 1px solid transparent;
    text-align: center;
    box-shadow: none;
  }

  :global(.btn-primary) {
    background: #145b7a;
    border-color: #145b7a;
    color: white;
  }

  :global(.btn-primary:hover) {
    background: #114d67;
    border-color: #114d67;
    box-shadow: 0 1px 0 rgba(15, 23, 42, 0.12);
  }

  :global(.btn-secondary) {
    background: rgba(255, 255, 255, 0.78);
    color: var(--text-primary);
    border-color: rgba(15, 23, 42, 0.12);
  }

  :global(.btn-secondary:hover) {
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(20, 91, 122, 0.28);
    box-shadow: 0 1px 0 rgba(15, 23, 42, 0.08);
  }

  :global([data-theme="dark"] .btn-secondary) {
    background: rgba(15, 23, 42, 0.72);
    border-color: rgba(148, 163, 184, 0.22);
  }

  :global([data-theme="dark"] .btn-secondary:hover) {
    background: rgba(15, 23, 42, 0.88);
    border-color: rgba(167, 243, 208, 0.22);
  }

</style>
