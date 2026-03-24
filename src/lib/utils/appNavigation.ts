export const APP_PATHS = [
  "/",
  "/imprint/",
  "/privacy/",
  "/terms/",
  "/policies/",
  "/docs/",
  "/blog/",
  "/security/",
  "/status/",
] as const;

export type AppPath = (typeof APP_PATHS)[number];

export const APP_NAVIGATION_EVENT = "aico:app-navigation";

export interface AppNavigationDetail {
  path: AppPath;
  replace?: boolean;
}

export function isAppPath(value: string | null | undefined): value is AppPath {
  return Boolean(value && APP_PATHS.includes(value as AppPath));
}

export function normalizeAppPath(value: string | null | undefined): AppPath | null {
  if (!value) return "/";

  const pathname = value.split("#")[0].split("?")[0] || "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalized =
    withLeadingSlash === "/" ? "/" : `${withLeadingSlash.replace(/\/+$/, "")}/`;

  return isAppPath(normalized) ? normalized : null;
}

export function requestAppNavigation(
  path: AppPath,
  options: Omit<AppNavigationDetail, "path"> = {},
): void {
  if (typeof window === "undefined") return;

  const { replace = false } = options;
  const method = replace ? "replaceState" : "pushState";

  window.history[method](window.history.state, "", path);
  window.dispatchEvent(
    new CustomEvent<AppNavigationDetail>(APP_NAVIGATION_EVENT, {
      detail: { path, replace },
    }),
  );
}

export function shouldHandleClientNavigation(event: MouseEvent): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
