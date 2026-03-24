<script lang="ts">
  import Icon from '../components/Icon.svelte';
  import { t } from "../../i18n";

  type UseCase = {
    title: string;
    badge: string;
    headline: string;
    description: string;
    icon: string;
    stats: Array<{ label: string; value: string }>;
    highlights: string[];
    quote: { text: string; author: string };
  };

  let useCases: UseCase[] = [];

  let activeCase = 0;

  $: useCases = [
    {
      title: $t("useCases.items.support.title"),
      badge: $t("useCases.items.support.badge"),
      headline: $t("useCases.items.support.headline"),
      description: $t("useCases.items.support.description"),
      icon: "life-buoy",
      stats: [
        { label: $t("useCases.items.support.stats.one"), value: "-52%" },
        { label: $t("useCases.items.support.stats.two"), value: "92%" },
        { label: $t("useCases.items.support.stats.three"), value: "-68%" },
      ],
      highlights: [
        $t("useCases.items.support.highlights.one"),
        $t("useCases.items.support.highlights.two"),
        $t("useCases.items.support.highlights.three"),
      ],
      quote: {
        text: $t("useCases.items.support.quote"),
        author: $t("useCases.items.support.author"),
      }
    },
    {
      title: $t("useCases.items.revenue.title"),
      badge: $t("useCases.items.revenue.badge"),
      headline: $t("useCases.items.revenue.headline"),
      description: $t("useCases.items.revenue.description"),
      icon: "target",
      stats: [
        { label: $t("useCases.items.revenue.stats.one"), value: "+47%" },
        { label: $t("useCases.items.revenue.stats.two"), value: "46s" },
        { label: $t("useCases.items.revenue.stats.three"), value: "-33%" },
      ],
      highlights: [
        $t("useCases.items.revenue.highlights.one"),
        $t("useCases.items.revenue.highlights.two"),
        $t("useCases.items.revenue.highlights.three"),
      ],
      quote: {
        text: $t("useCases.items.revenue.quote"),
        author: $t("useCases.items.revenue.author"),
      }
    },
    {
      title: $t("useCases.items.ops.title"),
      badge: $t("useCases.items.ops.badge"),
      headline: $t("useCases.items.ops.headline"),
      description: $t("useCases.items.ops.description"),
      icon: "building-2",
      stats: [
        { label: $t("useCases.items.ops.stats.one"), value: "78%" },
        { label: $t("useCases.items.ops.stats.two"), value: "< 2m" },
        { label: $t("useCases.items.ops.stats.three"), value: "4.8 / 5" },
      ],
      highlights: [
        $t("useCases.items.ops.highlights.one"),
        $t("useCases.items.ops.highlights.two"),
        $t("useCases.items.ops.highlights.three"),
      ],
      quote: {
        text: $t("useCases.items.ops.quote"),
        author: $t("useCases.items.ops.author"),
      }
    }
  ];
</script>

<section id="use-cases" class="use-cases">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">{$t("useCases.eyebrow")}</span>
      <h2>{$t("useCases.title")}</h2>
      <p>{$t("useCases.body")}</p>
    </div>

    <div class="use-cases-container">
      <div class="use-cases-tabs">
        {#each useCases as useCase, index}
          <button 
            class="tab" 
            class:active={activeCase === index}
            on:click={() => activeCase = index}
          >
            <span class="tab-icon">
              <Icon name={useCase.icon} size={28} strokeWidth={1.5} />
            </span>
            <span class="tab-copy">
              <span class="tab-badge">{useCase.badge}</span>
              <span class="tab-title">{useCase.title}</span>
            </span>
          </button>
        {/each}
      </div>

      <div class="use-case-content">
        {#each useCases as useCase, index}
          {#if activeCase === index}
            <article class="use-case-card">
              <header class="card-header">
                <span class="case-badge">{useCase.badge}</span>
                <h3>{useCase.headline}</h3>
                <p>{useCase.description}</p>
              </header>
              
              <div class="stats">
                {#each useCase.stats as stat}
                  <div class="stat">
                    <div class="stat-value">{stat.value}</div>
                    <div class="stat-label">{stat.label}</div>
                  </div>
                {/each}
              </div>

              <ul class="highlights">
                {#each useCase.highlights as highlight}
                  <li>
                    <Icon name="check" size={16} strokeWidth={2} />
                    <span>{highlight}</span>
                  </li>
                {/each}
              </ul>

              <footer class="card-footer">
                <div class="quote">
                  “{useCase.quote.text}”
                </div>
                <span class="quote-author">— {useCase.quote.author}</span>
              </footer>
            </article>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .use-cases {
    padding: 120px 0;
    background: transparent;
    position: relative;
  }

  .section-header {
    text-align: center;
    margin-bottom: 64px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(20, 91, 122, 0.32);
    background: rgba(20, 91, 122, 0.12);
    color: #145B7A;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .section-header h2 {
    font-size: clamp(34px, 4vw, 46px);
    margin-bottom: 0;
    color: var(--text-primary);
  }

  .section-header p {
    font-size: 18px;
    color: var(--text-secondary);
    max-width: 680px;
  }

  .use-cases-container {
    display: grid;
    grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
    gap: 36px;
    align-items: start;
  }

  .use-cases-tabs {
    display: flex;
    flex-direction: column;
    gap: 18px;
    position: sticky;
    top: 120px;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    background: transparent;
    border: 1px solid rgba(20, 91, 122, 0.16);
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
    text-align: left;
    backdrop-filter: blur(16px);
    color: inherit;
  }

  .tab:hover {
    border-color: rgba(20, 91, 122, 0.32);
    transform: translateX(4px);
  }

  .tab.active {
    border-color: rgba(20, 91, 122, 0.45);
    background: rgba(20, 91, 122, 0.14);
    transform: translateX(6px);
  }

  .tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #145B7A;
  }

  .tab-copy {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tab-badge {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .tab-title {
    font-size: 16px;
    font-weight: 600;
    color: inherit;
  }

  .use-case-content {
    position: relative;
    min-height: 420px;
  }

  .use-case-card {
    display: flex;
    flex-direction: column;
    gap: 28px;
    border-radius: 26px;
    padding: 40px;
    border: 1px solid rgba(20, 91, 122, 0.22);
    background: rgba(11, 18, 38, 0.62);
    backdrop-filter: blur(32px);
    color: #f8fafc;
    box-shadow: 0 35px 90px rgba(11, 18, 38, 0.4);
    animation: fadeIn 0.5s ease-out;
  }

  :global([data-theme="light"]) .use-case-card {
    background: rgba(241, 245, 249, 0.86);
    color: var(--text-primary);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .case-badge {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 6px 16px;
    border-radius: 999px;
    width: fit-content;
    border: 1px solid rgba(20, 91, 122, 0.35);
  }

  h3 {
    font-size: clamp(28px, 3vw, 36px);
    line-height: 1.3;
  }

  .card-header p {
    font-size: 17px;
    line-height: 1.8;
    opacity: 0.9;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 24px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-value {
    font-size: 30px;
    font-weight: 700;
  }

  .stat-label {
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  .highlights {
    display: grid;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .highlights li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14px;
    line-height: 1.7;
    opacity: 0.9;
  }

  .highlights li :global(svg) {
    flex-shrink: 0;
    color: #34d399;
  }

  .card-footer {
    padding-top: 20px;
    border-top: 1px solid rgba(20, 91, 122, 0.18);
    display: grid;
    gap: 10px;
  }

  .quote {
    font-style: italic;
    line-height: 1.6;
    opacity: 0.85;
  }

  .quote-author {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.7;
  }

  @media (max-width: 968px) {
    .use-cases {
      padding: 92px 0;
    }

    .section-header {
      margin-bottom: 40px;
      text-align: left;
      align-items: flex-start;
    }

    .section-header p {
      font-size: 16px;
      line-height: 1.65;
    }

    .use-cases-container {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .use-cases-tabs {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: 8px;
      margin: 0 -4px;
      padding-inline: 4px;
      scroll-snap-type: x proximity;
      -ms-overflow-style: none;
      scrollbar-width: none;
      position: static;
    }

    .use-cases-tabs::-webkit-scrollbar {
      display: none;
    }

    .tab {
      min-width: 220px;
      flex: 0 0 auto;
      scroll-snap-align: start;
    }

    .use-case-card {
      padding: 32px;
    }

    h3 {
      font-size: 28px;
    }

    .stats {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  @media (max-width: 640px) {
    .use-cases {
      padding: 80px 0;
    }

    .section-header h2 {
      font-size: 30px;
    }

    .use-cases-tabs {
      gap: 12px;
      margin: 0 -2px;
      padding-inline: 2px;
    }

    .tab {
      min-width: min(280px, calc(100vw - 40px));
      padding: 14px 16px;
      border-radius: 14px;
    }

    .tab:hover,
    .tab.active {
      transform: none;
    }

    .tab-title {
      font-size: 15px;
    }

    .use-case-content {
      min-height: auto;
    }

    .use-case-card {
      padding: 24px 18px;
      gap: 22px;
      border-radius: 20px;
    }

    h3 {
      font-size: 24px;
    }

    .card-header p {
      font-size: 15px;
      line-height: 1.65;
    }

    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 14px;
    }

    .stat-value {
      font-size: 26px;
    }
  }

  @media (max-width: 420px) {
    .stats {
      grid-template-columns: 1fr;
    }
  }
</style>
