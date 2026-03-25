<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";
  import { locale } from "../../i18n";
  import { fetchBlogPosts, type CmsBlogPost } from "../cms/api";
  import { shouldHandleClientNavigation } from "../utils/appNavigation";

  let loading = $state(true);
  let error = $state("");
  let posts = $state<CmsBlogPost[]>([]);

  async function loadPosts(localeCode: string) {
    loading = true;
    error = "";

    try {
      posts = await fetchBlogPosts(localeCode);
    } catch (loadError) {
      error =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load blog posts.";
    } finally {
      loading = false;
    }
  }

  function openPost(event: MouseEvent, slug: string) {
    if (!shouldHandleClientNavigation(event)) return;
    event.preventDefault();
    window.history.pushState(window.history.state, "", `/blog/${slug}/`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  $effect(() => {
    if (!$locale) return;
    void loadPosts($locale);
  });
</script>

<LegalLayout
  activePath="/blog/"
  eyebrow="Editorial"
  title="AICO Journal"
  description="Product notes, rollout lessons and implementation essays from the AICO team."
  lede="The blog is managed directly from Shady CMS and published into the landing experience."
>
  {#if loading}
    <div class="state-card">Loading posts...</div>
  {:else if error}
    <div class="state-card error">{error}</div>
  {:else if posts.length === 0}
    <div class="state-card">No posts have been published for this locale yet.</div>
  {:else}
    <div class="blog-grid">
      {#each posts as post}
        <article class="post-card">
          <div class="post-meta">
            <span>{post.category}</span>
            <span>{post.readingTimeMinutes} min read</span>
            {#if post.publishedAt}
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            {/if}
          </div>
          <h2>
            <a href={`/blog/${post.slug}/`} onclick={(event) => openPost(event, post.slug)}>
              {post.title}
            </a>
          </h2>
          <p>{post.excerpt}</p>
          {#if post.tags.length > 0}
            <div class="tag-row">
              {#each post.tags as tag}
                <span>{tag}</span>
              {/each}
            </div>
          {/if}
        </article>
      {/each}
    </div>
  {/if}
</LegalLayout>

<style>
  .state-card,
  .post-card {
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

  .blog-grid {
    display: grid;
    gap: 18px;
  }

  .post-card {
    padding: 24px;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 14px;
    color: var(--text-tertiary);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0 0 12px;
    font-size: clamp(28px, 4vw, 38px);
    line-height: 1.08;
    letter-spacing: -0.03em;
  }

  h2 a {
    color: inherit;
    text-decoration: none;
  }

  h2 a:hover {
    color: #5eead4;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.8;
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
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
</style>
