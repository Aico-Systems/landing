export const SECTION_IDS = [
  "hero",
  "how-it-works",
  "features",
  "use-cases",
  "booking",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_NAVIGATION_EVENT = "aico:section-navigation";
export const SECTION_SCROLL_OFFSET = 104;

export interface SectionNavigationDetail {
  sectionId: SectionId;
  behavior?: ScrollBehavior;
  replace?: boolean;
}

export function isSectionId(value: string | null | undefined): value is SectionId {
  return Boolean(value && SECTION_IDS.includes(value as SectionId));
}

export function getSectionHash(sectionId: SectionId): string {
  return `#${sectionId}`;
}

export function getSectionIdFromHash(hash: string): SectionId | null {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  return isSectionId(value) ? value : null;
}

export function scrollToSectionElement(
  sectionId: SectionId,
  behavior: ScrollBehavior = "smooth",
): boolean {
  if (typeof window === "undefined") return false;

  const element = document.getElementById(sectionId);
  if (!element) return false;

  element.scrollIntoView({
    behavior,
    block: "start",
    inline: "nearest",
  });

  return true;
}

export function requestSectionNavigation(
  sectionId: SectionId,
  options: Omit<SectionNavigationDetail, "sectionId"> = {},
): void {
  if (typeof window === "undefined") return;

  const { behavior = "smooth", replace = false } = options;
  const method = replace ? "replaceState" : "pushState";

  window.history[method](window.history.state, "", getSectionHash(sectionId));
  window.dispatchEvent(
    new CustomEvent<SectionNavigationDetail>(SECTION_NAVIGATION_EVENT, {
      detail: { sectionId, behavior, replace },
    }),
  );
}
