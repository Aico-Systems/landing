/**
 * Shared animation utilities
 * Provides common animation helpers and performance optimizations
 */

/**
 * Setup optimized canvas context with performance settings
 */
export function setupCanvas(canvas: HTMLCanvasElement, options: { alpha?: boolean } = {}) {
  const ctx = canvas.getContext('2d', {
    alpha: options.alpha ?? true,
    desynchronized: true // Enable async rendering for better performance
  });

  if (!ctx) return null;

  // Cap device pixel ratio at 2x for performance
  const dpr = Math.min(window.devicePixelRatio, 2);
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.scale(dpr, dpr);

  return { ctx, dpr };
}

/**
 * Create a debounced resize handler for canvas
 */
export function createResizeHandler(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  callback?: () => void
) {
  let resizeTimeout: number;

  const resize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      callback?.();
    }, 100);
  };

  return { resize, cleanup: () => clearTimeout(resizeTimeout) };
}

/**
 * Create an Intersection Observer for visibility detection
 */
export function createVisibilityObserver(
  element: HTMLElement,
  onVisibilityChange: (isVisible: boolean) => void,
  options: IntersectionObserverInit = {}
) {
  const observer = new IntersectionObserver(
    (entries) => {
      onVisibilityChange(entries[0].isIntersecting);
    },
    { threshold: 0.1, ...options }
  );

  observer.observe(element);

  return {
    disconnect: () => observer.disconnect()
  };
}

/**
 * FPS-throttled animation frame
 */
export function createAnimationLoop(
  callback: (deltaTime: number) => void,
  targetFPS: number = 60
) {
  let animationFrameId: number;
  let lastFrameTime = 0;
  const frameInterval = 1000 / targetFPS;
  let isRunning = true;

  const loop = (currentTime: number) => {
    if (!isRunning) return;

    const elapsed = currentTime - lastFrameTime;

    if (elapsed >= frameInterval) {
      lastFrameTime = currentTime - (elapsed % frameInterval);
      callback(elapsed);
    }

    animationFrameId = requestAnimationFrame(loop);
  };

  // Start with requestIdleCallback if available
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loop(performance.now()), { timeout: 500 });
  } else {
    loop(performance.now());
  }

  return {
    stop: () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    }
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) return;
    timeout = window.setTimeout(() => {
      func.apply(this, args);
      timeout = undefined;
    }, limit);
  };
}

/**
 * Simple LRU cache for memoization
 */
export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Delete least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}
