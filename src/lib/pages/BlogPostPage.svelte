<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";
  import { locale } from "../../i18n";
  import { fetchBlogPost, type CmsBlogPost } from "../cms/api";
  import { shouldHandleClientNavigation } from "../utils/appNavigation";

  let { slug }: { slug: string } = $props();

  let loading = $state(true);
  let error = $state("");
  let post = $state<CmsBlogPost | null>(null);

  async function loadPost(localeCode: string, nextSlug: string) {
    loading = true;
    error = "";

    try {
      post = await fetchBlogPost(nextSlug, localeCode);
    } catch (loadError) {
      post = null;
      error =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load blog post.";
    } finally {
      loading = false;
    }
  }

  function goBack(event: MouseEvent) {
    if (!shouldHandleClientNavigation(event)) return;
    event.preventDefault();
    window.history.pushState(window.history.state, "", "/blog/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function bodyParagraphs(body: string): string[] {
    return body
      .split(/\n{2,}/)
      .map((chunk) => chunk.trim())
      .filter(Boolean);
  }

  $effect(() => {
    if (!$locale) return;
    void loadPost($locale, slug);
  });
</script>

<LegalLayout
  activePath="/blog/"
  eyebrow="Journal"
  title={post?.title || "AICO Journal"}
  description={post?.seoDescription || post?.excerpt || "AICO blog post"}
  lede={post?.excerpt || "Published from Shady CMS."}
>
  {#if loading}
    <div class="state-card">Loading post...</div>
  {:else if error}
    <div class="state-card error">{error}</div>
  {:else if post}
    <article class="post-shell">
      <div class="post-meta">
        <span>{post.category}</span>
        <span>{post.readingTimeMinutes} min read</span>
        {#if post.publishedAt}
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        {/if}
      </div>

      {#if post.tags.length > 0}
        <div class="tag-row">
          {#each post.tags as tag}
            <span>{tag}</span>
          {/each}
        </div>
      {/if}

      <div class="author-row">
        <strong>{post.authorName}</strong>
        <span>{post.authorRole}</span>
      </div>

      <div class="body-copy">
        {#each bodyParagraphs(post.body) as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>
    </article>
  {/if}

  <a class="back-link" href="/blog/" onclick={goBack}>Back to all posts</a>
</LegalLayout>

<style>
  .state-card,
  .post-shell {
    border-radius: 20px;
    border: 1px solid rgba(86, 141, 171, 0.2);
    background: rgba(15, 23, 42, 0.82);
    box-shadow: 0 28px 90px rgba(2, 8, 23, 0.32);
  }

  .state-card {
    padding: 24px;
    color: var(--text-secondary);
  }

  .state-card.error {
    color: #fecaca;
    border-color: rgba(248, 113, 113, 0.26);
    background: rgba(127, 29, 29, 0.24);
  }

  .post-shell {
    padding: 28px;
  }

  .post-meta,
  .tag-row,
  .author-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .post-meta {
    margin-bottom: 14px;
    color: var(--text-tertiary);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .tag-row {
    margin-bottom: 18px;
  }

  .tag-row span {
    display: inline-flex;
    min-height: 30px;
    align-items: center;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(86, 141, 171, 0.18);
    background: rgba(86, 141, 171, 0.08);
    color: var(--text-primary);
    font-size: 12px;
  }

  .author-row {
    align-items: baseline;
    margin-bottom: 24px;
    color: var(--text-secondary);
  }

  .body-copy {
    display: grid;
    gap: 18px;
  }

  .body-copy p {
    margin: 0;
    color: var(--text-primary);
    line-height: 1.9;
    font-size: 17px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    margin-top: 24px;
    min-height: 42px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid rgba(86, 141, 171, 0.18);
    background: rgba(86, 141, 171, 0.08);
    color: var(--text-primary);
    text-decoration: none;
  }
</style>
