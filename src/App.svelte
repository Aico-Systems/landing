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
    text-rendering: optimizeLegibility;
  }

  :global(a) {
    text-decoration: none;
    color: inherit;
  }

  :global(.container) {
    max-width: var(--blueprint-content-max-width);
    margin: 0 auto;
    padding: 0 24px;
  }

  :global(.btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--control-height-lg);
    padding: 0 14px;
    border-radius: var(--blueprint-radius-md);
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: var(--transition-button);
    border: 1px solid var(--border-subtle);
    text-align: center;
    box-shadow: none;
  }

  :global(.btn-primary) {
    background: var(--button-primary-bg);
    border-color: var(--button-primary-bg);
    color: var(--button-primary-text);
  }

  :global(.btn-primary:hover) {
    background: var(--button-primary-bg-hover);
    border-color: var(--button-primary-bg-hover);
  }

  :global(.btn-secondary) {
    background: var(--button-secondary-bg);
    color: var(--button-secondary-text);
    border-color: var(--button-secondary-border);
  }

  :global(.btn-secondary:hover) {
    background: var(--button-secondary-bg-hover);
    border-color: var(--button-secondary-border-hover);
  }

  @media (max-width: 768px) {
    :global(.container) {
      padding: 0 18px;
    }

    :global(section[id]) {
      scroll-margin-top: 92px;
    }

    :global(h1, h2, h3, h4, h5, h6) {
      text-shadow: none;
    }
  }

  @media (max-width: 480px) {
    :global(.container) {
      padding: 0 14px;
    }
  }

</style>
