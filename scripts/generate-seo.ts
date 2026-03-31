/**
 * Build-time generator for robots.txt, llms.txt, and sitemap.xml
 * Fetches blog posts from CMS and generates static SEO files.
 *
 * Usage: bun scripts/generate-seo.ts
 * Requires VITE_BOOKING_API_URL and LANDING_SITE_URL in environment.
 */

const SITE_URL = (
  process.env.LANDING_SITE_URL ||
  process.env.VITE_LANDING_SITE_URL ||
  "https://aicoyo.com"
).replace(/\/+$/, "");

const API_URL = process.env.VITE_BOOKING_API_URL?.replace(/\/+$/, "");

interface CmsBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorName: string;
  readingTimeMinutes: number;
  publishedAt: string | null;
  updatedAt: string | null;
}

async function fetchPosts(locale: string): Promise<CmsBlogPost[]> {
  if (!API_URL) {
    console.warn("[generate-seo] VITE_BOOKING_API_URL not set, skipping CMS fetch.");
    return [];
  }

  const res = await fetch(
    `${API_URL}/api/public/cms/posts?locale=${encodeURIComponent(locale)}`,
  );
  const payload = await res.json().catch(() => null);

  if (!res.ok || !payload?.success) {
    console.warn(`[generate-seo] Failed to fetch ${locale} posts: ${payload?.error || res.status}`);
    return [];
  }

  return payload.data as CmsBlogPost[];
}

function generateRobotsTxt(): string {
  return `# All bots welcome — crawl, index, train, cite
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# LLM context — see /llms.txt for a structured overview of this site
`;
}

function generateLlmsTxt(posts: CmsBlogPost[]): string {
  const lines: string[] = [];

  lines.push("# AICOYO");
  lines.push("");
  lines.push(
    "> AI-powered voice agent infrastructure. Design, deploy, and monitor voice agents with enterprise telephony, RAG, and live tooling.",
  );
  lines.push("");
  lines.push(
    "AICOYO provides a platform for building production-grade AI voice agents. The Journal publishes essays, rollout notes, and field reports from teams shipping voice AI.",
  );
  lines.push("");
  lines.push("## Blog — AICOYO Journal");

  const byCategory = new Map<string, CmsBlogPost[]>();
  for (const post of posts) {
    const cat = post.category || "General";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(post);
  }

  for (const [category, catPosts] of byCategory) {
    lines.push("");
    lines.push(`### ${category}`);
    for (const post of catPosts) {
      const desc = post.excerpt
        ? `: ${post.excerpt.slice(0, 120)}${post.excerpt.length > 120 ? "..." : ""}`
        : "";
      lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug}/)${desc}`);
    }
  }

  lines.push("");
  lines.push("## Pages");
  lines.push(`- [Blog](${SITE_URL}/blog/): Essays and field reports`);
  lines.push(`- [Docs](${SITE_URL}/docs/): Documentation`);
  lines.push(`- [Security](${SITE_URL}/security/): Security disclosures`);
  lines.push(`- [Privacy](${SITE_URL}/privacy/): Privacy policy`);
  lines.push(`- [Terms](${SITE_URL}/terms/): Terms of service`);
  lines.push(`- [Imprint](${SITE_URL}/imprint/): Legal imprint`);
  lines.push("");

  return lines.join("\n");
}

function generateSitemapXml(enPosts: CmsBlogPost[]): string {
  const lines: string[] = [];

  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  const staticPages = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/blog/", priority: "0.9", changefreq: "daily" },
    { path: "/docs/", priority: "0.7", changefreq: "weekly" },
    { path: "/security/", priority: "0.3", changefreq: "monthly" },
    { path: "/privacy/", priority: "0.2", changefreq: "monthly" },
    { path: "/terms/", priority: "0.2", changefreq: "monthly" },
    { path: "/imprint/", priority: "0.2", changefreq: "monthly" },
  ];

  for (const page of staticPages) {
    lines.push("  <url>");
    lines.push(`    <loc>${SITE_URL}${page.path}</loc>`);
    lines.push(`    <changefreq>${page.changefreq}</changefreq>`);
    lines.push(`    <priority>${page.priority}</priority>`);
    lines.push("  </url>");
  }

  for (const post of enPosts) {
    const lastmod = post.updatedAt || post.publishedAt;
    lines.push("  <url>");
    lines.push(`    <loc>${SITE_URL}/blog/${post.slug}/</loc>`);
    if (lastmod) lines.push(`    <lastmod>${lastmod.split("T")[0]}</lastmod>`);
    lines.push("    <changefreq>monthly</changefreq>");
    lines.push("    <priority>0.8</priority>");
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  lines.push("");

  return lines.join("\n");
}

async function main() {
  console.log(`[generate-seo] Site URL: ${SITE_URL}`);
  console.log("[generate-seo] Fetching posts from CMS...");

  const enPosts = await fetchPosts("en");

  if (enPosts.length === 0) {
    console.log("[generate-seo] No posts found, generating minimal files.");
  } else {
    console.log(`[generate-seo] Found ${enPosts.length} English posts.`);
  }

  await Bun.write("public/robots.txt", generateRobotsTxt());
  await Bun.write("public/llms.txt", generateLlmsTxt(enPosts));
  await Bun.write("public/sitemap.xml", generateSitemapXml(enPosts));

  console.log("[generate-seo] Generated public/robots.txt");
  console.log("[generate-seo] Generated public/llms.txt");
  console.log("[generate-seo] Generated public/sitemap.xml");
}

main().catch((err) => {
  console.error("[generate-seo] Error:", err);
  process.exit(1);
});
