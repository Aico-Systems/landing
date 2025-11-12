/**
 * Performance utilities for reducing reflows and optimizing DOM operations
 * DRY approach for common performance patterns
 */

/**
 * RequestAnimationFrame scheduler with automatic batching
 */
class RAFScheduler {
  private callbacks: Set<FrameRequestCallback> = new Set();
  private rafId: number | null = null;

  schedule(callback: FrameRequestCallback) {
    this.callbacks.add(callback);
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame((time) => {
        const cbs = Array.from(this.callbacks);
        this.callbacks.clear();
        this.rafId = null;
        
        cbs.forEach(cb => cb(time));
      });
    }

    return () => {
      this.callbacks.delete(callback);
    };
  }

  clear() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.callbacks.clear();
  }
}

export const rafScheduler = new RAFScheduler();

/**
 * Batch DOM reads and writes to prevent layout thrashing
 */
export class DOMBatcher {
  private readQueue: Array<() => void> = [];
  private writeQueue: Array<() => void> = [];
  private scheduled = false;

  read(callback: () => void) {
    this.readQueue.push(callback);
    this.schedule();
  }

  write(callback: () => void) {
    this.writeQueue.push(callback);
    this.schedule();
  }

  private schedule() {
    if (this.scheduled) return;
    
    this.scheduled = true;
    rafScheduler.schedule(() => {
      this.flush();
    });
  }

  private flush() {
    // Process all reads first
    const reads = this.readQueue.slice();
    this.readQueue = [];
    reads.forEach(read => read());

    // Then process all writes
    const writes = this.writeQueue.slice();
    this.writeQueue = [];
    writes.forEach(write => write());

    this.scheduled = false;
  }
}

export const domBatcher = new DOMBatcher();

/**
 * Debounce utility with leading option
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = undefined;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * Create a passive event listener (better scroll performance)
 */
export function addPassiveListener(
  element: EventTarget,
  event: string,
  handler: EventListener
) {
  element.addEventListener(event, handler, { passive: true });
  return () => element.removeEventListener(event, handler);
}

/**
 * Check if element is in viewport with margin
 */
export function isInViewport(
  element: HTMLElement,
  margin: number = 0
): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight + margin &&
    rect.bottom > -margin &&
    rect.left < window.innerWidth + margin &&
    rect.right > -margin
  );
}

/**
 * Virtual scroll helper - only render visible items
 */
export class VirtualScroller {
  private items: any[] = [];
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop: number = 0;

  constructor(itemHeight: number, containerHeight: number) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
  }

  setItems(items: any[]) {
    this.items = items;
  }

  setScrollTop(scrollTop: number) {
    this.scrollTop = scrollTop;
  }

  getVisibleRange(): { start: number; end: number; offset: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const end = Math.min(start + visibleCount + 1, this.items.length);

    return {
      start: Math.max(0, start - 1), // Add buffer
      end,
      offset: start * this.itemHeight
    };
  }
}

/**
 * Memory-efficient image loader with lazy loading
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
) {
  if (placeholder) {
    img.src = placeholder;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      });
    },
    { rootMargin: '50px' }
  );

  observer.observe(img);
  return () => observer.disconnect();
}

/**
 * Optimize font loading
 */
export async function loadFont(
  family: string,
  url: string,
  weight: string = '400'
): Promise<void> {
  if ('fonts' in document) {
    const font = new FontFace(family, `url(${url})`, { weight });
    await font.load();
    (document as any).fonts.add(font);
  }
}

/**
 * Reduce motion check with caching
 */
let prefersReducedMotionCache: boolean | null = null;
export function prefersReducedMotion(): boolean {
  if (prefersReducedMotionCache === null) {
    prefersReducedMotionCache = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }
  return prefersReducedMotionCache;
}

/**
 * Network quality detection
 */
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' {
  const nav = navigator as any;
  if (!nav.connection) return 'medium';

  const { effectiveType, downlink } = nav.connection;
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
    return 'slow';
  }
  if (effectiveType === '3g' || downlink < 5) {
    return 'medium';
  }
  return 'fast';
}

/**
 * CPU/Battery saver mode detection
 */
export function isLowPowerMode(): boolean {
  const nav = navigator as any;
  if (nav.getBattery) {
    // Battery API is async, so this is a simplified check
    return false; // Default to false, implement properly if needed
  }
  // Check for CPU cores as a proxy
  return navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
}
