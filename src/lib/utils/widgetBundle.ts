/**
 * Lazy loader for the `<aico-flow>` + `<aico-orb>` widget bundle.
 *
 * The widget is a sibling package in the monorepo, built as an IIFE that
 * registers both custom elements on evaluation. We resolve its dist URL
 * via Vite's `?url` query (typed in `vite-env.d.ts`) so svelte-check
 * doesn't have to parse the minified bundle, and load it via a `<script>`
 * tag on first call. Subsequent callers reuse the same promise.
 *
 * Build the widget once after a fresh clone (`with-env.sh` does this
 * automatically when `widget/dist/widget.js` is missing).
 */
import widgetBundleUrl from "../../../../widget/dist/widget.js?url";

let scriptPromise: Promise<void> | null = null;

export function ensureWidgetScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.customElements.get("aico-flow")) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[data-aico-flow-widget="true"]',
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("widget script load failed")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = widgetBundleUrl;
    script.async = true;
    script.dataset.aicoFlowWidget = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("widget script load failed"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}
