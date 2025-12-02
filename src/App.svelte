<script lang="ts">
  import { onMount } from "svelte";
  import Footer from "./lib/components/Footer.svelte";

  // Defer ALL imports except critical components
  let Navigation: any;
  let Hero: any;
  let LazyComponent: any;

  // Lazy load heavy components using dynamic imports
  const lazyWebGLBackground = () =>
    import("./lib/components/WebGLBackground.svelte");
  const lazyHowItWorks = () => import("./lib/sections/HowItWorks.svelte");
  const lazyFeatures = () => import("./lib/sections/Features.svelte");
  const lazyUseCases = () => import("./lib/sections/UseCases.svelte");
  const lazyTestimonials = () => import("./lib/sections/Testimonials.svelte");
  const lazyContactSection = () =>
    import("./lib/sections/ContactSection.svelte");
  const lazyCTASection = () => import("./lib/sections/CTASection.svelte");

  let showWebGL = false;
  let isReady = false;

  onMount(async () => {
    // Load critical components immediately
    const [navModule, heroModule, lazyModule] = await Promise.all([
      import("./lib/components/Navigation.svelte"),
      import("./lib/sections/Hero.svelte"),
      import("./lib/components/LazyComponent.svelte"),
    ]);

    Navigation = navModule.default;
    Hero = heroModule.default;
    LazyComponent = lazyModule.default;
    isReady = true;

    // Defer heavy initialization to next idle period
    requestIdleCallback(
      () => {
        requestAnimationFrame(() => {
          showWebGL = true;
        });
      },
      { timeout: 2000 },
    );
  });
</script>

{#if isReady}
  {#if showWebGL && LazyComponent}
    <svelte:component this={LazyComponent} component={lazyWebGLBackground} />
  {/if}
  <div class="blur-layer"></div>

  {#if Navigation}
    <svelte:component this={Navigation} />
  {/if}

  <main>
    {#if Hero}
      <svelte:component this={Hero} />
    {/if}

    {#if LazyComponent}
      <svelte:component
        this={LazyComponent}
        component={lazyHowItWorks}
        rootMargin="200px"
      />
      <svelte:component
        this={LazyComponent}
        component={lazyFeatures}
        rootMargin="200px"
      />
      <svelte:component
        this={LazyComponent}
        component={lazyUseCases}
        rootMargin="200px"
      />
      <svelte:component
        this={LazyComponent}
        component={lazyTestimonials}
        rootMargin="200px"
      />
      <svelte:component
        this={LazyComponent}
        component={lazyContactSection}
        rootMargin="200px"
      />
      <svelte:component
        this={LazyComponent}
        component={lazyCTASection}
        rootMargin="200px"
      />
    {/if}
    <Footer />
  </main>
{:else}
  <!-- Ultra-minimal loading state -->
  <div class="app-loading">
    <div class="spinner"></div>
  </div>
{/if}

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family:
      "Inter",
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
    /* Enable content-visibility for better rendering performance */
    content-visibility: auto;
    contain-intrinsic-size: auto 500px;
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
    display: inline-block;
    padding: 14px 32px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    border: none;
    text-align: center;
    /* GPU acceleration for smoother animations */
    will-change: transform;
    transform: translateZ(0);
  }

  :global(.btn-primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  :global(.btn-primary:hover) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }

  :global(.btn-secondary) {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
  }

  :global(.btn-secondary:hover) {
    background: #667eea;
    color: white;
  }

  /* Loading spinner styles */
  .app-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-primary);
    z-index: 9999;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(102, 126, 234, 0.1);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
