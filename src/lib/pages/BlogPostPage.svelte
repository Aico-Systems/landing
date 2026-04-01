<script lang="ts">
  import Navigation from "../components/Navigation.svelte";
  import Footer from "../components/Footer.svelte";
  import { locale } from "../../i18n";
  import { fetchBlogPost, fetchBlogPosts, type CmsBlogPost } from "../cms/api";
  import {
    parseArticle,
    renderInlineMarkup,
    type CalloutVariant,
  } from "../blog/richText";
  import { navigateToBlog, navigateToBlogPost } from "../blog/blogNavigation";
  import { getCategoryAccent, type CategoryAccent } from "../blog/categoryPalette";

  type Copy = {
    journalTitle: string;
    loading: string;
    loadError: string;
    backToAll: string;
    minRead: string;
    articleMap: string;
    sections: string;
    takeaways: string;
    continueReading: string;
    relatedTitle: string;
    subscribeHeadline: string;
    subscribeLede: string;
    subscribePlaceholder: string;
    subscribeButton: string;
    subscribeThank: string;
    updated: string;
  };

  const COPY: Record<"en" | "de", Copy> = {
    en: {
      journalTitle: "AICOYO Journal",
      loading: "Loading post...",
      loadError: "Failed to load blog post.",
      backToAll: "All posts",
      minRead: "min read",
      articleMap: "On this page",
      sections: "sections",
      takeaways: "Key takeaways",
      continueReading: "Continue reading",
      relatedTitle: "Related reads",
      subscribeHeadline: "Stay in the loop",
      subscribeLede: "Get new essays and field reports delivered to your inbox.",
      subscribePlaceholder: "you@company.com",
      subscribeButton: "Subscribe",
      subscribeThank: "You're in. First issue ships soon.",
      updated: "Updated",
    },
    de: {
      journalTitle: "AICOYO Journal",
      loading: "Beitrag wird geladen...",
      loadError: "Blogbeitrag konnte nicht geladen werden.",
      backToAll: "Alle Beiträge",
      minRead: "Min. Lesezeit",
      articleMap: "Auf dieser Seite",
      sections: "Abschnitte",
      takeaways: "Kernaussagen",
      continueReading: "Weiterlesen",
      relatedTitle: "Passende Beiträge",
      subscribeHeadline: "Bleib auf dem Laufenden",
      subscribeLede: "Neue Essays und Erfahrungsberichte direkt in dein Postfach.",
      subscribePlaceholder: "du@firma.com",
      subscribeButton: "Abonnieren",
      subscribeThank: "Du bist dabei. Die erste Ausgabe kommt bald.",
      updated: "Aktualisiert",
    },
  };

  let { slug }: { slug: string } = $props();

  let loading = $state(true);
  let error = $state("");
  let post = $state<CmsBlogPost | null>(null);
  let relatedPosts = $state<CmsBlogPost[]>([]);
  let activeHeadingId = $state<string | null>(null);
  let readingProgress = $state(0);
  let bodyEl = $state<HTMLElement | null>(null);
  let nextReadEl = $state<HTMLElement | null>(null);
  let nextReadRevealed = $state(false);
  let subscribeSubmitted = $state(false);
  let subscribeEmail = $state("");

  async function loadPost(localeCode: string, nextSlug: string) {
    loading = true;
    error = "";
    try {
      const [resolvedPost, allPosts] = await Promise.all([
        fetchBlogPost(nextSlug, localeCode),
        fetchBlogPosts(localeCode),
      ]);
      post = resolvedPost;
      relatedPosts = allPosts
        .filter((c) => c.slug !== resolvedPost.slug)
        .sort((a, b) => {
          const aScore = Number(a.category === resolvedPost.category) + a.tags.filter((t) => resolvedPost.tags.includes(t)).length;
          const bScore = Number(b.category === resolvedPost.category) + b.tags.filter((t) => resolvedPost.tags.includes(t)).length;
          return bScore - aScore;
        })
        .slice(0, 3);
    } catch (e) {
      post = null;
      relatedPosts = [];
      error = e instanceof Error ? e.message : getCopy(localeCode).loadError;
    } finally {
      loading = false;
    }
  }

  function fmt(value: string | null): string {
    if (!value) return "";
    return new Intl.DateTimeFormat($locale || undefined, { month: "long", day: "numeric", year: "numeric" }).format(new Date(value));
  }

  function getOrigin(): string {
    return typeof window !== "undefined" ? window.location.origin : "https://aicoyo.com";
  }

  function canonicalUrl(): string {
    return post ? `${getOrigin()}/blog/${post.slug}/` : `${getOrigin()}/blog/`;
  }

  function coverStyle(p: CmsBlogPost, a: CategoryAccent): string {
    if (p.coverImageUrl) return `background-image: linear-gradient(180deg, rgba(5,11,22,0.3), rgba(5,11,22,0.85)), url('${p.coverImageUrl}');`;
    return `background-image: ${a.gradient}, linear-gradient(135deg, rgba(17,24,39,0.98), rgba(8,14,28,0.96));`;
  }

  function getCopy(lc: string | null): Copy {
    return lc?.startsWith("de") ? COPY.de : COPY.en;
  }

  function scrollTo(id: string, e: MouseEvent) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(history.state, "", `#${id}`);
  }

  function calloutIcon(v: CalloutVariant): string {
    return { note: "ℹ", warning: "⚠", insight: "💡", takeaway: "✦", faq: "?" }[v];
  }

  const copy = $derived(getCopy($locale ?? null));
  const parsed = $derived(post ? parseArticle(post.body) : { blocks: [], headings: [], footnotes: [], faqs: [], takeaway: null });
  const allHeadings = $derived(parsed.headings);
  const h2Count = $derived(parsed.headings.filter((h) => h.level === 2).length);
  const accent = $derived<CategoryAccent>(post ? getCategoryAccent(post.category) : { primary: "#5eead4", soft: "rgba(94,234,212,0.12)", border: "rgba(94,234,212,0.22)", gradient: "" });
  const jsonLd = $derived(
    post
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl() },
          headline: post.seoTitle || post.title,
          description: post.seoDescription || post.excerpt,
          author: { "@type": "Person", name: post.authorName },
          publisher: {
            "@type": "Organization",
            name: "AICOYO",
            url: getOrigin(),
            logo: { "@type": "ImageObject", url: `${getOrigin()}/Logo.svg` },
          },
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
          image: post.coverImageUrl || undefined,
          articleSection: post.category,
          keywords: post.tags.join(", "),
          wordCount: post.body.split(/\s+/).length,
          inLanguage: $locale || "en",
        })
      : "",
  );

  const faqJsonLd = $derived(
    parsed.faqs.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: parsed.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        })
      : "",
  );

  $effect(() => { if ($locale) void loadPost($locale, slug); });

  // Reading progress
  $effect(() => {
    if (!bodyEl) return;
    const el = bodyEl;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      readingProgress = total <= 0 ? 1 : Math.max(0, Math.min(1, -rect.top / total));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  });

  // Active heading tracking
  $effect(() => {
    if (!post || allHeadings.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) activeHeadingId = e.target.id; },
      { rootMargin: "-100px 0px -66% 0px", threshold: 0.1 },
    );
    requestAnimationFrame(() => { for (const h of allHeadings) { const el = document.getElementById(h.id); if (el) obs.observe(el); } });
    return () => obs.disconnect();
  });

  // Next-read reveal
  $effect(() => {
    if (!nextReadEl) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) nextReadRevealed = true; }, { threshold: 0.15 });
    obs.observe(nextReadEl);
    return () => obs.disconnect();
  });
</script>

<svelte:head>
  <title>{post?.seoTitle || post?.title || copy.journalTitle}</title>
  <meta name="description" content={post?.seoDescription || post?.excerpt || copy.journalTitle} />
  <link rel="canonical" href={canonicalUrl()} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={post?.seoTitle || post?.title || copy.journalTitle} />
  <meta property="og:description" content={post?.seoDescription || post?.excerpt || copy.journalTitle} />
  <meta property="og:url" content={canonicalUrl()} />
  {#if post?.coverImageUrl}
    <meta property="og:image" content={post.coverImageUrl} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={post.coverImageUrl} />
  {:else}
    <meta name="twitter:card" content="summary" />
  {/if}
  <meta name="twitter:title" content={post?.seoTitle || post?.title || copy.journalTitle} />
  <meta name="twitter:description" content={post?.seoDescription || post?.excerpt || copy.journalTitle} />
  <link rel="alternate" type="application/rss+xml" title="AICOYO Blog RSS" href={`${getOrigin()}/api/public/cms/rss`} />
  {#if post}{@html `<script type="application/ld+json">${jsonLd}<\/script>`}{/if}
  {#if faqJsonLd}{@html `<script type="application/ld+json">${faqJsonLd}<\/script>`}{/if}
</svelte:head>

<Navigation currentPath="/blog/" />

{#if post && !loading}
  <div class="progress-bar" aria-hidden="true" style="--progress: {readingProgress}; --accent: {accent.primary}">
    <div class="progress-fill"></div>
  </div>
{/if}

<main class="post-page" style="--accent: {accent.primary}; --accent-soft: {accent.soft}; --accent-border: {accent.border}">
  {#if loading}
    <div class="shell"><div class="state-card">{copy.loading}</div></div>
  {:else if error}
    <div class="shell"><div class="state-card error">{error}</div></div>
  {:else if post}
    <!-- Hero -->
    <header class="hero" style={coverStyle(post, accent)}>
      <div class="hero-inner">
        <a class="hero-back" href="/blog/" onclick={(e) => navigateToBlog(e)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          {copy.backToAll}
        </a>
        <div class="hero-meta">
          <span class="hero-badge">{post.category}</span>
          <span>{h2Count} {copy.sections}</span>
          <span>{post.readingTimeMinutes} {copy.minRead}</span>
          {#if post.publishedAt}<time datetime={post.publishedAt}>{fmt(post.publishedAt)}</time>{/if}
          {#if post.updatedAt && post.updatedAt !== post.publishedAt}
            <span>{copy.updated} <time datetime={post.updatedAt}>{fmt(post.updatedAt)}</time></span>
          {/if}
        </div>
        <h1>{post.title}</h1>
        <p class="hero-lede">{post.excerpt}</p>
        <div class="hero-author"><strong>{post.authorName}</strong><span>{post.authorRole}</span></div>
      </div>
    </header>

    {#if parsed.takeaway}
      <div class="shell">
        <aside class="takeaway">
          <span class="takeaway-icon">✦</span>
          <div>
            <strong>{copy.takeaways}</strong>
            <p>{@html renderInlineMarkup(parsed.takeaway)}</p>
          </div>
        </aside>
      </div>
    {/if}

    <!-- Two-column: article + TOC -->
    <div class="shell">
      <div class="reading-layout">
        <article class="article-body" bind:this={bodyEl}>
          {#each parsed.blocks as block}
            {#if block.type === "heading"}
              <svelte:element this={block.level === 2 ? "h2" : "h3"} id={block.id}>{@html renderInlineMarkup(block.text)}</svelte:element>
            {:else if block.type === "paragraph"}
              <p>{@html renderInlineMarkup(block.text)}</p>
            {:else if block.type === "blockquote"}
              <blockquote>{@html renderInlineMarkup(block.text)}</blockquote>
            {:else if block.type === "callout"}
              <aside class="callout callout-{block.variant}" role="note">
                <span class="callout-icon">{calloutIcon(block.variant)}</span>
                <p>{@html renderInlineMarkup(block.text)}</p>
              </aside>
            {:else if block.type === "pull-quote"}
              <blockquote class="pull-quote"><p>{@html renderInlineMarkup(block.text)}</p></blockquote>
            {:else if block.type === "unordered-list"}
              <ul>{#each block.items as item}<li>{@html renderInlineMarkup(item)}</li>{/each}</ul>
            {:else if block.type === "ordered-list"}
              <ol>{#each block.items as item}<li>{@html renderInlineMarkup(item)}</li>{/each}</ol>
            {:else if block.type === "image"}
              <figure class="media-block">
                <img src={block.src} alt={block.alt} loading="lazy" />
                {#if block.title}<figcaption>{block.title}</figcaption>{/if}
              </figure>
            {:else if block.type === "video"}
              <figure class="media-block">
                <div class="video-frame">
                  {#if block.kind === "file"}
                    <video src={block.src} controls playsinline preload="metadata"><track kind="captions" label={block.title || "Video captions"} default /></video>
                  {:else}
                    <iframe src={block.src} title={block.title || "Embedded video"} loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                  {/if}
                </div>
                {#if block.title}<figcaption>{block.title}</figcaption>{/if}
              </figure>
            {:else if block.type === "table"}
              <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
              <div class="table-wrap" role="region" aria-label="Data table" tabindex="0">
                <table>
                  <thead><tr>{#each block.headers as h}<th>{@html renderInlineMarkup(h)}</th>{/each}</tr></thead>
                  <tbody>{#each block.rows as row}<tr>{#each row as cell}<td>{@html renderInlineMarkup(cell)}</td>{/each}</tr>{/each}</tbody>
                </table>
              </div>
            {:else if block.type === "code-block"}
              <div class="code-block">
                {#if block.language}<span class="code-lang">{block.language}</span>{/if}
                <pre><code>{block.code}</code></pre>
              </div>
            {:else if block.type === "footnote-list"}
              <section class="footnotes" aria-label="Footnotes" role="doc-endnotes">
                <hr />
                <ol>{#each block.items as fn}<li id="fn-{fn.index}"><p>{@html renderInlineMarkup(fn.text)} <a href="#fnref-{fn.index}" aria-label="Back to reference">&uarr;</a></p></li>{/each}</ol>
              </section>
            {:else}
              <hr />
            {/if}
          {/each}
        </article>

        <!-- TOC: sticky in the right column, vertically centered -->
        {#if allHeadings.length > 0}
          <div class="toc-column">
            <nav class="toc-rail" aria-label={copy.articleMap}>
              <span class="toc-label">{copy.articleMap}</span>
              {#each allHeadings as heading}
                {@const isActive = activeHeadingId === heading.id}
                {@const activeIdx = allHeadings.findIndex((h) => h.id === activeHeadingId)}
                {@const thisIdx = allHeadings.indexOf(heading)}
                {@const isPassed = activeIdx >= 0 && thisIdx < activeIdx}
                <a
                  href={`#${heading.id}`}
                  onclick={(e) => scrollTo(heading.id, e)}
                  class:sub={heading.level === 3}
                  class:active={isActive}
                  class:passed={isPassed}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span class="toc-bar"></span>
                  {heading.text}
                </a>
              {/each}
            </nav>
          </div>
        {/if}
      </div>
    </div>

    <!-- Subscribe -->
    <div class="shell">
      <div class="subscribe-inline">
        {#if subscribeSubmitted}
          <p class="subscribe-done">{copy.subscribeThank}</p>
        {:else}
          <div class="subscribe-copy">
            <strong>{copy.subscribeHeadline}</strong>
            <p>{copy.subscribeLede}</p>
          </div>
          <form class="subscribe-form" onsubmit={(e) => { e.preventDefault(); subscribeSubmitted = true; }}>
            <input type="email" placeholder={copy.subscribePlaceholder} required bind:value={subscribeEmail} />
            <button type="submit">{copy.subscribeButton}</button>
          </form>
        {/if}
      </div>
    </div>

    <!-- Related -->
    {#if relatedPosts.length > 0}
      <div class="shell">
        <section class="related-section">
          <span class="section-label">{copy.relatedTitle}</span>
          <div class="related-grid">
            {#each relatedPosts as rp}
              {@const ra = getCategoryAccent(rp.category)}
              <a class="related-card" href={`/blog/${rp.slug}/`} onclick={(e) => navigateToBlogPost(rp.slug, e)}>
                <div class="related-visual" style={rp.coverImageUrl ? `background-image: linear-gradient(180deg, rgba(4,10,20,0.2), rgba(4,10,20,0.76)), url('${rp.coverImageUrl}');` : `background-image: ${ra.gradient}, linear-gradient(135deg, rgba(14,22,36,0.98), rgba(8,14,28,0.96));`}></div>
                <div class="related-body">
                  <span class="related-badge" style="color: {ra.primary}">{rp.category}</span>
                  <strong>{rp.title}</strong>
                  <span class="related-meta">{rp.readingTimeMinutes} {copy.minRead}</span>
                </div>
              </a>
            {/each}
          </div>
        </section>
      </div>
    {/if}

    <!-- Next read -->
    {#if relatedPosts.length > 0}
      {@const next = relatedPosts[0]}
      {@const na = getCategoryAccent(next.category)}
      <section class="next-reveal" class:revealed={nextReadRevealed} bind:this={nextReadEl}>
        <div class="shell">
          <span class="section-label">{copy.continueReading}</span>
          <a class="next-card" href={`/blog/${next.slug}/`} onclick={(e) => navigateToBlogPost(next.slug, e)}>
            <div class="next-visual" style={next.coverImageUrl ? `background-image: linear-gradient(180deg, rgba(4,10,20,0.1), rgba(4,10,20,0.72)), url('${next.coverImageUrl}');` : `background-image: ${na.gradient}, linear-gradient(135deg, rgba(14,22,36,0.98), rgba(8,14,28,0.96));`}></div>
            <div class="next-body">
              <span class="related-badge" style="color: {na.primary}">{next.category}</span>
              <h2>{next.title}</h2>
              <p>{next.excerpt}</p>
              <span class="related-meta">{next.readingTimeMinutes} {copy.minRead}{#if next.publishedAt} · <time datetime={next.publishedAt}>{fmt(next.publishedAt)}</time>{/if}</span>
            </div>
          </a>
        </div>
      </section>
    {/if}
  {/if}
</main>

<Footer />

<style>
  .post-page { min-height: 100vh; color: var(--text-primary); }
  .shell { width: min(1360px, calc(100% - 32px)); margin: 0 auto; }

  .state-card { padding: 32px; margin-top: 140px; border-radius: 20px; border: 1px solid var(--border-subtle); background: var(--surface-elevated-strong); color: var(--text-secondary); }
  .state-card.error { color: #fecaca; border-color: rgba(248,113,113,0.26); background: rgba(127,29,29,0.24); }

  /* === Progress bar === */
  .progress-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 1001; background: var(--surface-muted); pointer-events: none; }
  .progress-fill { height: 100%; background: var(--accent, #5eead4); transform: scaleX(var(--progress, 0)); transform-origin: left; transition: transform 0.12s linear; }

  /* === Hero === */
  .hero { display: flex; align-items: flex-end; min-height: max(480px, 56vh); padding: 0 0 56px; background-size: cover; background-position: center; }
  .hero-inner { width: min(1360px, calc(100% - 32px)); margin: 0 auto; display: grid; gap: 16px; }
  .hero-back { display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.72); text-decoration: none; font-size: 13px; font-weight: 500; margin-bottom: 8px; transition: color 0.15s; }
  .hero-back:hover { color: #fff; }
  .hero-meta { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; color: rgba(255,255,255,0.64); font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .hero-badge { padding: 4px 12px; border-radius: 999px; border: 1px solid var(--accent-border); background: var(--surface-overlay-strong); backdrop-filter: blur(8px); color: var(--accent); }
  .hero h1 { margin: 0; font-size: clamp(36px, 5.5vw, 72px); font-weight: 800; line-height: 1.02; letter-spacing: -0.04em; color: #fff; max-width: 18ch; }
  .hero-lede { margin: 0; font-size: clamp(16px, 1.2vw, 20px); line-height: 1.6; color: rgba(255,255,255,0.78); max-width: 52ch; font-family: var(--font-editorial); }
  .hero-author { display: flex; gap: 10px; align-items: baseline; color: rgba(255,255,255,0.74); font-size: 14px; }
  .hero-author strong { color: #fff; }

  /* === Takeaway === */
  .takeaway { display: grid; grid-template-columns: auto 1fr; gap: 14px; margin: 32px auto; max-width: 780px; padding: 22px 26px; border-radius: 20px; border: 1px solid var(--accent-border); background: var(--accent-soft); }
  .takeaway-icon { color: var(--accent); font-size: 1.2rem; line-height: 1.6; }
  .takeaway strong { display: block; font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
  .takeaway p { margin: 0; color: var(--text-secondary); line-height: 1.7; font-family: var(--font-editorial); }

  /* === Reading layout: two-column grid === */
  .reading-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 200px;
    gap: 48px;
    padding: 40px 0 60px;
  }

  /* The TOC column stretches to the full row height (default grid behavior).
     The .toc-rail inside it is sticky, so it travels within this tall column. */
  .toc-column {
    /* intentionally empty — just a stretching grid cell */
    min-height: 0;
  }

  .toc-rail {
    position: sticky;
    top: max(96px, calc(50vh - 150px));
  }

  /* === Article body === */
  .article-body { display: grid; gap: 20px; font-family: var(--font-editorial); }

  .article-body :global(h2), .article-body :global(h3) { margin: 32px 0 0; line-height: 1.08; letter-spacing: -0.03em; scroll-margin-top: 120px; font-family: var(--font-ui); }
  .article-body :global(h2) { font-size: clamp(28px, 3vw, 40px); }
  .article-body :global(h3) { font-size: clamp(21px, 2.1vw, 28px); }
  .article-body p, .article-body li, .article-body blockquote { margin: 0; color: var(--text-primary); line-height: 1.82; font-size: clamp(17px, 1.05vw, 19px); }
  .article-body ul, .article-body ol { margin: 0; display: grid; gap: 10px; padding-left: 22px; }
  .article-body blockquote { padding: 18px 20px; border-left: 3px solid var(--accent-border); background: var(--accent-soft); border-radius: 0 16px 16px 0; color: var(--text-secondary); }
  .article-body hr { width: 100%; height: 1px; border: none; background: var(--border-subtle); margin: 10px 0; }
  .article-body :global(a) { color: var(--accent); text-decoration: none; }
  .article-body :global(code) { padding: 2px 7px; border-radius: 6px; background: var(--surface-muted); font-size: 0.9em; }

  /* Callouts */
  .callout { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 18px 20px; border-radius: 16px; border: 1px solid var(--border-subtle); background: var(--surface-muted); }
  .callout-icon { font-size: 1.1rem; line-height: 1.82; }
  .callout-note { border-color: rgba(56,189,248,0.22); background: rgba(56,189,248,0.06); }
  .callout-warning { border-color: rgba(251,191,36,0.22); background: rgba(251,191,36,0.06); }
  .callout-insight { border-color: rgba(167,139,250,0.22); background: rgba(167,139,250,0.06); }
  .callout-takeaway { border-color: var(--accent-border); background: var(--accent-soft); }
  .callout p { margin: 0; }

  /* Pull-quote */
  .pull-quote { padding: 32px 24px; border-left: none; border-radius: 0; background: none; text-align: center; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
  .pull-quote p { font-family: var(--font-editorial); font-size: clamp(22px, 2.4vw, 32px); font-style: italic; line-height: 1.45; color: var(--text-primary); }

  /* Table */
  .table-wrap { overflow-x: auto; border-radius: 16px; border: 1px solid var(--border-subtle); }
  .table-wrap table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
  .table-wrap th, .table-wrap td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border-subtle); }
  .table-wrap th { background: var(--surface-muted); font-weight: 600; font-family: var(--font-ui); font-size: 0.8rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-tertiary); }
  .table-wrap td { color: var(--text-secondary); }
  .table-wrap tbody tr:last-child td { border-bottom: none; }

  /* Code block */
  .code-block { position: relative; border-radius: 16px; border: 1px solid var(--border-subtle); background: var(--bg-secondary); overflow: hidden; }
  .code-lang { position: absolute; top: 10px; right: 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-tertiary); font-family: var(--font-ui); }
  .code-block pre { margin: 0; padding: 20px; overflow-x: auto; font-size: 0.86rem; line-height: 1.6; color: var(--text-secondary); }
  .code-block code { font-family: "SF Mono", "Fira Code", Menlo, Consolas, monospace; background: none; padding: 0; border-radius: 0; }

  /* Media */
  .media-block { display: grid; gap: 10px; margin: 6px 0 16px; }
  .media-block img { display: block; width: 100%; height: auto; border-radius: 16px; border: 1px solid var(--border-subtle); }
  .media-block figcaption { font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; }
  .video-frame { position: relative; overflow: hidden; border-radius: 16px; border: 1px solid var(--border-subtle); background: var(--bg-secondary); aspect-ratio: 16 / 9; }
  .video-frame iframe, .video-frame video { display: block; width: 100%; height: 100%; border: 0; }

  /* Footnotes */
  .footnotes { margin-top: 20px; padding-top: 10px; }
  .footnotes hr { margin-bottom: 16px; }
  .footnotes ol { padding-left: 22px; display: grid; gap: 8px; }
  .footnotes li { font-size: 0.86rem; color: var(--text-secondary); }
  .footnotes a { color: var(--accent); text-decoration: none; margin-left: 4px; }

  /* === TOC === */
  .toc-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 14px; display: block; }
  .toc-rail a { display: flex; align-items: center; gap: 12px; padding: 6px 0; color: var(--text-secondary); text-decoration: none; font-size: 0.84rem; line-height: 1.4; transition: color 0.15s; }
  .toc-rail a:hover { color: var(--text-primary); }
  .toc-bar { flex-shrink: 0; width: 2px; height: 16px; border-radius: 1px; background: var(--border-subtle); transition: background 0.2s, height 0.2s; }
  .toc-rail a.sub { padding-left: 14px; font-size: 0.8rem; color: var(--text-tertiary); }
  .toc-rail a.sub .toc-bar { height: 12px; }
  .toc-rail a.passed { color: var(--text-tertiary); }
  .toc-rail a.passed .toc-bar { background: var(--accent); opacity: 0.4; }
  .toc-rail a.active { color: var(--accent); font-weight: 600; }
  .toc-rail a.active .toc-bar { background: var(--accent); height: 20px; }

  /* === Subscribe === */
  .subscribe-inline { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 28px 32px; border-radius: 20px; border: 1px solid var(--border-subtle); background: var(--surface-elevated); margin-bottom: 48px; }
  .subscribe-copy strong { display: block; font-size: 1.05rem; margin-bottom: 4px; }
  .subscribe-copy p { margin: 0; color: var(--text-secondary); font-size: 0.9rem; }
  .subscribe-form { display: flex; gap: 8px; flex-shrink: 0; }
  .subscribe-form input { min-height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--surface-muted); color: var(--text-primary); font-family: var(--font-ui); font-size: 0.88rem; width: 220px; }
  .subscribe-form input::placeholder { color: var(--text-tertiary); }
  .subscribe-form button { min-height: 40px; padding: 0 18px; border-radius: 10px; border: 1px solid var(--accent-border); background: var(--accent-soft); color: var(--accent); font-family: var(--font-ui); font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
  .subscribe-form button:hover { background: var(--accent-soft-strong); }
  .subscribe-done { margin: 0; color: var(--accent); font-weight: 500; }

  /* === Related === */
  .section-label { display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 16px; }
  .related-section { margin-bottom: 48px; }
  .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .related-card { display: grid; border-radius: 20px; overflow: hidden; border: 1px solid var(--border-subtle); background: var(--surface-elevated); text-decoration: none; color: inherit; transition: border-color 0.2s, box-shadow 0.2s; }
  .related-card:hover { border-color: var(--border-strong); box-shadow: var(--panel-shadow-lg); }
  .related-visual { min-height: 160px; background-size: cover; background-position: center; }
  .related-body { display: grid; gap: 6px; padding: 18px; }
  .related-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
  .related-body strong { font-size: 1.02rem; line-height: 1.25; }
  .related-meta { font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.06em; text-transform: uppercase; }

  /* === Next read === */
  .next-reveal { padding: 0 0 80px; opacity: 0; transform: translateY(40px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .next-reveal.revealed { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) { .next-reveal { opacity: 1; transform: none; transition: none; } }
  .next-card { display: grid; grid-template-columns: 340px minmax(0, 1fr); border-radius: 24px; overflow: hidden; border: 1px solid var(--border-subtle); background: var(--surface-elevated); text-decoration: none; color: inherit; transition: border-color 0.2s, box-shadow 0.2s; }
  .next-card:hover { border-color: var(--border-strong); box-shadow: var(--panel-shadow-lg); }
  .next-visual { min-height: 260px; background-size: cover; background-position: center; border-right: 1px solid var(--border-subtle); }
  .next-body { display: grid; gap: 10px; padding: 28px; align-content: center; }
  .next-body h2 { margin: 0; font-size: clamp(24px, 2.2vw, 34px); line-height: 1.1; letter-spacing: -0.03em; }
  .next-body p { margin: 0; color: var(--text-secondary); line-height: 1.6; font-size: 0.94rem; }

  /* === Responsive === */
  @media (max-width: 1100px) {
    .reading-layout { grid-template-columns: 1fr; }
    .toc-column { display: none; }
  }

  @media (max-width: 860px) {
    .hero { min-height: max(360px, 45vh); padding-bottom: 40px; }
    .hero h1 { max-width: none; }
    .next-card { grid-template-columns: 1fr; }
    .next-visual { min-height: 200px; border-right: none; border-bottom: 1px solid var(--border-subtle); }
    .subscribe-inline { flex-direction: column; align-items: stretch; }
    .subscribe-form { flex-direction: column; }
    .subscribe-form input { width: 100%; }
  }

  @media (max-width: 640px) {
    .hero { min-height: max(300px, 40vh); padding-bottom: 32px; }
    .hero h1 { font-size: clamp(28px, 8vw, 42px); }
    .takeaway { padding: 18px; }
    .reading-layout { padding: 24px 0 40px; }
    .related-grid { grid-template-columns: 1fr; }
  }
</style>
