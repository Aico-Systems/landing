<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";
  import { locale } from "../../i18n";
  import { fetchBlogPosts, type CmsBlogPost } from "../cms/api";
  import { navigateToBlogPost } from "../blog/blogNavigation";
  import { getCategoryAccent } from "../blog/categoryPalette";

  type Copy = {
    eyebrow: string;
    title: string;
    description: string;
    lede: string;
    featureLabel: string;
    latestTitle: string;
    emptyState: string;
    readArticle: string;
    minRead: string;
    loading: string;
    loadError: string;
    searchPlaceholder: string;
    allCategories: string;
    sortLatest: string;
    sortReadingTime: string;
    noResults: string;
    seoTitle: string;
    seoDescription: string;
  };

  const COPY: Record<"en" | "de", Copy> = {
    en: {
      eyebrow: "Editorial",
      title: "AICOYO Journal",
      description: "Essays, rollout notes, and field reports from teams shipping AI voice in production.",
      lede: "Operating notes, rollout patterns, and architecture essays for teams building voice systems that have to survive the real world.",
      featureLabel: "Lead essay",
      latestTitle: "Latest posts",
      emptyState: "More stories are on the way.",
      readArticle: "Read article",
      minRead: "min read",
      loading: "Loading posts...",
      loadError: "Failed to load blog posts.",
      searchPlaceholder: "Search posts...",
      allCategories: "All",
      sortLatest: "Latest",
      sortReadingTime: "Reading time",
      noResults: "No posts match your filters.",
      seoTitle: "AICOYO Journal — Essays & Field Reports",
      seoDescription: "Essays, rollout notes, and field reports from teams shipping AI voice in production.",
    },
    de: {
      eyebrow: "Editorial",
      title: "AICOYO Journal",
      description: "Essays, Rollout-Notizen und Erfahrungsberichte von Teams, die Voice AI produktiv ausrollen.",
      lede: "Betriebsnotizen, Rollout-Muster und Architektur-Essays für Teams, die Voice-Systeme bauen, die auch unter echter Last bestehen müssen.",
      featureLabel: "Leitartikel",
      latestTitle: "Neueste Beiträge",
      emptyState: "Weitere Beiträge sind bereits in Arbeit.",
      readArticle: "Artikel lesen",
      minRead: "Min. Lesezeit",
      loading: "Beiträge werden geladen...",
      loadError: "Blogbeiträge konnten nicht geladen werden.",
      searchPlaceholder: "Beiträge suchen...",
      allCategories: "Alle",
      sortLatest: "Neueste",
      sortReadingTime: "Lesezeit",
      noResults: "Keine Beiträge zu diesen Filtern gefunden.",
      seoTitle: "AICOYO Journal — Essays & Erfahrungsberichte",
      seoDescription: "Essays, Rollout-Notizen und Erfahrungsberichte von Teams, die Voice AI produktiv ausrollen.",
    },
  };

  let loading = $state(true);
  let error = $state("");
  let posts = $state<CmsBlogPost[]>([]);
  let activeCategory = $state<string | null>(null);
  let activeTags = $state<Set<string>>(new Set());
  let searchQuery = $state("");
  let sortBy = $state<"latest" | "readingTime">("latest");

  async function loadPosts(localeCode: string) {
    loading = true;
    error = "";
    try {
      posts = await fetchBlogPosts(localeCode);
    } catch (e) {
      error = e instanceof Error ? e.message : getCopy(localeCode).loadError;
    } finally {
      loading = false;
    }
  }

  function fmt(value: string | null): string {
    if (!value) return "";
    return new Intl.DateTimeFormat($locale || undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  }

  function readTime(p: CmsBlogPost): string {
    return `${p.readingTimeMinutes} ${copy.minRead}`;
  }

  function coverStyle(p: CmsBlogPost, variant: "hero" | "card"): string {
    const accent = getCategoryAccent(p.category);
    if (p.coverImageUrl) {
      const overlay = variant === "hero"
        ? "linear-gradient(180deg, rgba(4,10,20,0.1), rgba(4,10,20,0.7))"
        : "linear-gradient(180deg, rgba(4,10,20,0.16), rgba(4,10,20,0.76))";
      return `background-image: ${overlay}, url('${p.coverImageUrl}');`;
    }
    return `background-image: ${accent.gradient}, linear-gradient(135deg, rgba(16,24,38,0.98), rgba(8,14,28,0.96));`;
  }

  function getCopy(lc: string | null): Copy {
    return lc?.startsWith("de") ? COPY.de : COPY.en;
  }

  function getOrigin(): string {
    return typeof window !== "undefined" ? window.location.origin : "https://aicoyo.com";
  }

  function toggleTag(tag: string) {
    const next = new Set(activeTags);
    if (next.has(tag)) next.delete(tag); else next.add(tag);
    activeTags = next;
  }

  const copy = $derived(getCopy($locale ?? null));
  const allCategories = $derived(Array.from(new Set(posts.map((p) => p.category))));

  const tagCounts = $derived(() => {
    const counts = new Map<string, number>();
    for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
  });

  const isFiltering = $derived(activeCategory !== null || activeTags.size > 0 || searchQuery.trim().length > 0);

  const filteredPosts = $derived(() => {
    let result = posts;
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (activeTags.size > 0) result = result.filter((p) => p.tags.some((t) => activeTags.has(t)));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (sortBy === "readingTime") result = [...result].sort((a, b) => a.readingTimeMinutes - b.readingTimeMinutes);
    return result;
  });

  const featuredPost = $derived(isFiltering ? null : (filteredPosts()[0] || null));
  const gridPosts = $derived(isFiltering ? filteredPosts() : filteredPosts().slice(1));

  const listingJsonLd = $derived(
    posts.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.seoTitle,
          description: copy.seoDescription,
          url: `${getOrigin()}/blog/`,
          hasPart: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${getOrigin()}/blog/${p.slug}/`,
            datePublished: p.publishedAt,
            author: { "@type": "Person", name: p.authorName },
          })),
        })
      : "",
  );

  $effect(() => {
    if (!$locale) return;
    void loadPosts($locale);
  });
</script>

<svelte:head>
  <title>{copy.seoTitle}</title>
  <meta name="description" content={copy.seoDescription} />
  <link rel="canonical" href={`${getOrigin()}/blog/`} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={copy.seoTitle} />
  <meta property="og:description" content={copy.seoDescription} />
  <meta property="og:url" content={`${getOrigin()}/blog/`} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={copy.seoTitle} />
  <meta name="twitter:description" content={copy.seoDescription} />
  <link rel="alternate" type="application/rss+xml" title="AICOYO Blog RSS" href={`${getOrigin()}/api/public/cms/rss`} />
  {#if listingJsonLd}{@html `<script type="application/ld+json">${listingJsonLd}<\/script>`}{/if}
</svelte:head>

<LegalLayout
  activePath="/blog/"
  eyebrow={copy.eyebrow}
  title={copy.title}
  description={copy.description}
  lede={copy.lede}
  maxWidth="1360px"
  shellWidth="1360px"
  showBackHome={false}
>
  {#if loading}
    <div class="state-card">{copy.loading}</div>
  {:else if error}
    <div class="state-card error">{error}</div>
  {:else if posts.length === 0}
    <div class="state-card">{copy.emptyState}</div>
  {:else}
    <!-- Filter bar -->
    <div class="filter-bar">
      <div class="filter-row">
        <div class="category-tabs" role="tablist" aria-label="Categories">
          <button role="tab" aria-selected={activeCategory === null} class:active={activeCategory === null} onclick={() => (activeCategory = null)}>
            {copy.allCategories}
          </button>
          {#each allCategories as cat}
            {@const a = getCategoryAccent(cat)}
            <button role="tab" aria-selected={activeCategory === cat} class:active={activeCategory === cat} style="--tab-color: {a.primary}; --tab-bg: {a.soft}; --tab-border: {a.border}" onclick={() => (activeCategory = activeCategory === cat ? null : cat)}>
              {cat}
            </button>
          {/each}
        </div>
        <div class="filter-controls">
          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <input type="text" placeholder={copy.searchPlaceholder} bind:value={searchQuery} />
          </div>
          <div class="sort-toggle" role="group" aria-label="Sort">
            <button class:active={sortBy === "latest"} onclick={() => (sortBy = "latest")}>{copy.sortLatest}</button>
            <button class:active={sortBy === "readingTime"} onclick={() => (sortBy = "readingTime")}>{copy.sortReadingTime}</button>
          </div>
        </div>
      </div>
      {#if tagCounts().length > 0}
        <div class="tag-chips">
          {#each tagCounts() as [tag, count]}
            <button class="tag-chip" class:active={activeTags.has(tag)} onclick={() => toggleTag(tag)}>
              {tag} <span class="tag-count">{count}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>

    {#if filteredPosts().length === 0}
      <div class="state-card">{copy.noResults}</div>
    {:else}
      <div class="journal-shell">
        <!-- Featured hero card (only when not filtering) -->
        {#if featuredPost}
          {@const fAccent = getCategoryAccent(featuredPost.category)}
          <a class="hero-card" href={`/blog/${featuredPost.slug}/`} onclick={(e) => navigateToBlogPost(featuredPost.slug, e)}>
            <div class="hero-visual" style={coverStyle(featuredPost, "hero")}>
              <span class="hero-badge">{copy.featureLabel}</span>
            </div>
            <div class="hero-copy">
              <div class="post-meta">
                <span class="category-badge" style="--badge-color: {fAccent.primary}; --badge-bg: {fAccent.soft}; --badge-border: {fAccent.border}">{featuredPost.category}</span>
                <span>{readTime(featuredPost)}</span>
                {#if featuredPost.publishedAt}<time datetime={featuredPost.publishedAt}>{fmt(featuredPost.publishedAt)}</time>{/if}
              </div>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              {#if featuredPost.tags.length > 0}
                <div class="tag-row">
                  {#each featuredPost.tags.slice(0, 4) as tag}<span>{tag}</span>{/each}
                </div>
              {/if}
            </div>
          </a>
        {/if}

        <!-- Grid -->
        {#if gridPosts.length > 0}
          <section class="grid-section">
            {#if !isFiltering}
              <span class="section-label">{copy.latestTitle}</span>
            {/if}
            <div class="post-grid">
              {#each gridPosts as post}
                {@const a = getCategoryAccent(post.category)}
                <a class="post-card" href={`/blog/${post.slug}/`} onclick={(e) => navigateToBlogPost(post.slug, e)}>
                  <div class="card-visual" style={coverStyle(post, "card")}></div>
                  <div class="card-copy">
                    <div class="post-meta">
                      <span class="category-badge" style="--badge-color: {a.primary}; --badge-bg: {a.soft}; --badge-border: {a.border}">{post.category}</span>
                      <span>{readTime(post)}</span>
                      {#if post.publishedAt}<time datetime={post.publishedAt}>{fmt(post.publishedAt)}</time>{/if}
                    </div>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                    {#if post.tags.length > 0}
                      <div class="tag-row compact">
                        {#each post.tags.slice(0, 3) as tag}<span>{tag}</span>{/each}
                      </div>
                    {/if}
                  </div>
                </a>
              {/each}
            </div>
          </section>
        {/if}
      </div>
    {/if}
  {/if}
</LegalLayout>

<style>
  .state-card {
    padding: 24px;
    border-radius: 20px;
    border: 1px solid var(--border-subtle);
    background: var(--surface-elevated-strong);
    color: var(--text-secondary);
  }

  .state-card.error {
    color: #fecaca;
    border-color: rgba(248, 113, 113, 0.26);
    background: rgba(127, 29, 29, 0.24);
  }

  /* === Filter bar === */
  .filter-bar {
    display: grid;
    gap: 14px;
    padding: 18px 22px;
    margin-bottom: 28px;
    border-radius: 20px;
    border: 1px solid var(--border-subtle);
    background: var(--surface-elevated-strong);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 80px;
    z-index: 10;
  }

  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    justify-content: space-between;
  }

  .category-tabs { display: flex; flex-wrap: wrap; gap: 6px; }

  .category-tabs button {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid var(--border-subtle);
    background: var(--surface-muted);
    color: var(--text-secondary);
    font-family: var(--font-ui);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: var(--transition-button);
  }

  .category-tabs button:hover { border-color: var(--border-strong); background: var(--accent-soft-strong); }
  .category-tabs button.active { border-color: var(--tab-border, var(--accent-border)); background: var(--tab-bg, var(--accent-soft)); color: var(--tab-color, var(--accent-primary)); }

  .filter-controls { display: flex; gap: 10px; align-items: center; }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid var(--border-subtle);
    background: var(--surface-muted);
    color: var(--text-tertiary);
  }

  .search-box input { background: none; border: none; color: var(--text-primary); font-family: var(--font-ui); font-size: 13px; width: 160px; outline: none; }
  .search-box input::placeholder { color: var(--text-tertiary); }

  .sort-toggle { display: flex; border-radius: 10px; border: 1px solid var(--border-subtle); overflow: hidden; }
  .sort-toggle button { min-height: 32px; padding: 0 12px; border: none; background: var(--surface-muted); color: var(--text-tertiary); font-family: var(--font-ui); font-size: 11px; font-weight: 600; cursor: pointer; transition: var(--transition-button); }
  .sort-toggle button.active { background: var(--accent-soft); color: var(--accent-primary); }
  .sort-toggle button:not(:last-child) { border-right: 1px solid var(--border-subtle); }

  .tag-chips { display: flex; flex-wrap: wrap; gap: 6px; }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 28px;
    padding: 0 11px;
    border-radius: 999px;
    border: 1px solid var(--border-subtle);
    background: var(--surface-muted);
    color: var(--text-secondary);
    font-family: var(--font-ui);
    font-size: 11px;
    cursor: pointer;
    transition: var(--transition-button);
  }

  .tag-chip:hover { border-color: var(--border-strong); }
  .tag-chip.active { border-color: var(--accent-border); background: var(--accent-soft); color: var(--accent-primary); }
  .tag-count { font-size: 10px; color: var(--text-tertiary); }
  .tag-chip.active .tag-count { color: var(--accent-primary-strong); opacity: 0.7; }

  /* === Shared === */
  .journal-shell { display: grid; gap: 32px; }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    color: var(--text-tertiary);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    align-items: center;
  }

  .category-badge {
    display: inline-flex;
    align-items: center;
    min-height: 22px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid var(--badge-border, rgba(86, 141, 171, 0.2));
    background: var(--badge-bg, rgba(86, 141, 171, 0.06));
    color: var(--badge-color, #5eead4);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .section-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    margin-bottom: 4px;
  }

  .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag-row span {
    display: inline-flex;
    min-height: 26px;
    align-items: center;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid var(--border-subtle);
    background: var(--surface-muted);
    color: var(--text-primary);
    font-size: 10px;
  }

  .tag-row.compact span { min-height: 24px; font-size: 10px; }

  /* === Hero card === */
  .hero-card {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
    background: var(--surface-elevated);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .hero-card:hover {
    border-color: var(--border-strong);
    box-shadow: var(--panel-shadow-lg);
  }

  .hero-visual {
    position: relative;
    min-height: 380px;
    background-size: cover;
    background-position: center;
    border-right: 1px solid var(--border-subtle);
  }

  .hero-badge {
    position: absolute;
    left: 18px;
    top: 18px;
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--accent-border);
    background: var(--surface-overlay-strong);
    backdrop-filter: blur(10px);
    color: var(--accent-primary);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .hero-copy {
    display: grid;
    gap: 14px;
    padding: 28px;
    align-content: center;
  }

  .hero-copy h2 {
    margin: 0;
    font-size: clamp(28px, 3vw, 44px);
    line-height: 1.06;
    letter-spacing: -0.04em;
  }

  .hero-copy p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 0.96rem;
  }

  /* === Post grid === */
  .grid-section { display: grid; gap: 8px; }

  .post-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  .post-card {
    display: grid;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
    background: var(--surface-elevated);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .post-card:hover {
    border-color: var(--border-strong);
    box-shadow: var(--panel-shadow-lg);
  }

  .card-visual {
    min-height: 190px;
    background-size: cover;
    background-position: center;
    border-bottom: 1px solid var(--border-subtle);
  }

  .card-copy {
    display: grid;
    gap: 10px;
    padding: 20px;
  }

  .card-copy strong {
    font-size: clamp(18px, 1.6vw, 24px);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .card-copy p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.55;
    font-size: 0.9rem;
  }

  /* === Responsive === */
  @media (max-width: 960px) {
    .hero-card { grid-template-columns: 1fr; }
    .hero-visual { min-height: 260px; border-right: none; border-bottom: 1px solid var(--border-subtle); }
  }

  @media (max-width: 760px) {
    .filter-row { flex-direction: column; align-items: stretch; }
    .search-box input { width: 100%; }
    .post-grid { grid-template-columns: 1fr; }
    .hero-copy { padding: 22px; }
  }
</style>
