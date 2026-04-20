<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";
  import { locale } from "../../i18n";
  import {
    fetchLegalPage,
    type CmsLegalPage,
    type CmsLegalPageKey,
  } from "../cms/api";
  import {
    parseArticle,
    renderInlineMarkup,
    type CalloutVariant,
  } from "../blog/richText";
  import type { AppPath } from "../utils/appNavigation";

  type Copy = {
    loading: string;
    loadError: string;
  };

  const COPY: Record<"en" | "de", Copy> = {
    en: {
      loading: "Loading...",
      loadError: "Failed to load this page.",
    },
    de: {
      loading: "Wird geladen...",
      loadError: "Diese Seite konnte nicht geladen werden.",
    },
  };

  let {
    pageKey,
    activePath,
  }: { pageKey: CmsLegalPageKey; activePath: AppPath } = $props();

  let loading = $state(true);
  let error = $state("");
  let page = $state<CmsLegalPage | null>(null);

  async function loadPage(localeCode: string) {
    loading = true;
    error = "";
    try {
      page = await fetchLegalPage(pageKey, localeCode);
    } catch (e) {
      page = null;
      error = e instanceof Error ? e.message : getCopy(localeCode).loadError;
    } finally {
      loading = false;
    }
  }

  function getCopy(lc: string | null): Copy {
    return lc?.startsWith("de") ? COPY.de : COPY.en;
  }

  function calloutIcon(v: CalloutVariant): string {
    return { note: "ℹ", warning: "⚠", insight: "💡", takeaway: "✦", faq: "?" }[v];
  }

  const copy = $derived(getCopy($locale ?? null));
  const parsed = $derived(
    page
      ? parseArticle(page.body)
      : { blocks: [], headings: [], footnotes: [], faqs: [], takeaway: null },
  );

  $effect(() => {
    if ($locale) void loadPage($locale);
  });
</script>

{#if loading && !page}
  <LegalLayout
    {activePath}
    eyebrow=""
    title={copy.loading}
    description=""
    lede=""
  >
    <div class="state-card">{copy.loading}</div>
  </LegalLayout>
{:else if error && !page}
  <LegalLayout
    {activePath}
    eyebrow=""
    title=""
    description=""
    lede=""
  >
    <div class="state-card error">{error}</div>
  </LegalLayout>
{:else if page}
  <LegalLayout
    {activePath}
    eyebrow={page.eyebrow}
    title={page.title}
    description={page.description}
    lede={page.lede}
  >
    <div class="legal-body">
      {#each parsed.blocks as block}
        {#if block.type === "heading"}
          <svelte:element
            this={block.level === 2 ? "h2" : "h3"}
            id={block.id}
          >
            {@html renderInlineMarkup(block.text)}
          </svelte:element>
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
          <blockquote class="pull-quote">
            <p>{@html renderInlineMarkup(block.text)}</p>
          </blockquote>
        {:else if block.type === "unordered-list"}
          <ul>
            {#each block.items as item}
              <li>{@html renderInlineMarkup(item)}</li>
            {/each}
          </ul>
        {:else if block.type === "ordered-list"}
          <ol>
            {#each block.items as item}
              <li>{@html renderInlineMarkup(item)}</li>
            {/each}
          </ol>
        {:else if block.type === "divider"}
          <hr />
        {/if}
      {/each}
    </div>
  </LegalLayout>
{/if}

<style>
  .state-card {
    padding: 24px;
    border-radius: 18px;
    border: 1px solid var(--border-subtle);
    background: var(--surface-elevated);
    color: var(--text-secondary);
  }

  .state-card.error {
    color: #fecaca;
    border-color: rgba(248, 113, 113, 0.26);
    background: rgba(127, 29, 29, 0.24);
  }

  .legal-body {
    display: grid;
    gap: 16px;
    font-family: var(--font-editorial);
  }

  .legal-body :global(h2) {
    margin: 32px 0 4px;
    font-size: clamp(24px, 2.4vw, 32px);
    line-height: 1.15;
    letter-spacing: -0.02em;
    font-family: var(--font-ui);
    scroll-margin-top: 120px;
  }

  .legal-body :global(h3) {
    margin: 20px 0 2px;
    font-size: clamp(19px, 1.8vw, 22px);
    line-height: 1.2;
    letter-spacing: -0.015em;
    font-family: var(--font-ui);
  }

  .legal-body p,
  .legal-body li,
  .legal-body blockquote {
    margin: 0;
    color: var(--text-primary);
    line-height: 1.75;
    font-size: 16px;
  }

  .legal-body ul,
  .legal-body ol {
    margin: 0;
    display: grid;
    gap: 8px;
    padding-left: 22px;
  }

  .legal-body blockquote {
    padding: 16px 18px;
    border-left: 3px solid var(--accent-border);
    background: var(--accent-soft);
    border-radius: 0 14px 14px 0;
    color: var(--text-secondary);
  }

  .legal-body :global(a) {
    color: var(--accent-primary);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .legal-body hr {
    width: 100%;
    height: 1px;
    border: none;
    background: var(--border-subtle);
    margin: 12px 0;
  }

  .callout {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    padding: 16px 18px;
    border-radius: 14px;
    border: 1px solid var(--border-subtle);
    background: var(--surface-muted);
  }

  .callout-icon {
    font-size: 1.05rem;
    line-height: 1.75;
  }

  .callout-warning {
    border-color: rgba(251, 191, 36, 0.26);
    background: rgba(251, 191, 36, 0.08);
  }

  .callout-note {
    border-color: rgba(56, 189, 248, 0.22);
    background: rgba(56, 189, 248, 0.06);
  }

  .callout p {
    margin: 0;
  }

  .pull-quote {
    padding: 24px;
    border-left: none;
    border-radius: 0;
    background: none;
    text-align: center;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
  }

  .pull-quote p {
    font-family: var(--font-editorial);
    font-size: clamp(18px, 1.8vw, 22px);
    font-style: italic;
    line-height: 1.5;
  }
</style>
