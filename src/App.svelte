<script lang="ts">
  import { onMount, tick } from "svelte";
  import Navigation from "./lib/components/Navigation.svelte";
  import Footer from "./lib/components/Footer.svelte";
  import LazyComponent from "./lib/components/LazyComponent.svelte";
  import Hero from "./lib/sections/Hero.svelte";
  import {
    APP_NAVIGATION_EVENT,
    normalizeAppPath,
    type AppNavigationDetail,
    type AppPath,
  } from "./lib/utils/appNavigation";
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
  const routeLoaders: Record<Exclude<AppPath, "/">, () => Promise<any>> = {
    "/imprint/": () => import("./lib/pages/ImprintPage.svelte"),
    "/privacy/": () => import("./lib/pages/PrivacyPage.svelte"),
    "/terms/": () => import("./lib/pages/TermsPage.svelte"),
    "/policies/": () => import("./lib/pages/PoliciesPage.svelte"),
    "/docs/": () => import("./lib/pages/DocsPage.svelte"),
    "/blog/": () => import("./lib/pages/BlogPage.svelte"),
    "/security/": () => import("./lib/pages/SecurityPage.svelte"),
    "/status/": () => import("./lib/pages/StatusPage.svelte"),
  };

  let WebGLBackground: any = null;
  let currentPageComponent: any = null;
  let currentPageProps: Record<string, unknown> | null = null;
  let currentPath: AppPath = "/";
  let loadAllSections = false;
  let pendingNavigation: { sectionId: SectionId; behavior: ScrollBehavior } | null =
    null;
  let routeLoadToken = 0;

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
    if (currentPath !== "/") {
      return;
    }

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

  function scheduleWebGLBackgroundLoad() {
    if (typeof window === "undefined" || currentPath !== "/" || WebGLBackground) return;

    if ("requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          void loadWebGLBackground();
        },
        { timeout: 2000 },
      );
      return;
    }

    setTimeout(() => {
      void loadWebGLBackground();
    }, 0);
  }

  function getBlogSlug(pathname: string): string | null {
    const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
    if (!match) return null;
    return decodeURIComponent(match[1]);
  }

  async function loadCurrentPage(pathname: string) {
    const blogSlug = getBlogSlug(pathname);
    if (blogSlug) {
      currentPath = "/blog/";
      pendingNavigation = null;
      const token = ++routeLoadToken;
      const module = await import("./lib/pages/BlogPostPage.svelte");
      if (routeLoadToken === token) {
        currentPageComponent = module.default;
        currentPageProps = { slug: blogSlug };
      }
      return;
    }

    const normalizedPath = normalizeAppPath(pathname) || "/";
    currentPath = normalizedPath;
    pendingNavigation = null;
    currentPageProps = null;

    if (normalizedPath === "/") {
      currentPageComponent = null;
      return;
    }

    const loader = routeLoaders[normalizedPath];
    const token = ++routeLoadToken;
    const module = await loader();

    if (routeLoadToken === token) {
      currentPageComponent = module.default;
    }
  }

  onMount(() => {
    void loadCurrentPage(window.location.pathname);

    const handleRequestedNavigation = (event: Event) => {
      const { sectionId, behavior = "smooth" } = (
        event as CustomEvent<SectionNavigationDetail>
      ).detail;

      void navigateToSection(sectionId, behavior);
    };

    const handleRequestedAppNavigation = (event: Event) => {
      const { path } = (event as CustomEvent<AppNavigationDetail>).detail;
      void loadCurrentPage(path);
    };

    const handleHashChange = () => {
      if (currentPath !== "/") return;
      const sectionId = getSectionIdFromHash(window.location.hash);
      if (!sectionId) return;
      void navigateToSection(sectionId, "auto");
    };

    const handlePopState = () => {
      void loadCurrentPage(window.location.pathname);
      if (normalizeAppPath(window.location.pathname) !== "/") {
        return;
      }

      const sectionId = getSectionIdFromHash(window.location.hash);
      if (sectionId) {
        void navigateToSection(sectionId, "auto");
      }
    };

    window.addEventListener(
      APP_NAVIGATION_EVENT,
      handleRequestedAppNavigation as EventListener,
    );
    window.addEventListener(
      SECTION_NAVIGATION_EVENT,
      handleRequestedNavigation as EventListener,
    );
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);

    const initialSection =
      normalizeAppPath(window.location.pathname) === "/"
        ? getSectionIdFromHash(window.location.hash)
        : null;
    if (initialSection) {
      void navigateToSection(initialSection, "auto");
    }

    scheduleWebGLBackgroundLoad();

    return () => {
      window.removeEventListener(
        APP_NAVIGATION_EVENT,
        handleRequestedAppNavigation as EventListener,
      );
      window.removeEventListener(
        SECTION_NAVIGATION_EVENT,
        handleRequestedNavigation as EventListener,
      );
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
    };
  });

  $: if (currentPath === "/") {
    scheduleWebGLBackgroundLoad();
  }
</script>

{#if currentPath === "/" && WebGLBackground}
  <svelte:component this={WebGLBackground} />
{/if}
{#if currentPath === "/"}
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
    <Footer />
  </main>
{:else if currentPageComponent}
  <svelte:component this={currentPageComponent} {...(currentPageProps || {})} />
{/if}

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
    overflow-x: clip;
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
