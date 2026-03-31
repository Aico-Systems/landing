# Blog LLM SEO / GEO Optimization

## Tier 1 — Critical

### robots.txt for AI bots
- [x] Allow retrieval bots: `ChatGPT-User`, `OAI-SearchBot`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`
- [x] Block training bots: `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`
- [x] Serve from landing static root (`landing/public/robots.txt`)

### /llms.txt + sitemap.xml
- [x] Build-time generator script (`scripts/generate-seo.ts`) fetches CMS posts
- [x] `llms.txt`: H1 site name, blockquote summary, H2 sections with links grouped by category
- [x] `sitemap.xml`: all static pages + blog post URLs with `<lastmod>` from CMS dates
- [x] `package.json` script: `bun run generate-seo`
- [ ] Wire into CI/CD build pipeline (run `generate-seo` before `vite build`)

### JSON-LD BlogPosting schema
- [x] `BlogPosting` with headline, author, publisher, dates, image
- [x] `wordCount` (derived from `post.body.split(/\s+/).length`)
- [x] `articleSection` (from CMS `post.category`)
- [x] `keywords` (from CMS `post.tags`)
- [x] `inLanguage` (from current locale)

### JSON-LD on BlogPage listing
- [x] `CollectionPage` schema with `hasPart` referencing each post
- [x] All data derived from CMS posts

## Tier 2 — High Value

### FAQPage schema on blog posts
- [x] `> [!faq]` callout variant added to `richText.ts` parser
- [x] FAQ entries collected into `ParsedArticle.faqs` (question from directive line, answer from body)
- [x] `FAQPage` JSON-LD auto-generated from parsed FAQ blocks (no hardcoded questions)
- [x] FAQ callout renders visually in article body

### Organization schema
- [x] `Organization` JSON-LD on LegalLayout (shared across all pages)
- [x] Includes `name`, `url`, `logo`, `description`, `sameAs` (LinkedIn, Twitter)

### RSS feed link
- [x] `<link rel="alternate" type="application/rss+xml">` on BlogPage and BlogPostPage
- [ ] Actual RSS feed endpoint needs backend implementation (out of scope for landing)

### sitemap.xml
- [x] Generator produces sitemap with static pages + blog posts
- [x] `<lastmod>` from CMS `updatedAt`/`publishedAt`

### Visible "Last updated" timestamps
- [x] Show `updatedAt` on BlogPostPage hero when it differs from `publishedAt`
- [x] Uses `<time datetime>` for machine readability

## Tier 3 — Future-Proofing

### Semantic HTML audit
- [x] `<article>`, `<section>`, `<nav>`, `<aside>` used correctly
- [x] `<figure>` / `<figcaption>` for images/videos
- [x] `<blockquote>` for quotes
- [x] `<table>` with `<thead>`/`<tbody>` for data tables
- [x] `<time datetime>` on all rendered dates (BlogPostPage + BlogPage)
- [x] `lang` attribute on `<html>` reactively updated from locale

### Content formatting for LLM citation
- [x] `> [!faq]` callout variant for FAQ Q&A blocks
- [x] FAQ blocks render visually AND generate FAQPage JSON-LD
- [ ] Consider `> [!tldr]` callout variant for per-section summaries (future)

### llms-full.txt
- [ ] Extended version with full article content inlined (future)

## Implementation Notes

- **No hardcoded content** — everything derived from CMS API
- **Build-time generation** for llms.txt, sitemap.xml via `bun scripts/generate-seo.ts`
- **Pre-rendering is the #1 technical debt** — AI crawlers don't execute JS. Tracked separately.

## Verification
- [x] `bun run check` — 0 errors, 0 warnings
- [x] `bun run build` — succeeds
