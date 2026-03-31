import { shouldHandleClientNavigation } from "../utils/appNavigation";

export function navigateToBlog(event?: MouseEvent): void {
  if (event && !shouldHandleClientNavigation(event)) return;
  event?.preventDefault();
  window.history.pushState(window.history.state, "", "/blog/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function navigateToBlogPost(slug: string, event?: MouseEvent): void {
  if (event && !shouldHandleClientNavigation(event)) return;
  event?.preventDefault();
  window.history.pushState(window.history.state, "", `/blog/${slug}/`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
