import { landingRuntimeConfig } from "../config";

export interface CmsSiteContent {
  en: Record<string, any>;
  de: Record<string, any>;
}

export interface CmsBlogPost {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  coverImageUrl: string | null;
  authorName: string;
  authorRole: string;
  seoTitle: string | null;
  seoDescription: string | null;
  readingTimeMinutes: number;
  status: "draft" | "published";
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

export function resolveCmsApiUrl(): string {
  return landingRuntimeConfig.BOOKING_API_URL || "";
}

async function cmsCall<T>(path: string): Promise<T> {
  const baseUrl = resolveCmsApiUrl();
  if (!baseUrl) {
    throw new Error("Landing CMS API URL is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}`);
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || `CMS request failed: ${response.status}`);
  }

  return payload.data as T;
}

export function fetchSiteContent(): Promise<CmsSiteContent> {
  return cmsCall<CmsSiteContent>("/api/public/cms/site-content");
}

export function fetchBlogPosts(locale: string): Promise<CmsBlogPost[]> {
  return cmsCall<CmsBlogPost[]>(
    `/api/public/cms/posts?locale=${encodeURIComponent(locale)}`,
  );
}

export function fetchBlogPost(
  slug: string,
  locale: string,
): Promise<CmsBlogPost> {
  return cmsCall<CmsBlogPost>(
    `/api/public/cms/posts/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
  );
}
