/**
 * Intersection Observer utility for lazy loading components
 * Provides a reusable action for Svelte components to trigger loading when visible
 */

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * Svelte action for lazy loading content when it enters the viewport
 * Usage: <div use:lazyLoad on:visible={() => loadContent()}>
 */
export function lazyLoad(
  node: HTMLElement,
  options: LazyLoadOptions = {}
): { destroy: () => void } {
  const { rootMargin = '50px', threshold = 0, once = true } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Dispatch custom event when element becomes visible
          node.dispatchEvent(
            new CustomEvent('visible', {
              detail: { entry }
            })
          );

          // Optionally disconnect after first intersection
          if (once) {
            observer.disconnect();
          }
        }
      });
    },
    {
      rootMargin,
      threshold
    }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}

/**
 * Dynamic component loader for lazy loading Svelte components
 * Returns a promise that resolves when component should be loaded
 */
export function createLazyLoader() {
  return new Promise<void>((resolve) => {
    // Use requestIdleCallback to defer loading until browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => resolve(), { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => resolve(), 100);
    }
  });
}

/**
 * Preload an image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
