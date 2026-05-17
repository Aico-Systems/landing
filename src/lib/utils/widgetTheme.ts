/**
 * Maps the landing's CSS-variable palette onto the widget's `--af-*`
 * tokens. Set returned entries as inline style on `<aico-flow>` /
 * `<aico-orb>` host elements and they inherit through the shadow DOM.
 *
 * The widget defines its own light/dark token sets keyed on
 * `:host([data-theme=…])`; we override at instance level so the embed
 * tracks the landing's brand instead of the widget's stock indigo.
 *
 * Re-applied via a Svelte $effect on theme change — keeps the embed
 * visually in lockstep with the host page.
 */

export type WidgetTheme = "light" | "dark";

/**
 * Brand-aligned widget tokens for the AICOYO landing.
 *
 * - light → petrol primary, off-white surfaces
 * - dark  → mint primary on midnight base
 *
 * Token names match `widget/src/wc/aicoFlow.wc.svelte` :host block.
 */
export function widgetTokensFor(theme: WidgetTheme): Record<string, string> {
  if (theme === "dark") {
    return {
      "--af-accent": "#5eead4",
      "--af-accent-fg": "#06261f",
      "--af-bg": "#0b1226",
      "--af-bg-soft": "#0f172a",
      "--af-fg": "#f8fafc",
      "--af-fg-muted": "#94a3b8",
      "--af-border": "rgba(148, 163, 184, 0.16)",
      "--af-bubble-user": "#5eead4",
      "--af-bubble-user-fg": "#06261f",
      "--af-bubble-asst": "#1e293b",
      "--af-bubble-asst-fg": "#f8fafc",
      "--af-radius": "14px",
    };
  }
  return {
    "--af-accent": "#145b7a",
    "--af-accent-fg": "#ffffff",
    "--af-bg": "#ffffff",
    "--af-bg-soft": "#f6f8fb",
    "--af-fg": "#0f172a",
    "--af-fg-muted": "#64748b",
    "--af-border": "rgba(15, 23, 42, 0.08)",
    "--af-bubble-user": "#145b7a",
    "--af-bubble-user-fg": "#ffffff",
    "--af-bubble-asst": "#eef2f7",
    "--af-bubble-asst-fg": "#0f172a",
    "--af-radius": "14px",
  };
}

/** Apply the landing palette to a widget host element. */
export function applyWidgetTheme(
  el: HTMLElement | null,
  theme: WidgetTheme,
): void {
  if (!el) return;
  const tokens = widgetTokensFor(theme);
  for (const [name, value] of Object.entries(tokens)) {
    el.style.setProperty(name, value);
  }
}

/** Accent that matches the active landing theme — for `<aico-orb accent="…">`. */
export function accentFor(theme: WidgetTheme): string {
  return theme === "dark" ? "#5eead4" : "#145b7a";
}
