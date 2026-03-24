<script lang="ts">
  import Icon from '../components/Icon.svelte';
  import { t } from "../../i18n";

  type Step = {
    badge: string;
    title: string;
    description: string;
    icon: string;
    bullets: string[];
  };

  let steps: Step[] = [];

  $: steps = [
    {
      badge: $t("howItWorks.steps.day0.badge"),
      title: $t("howItWorks.steps.day0.title"),
      description: $t("howItWorks.steps.day0.description"),
      icon: "book-open",
      bullets: [
        $t("howItWorks.steps.day0.bullets.one"),
        $t("howItWorks.steps.day0.bullets.two"),
        $t("howItWorks.steps.day0.bullets.three"),
      ],
    },
    {
      badge: $t("howItWorks.steps.day1.badge"),
      title: $t("howItWorks.steps.day1.title"),
      description: $t("howItWorks.steps.day1.description"),
      icon: "blocks",
      bullets: [
        $t("howItWorks.steps.day1.bullets.one"),
        $t("howItWorks.steps.day1.bullets.two"),
        $t("howItWorks.steps.day1.bullets.three"),
      ],
    },
    {
      badge: $t("howItWorks.steps.day5.badge"),
      title: $t("howItWorks.steps.day5.title"),
      description: $t("howItWorks.steps.day5.description"),
      icon: "rocket",
      bullets: [
        $t("howItWorks.steps.day5.bullets.one"),
        $t("howItWorks.steps.day5.bullets.two"),
        $t("howItWorks.steps.day5.bullets.three"),
      ],
    }
  ];
</script>

<section id="how-it-works" class="how-it-works">
  <div class="container">
    <div class="content-grid">
      <div class="intro">
        <span class="eyebrow">{$t("howItWorks.eyebrow")}</span>
        <h2>{$t("howItWorks.title")}</h2>
        <p>
          {$t("howItWorks.body")}
        </p>

        <div class="intro-card">
          <div>
            <span class="card-label">{$t("howItWorks.card.label")}</span>
            <p>{$t("howItWorks.card.body")}</p>
          </div>
          <div class="card-stats">
            <div>
              <span class="stat-value">12+</span>
              <span class="stat-label">{$t("howItWorks.card.integrations")}</span>
            </div>
            <div>
              <span class="stat-value">4 hrs</span>
              <span class="stat-label">{$t("howItWorks.card.kickoff")}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="timeline">
        {#each steps as step, index}
          <div class="timeline-step" style="animation-delay: {index * 0.12}s">
            <div class="marker">
              <span class="dot"></span>
              {#if index !== steps.length - 1}
                <span class="line"></span>
              {/if}
            </div>
            <div class="timeline-card">
              <div class="card-header">
                <span class="badge">{step.badge}</span>
                <span class="icon-wrap">
                  <Icon name={step.icon} size={22} strokeWidth={1.6} />
                </span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <ul>
                {#each step.bullets as bullet}
                  <li>{bullet}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .how-it-works {
    padding: 120px 0;
    background: transparent;
    position: relative;
  }

  .content-grid {
    display: grid;
    grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
    gap: clamp(40px, 5vw, 80px);
    align-items: start;
  }

  .intro {
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 120px;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #145B7A;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(20, 91, 122, 0.32);
    background: rgba(20, 91, 122, 0.12);
    width: fit-content;
  }

  h2 {
    font-size: clamp(36px, 4vw, 48px);
    line-height: 1.2;
    color: var(--text-primary);
  }

  .intro p {
    color: var(--text-secondary);
    line-height: 1.8;
  }

  .intro-card {
    margin-top: 24px;
    padding: 28px;
    border-radius: 20px;
    border: 1px solid rgba(20, 91, 122, 0.2);
    background: rgba(var(--bg-secondary-rgb), 0.12);
    backdrop-filter: blur(18px);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(20, 91, 122, 0.9);
  }

  .intro-card p {
    color: var(--text-secondary);
    margin-top: 8px;
  }

  .card-stats {
    display: flex;
    gap: 24px;
  }

  .card-stats div {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .stat-label {
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .timeline-step {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 24px;
    animation: fadeInUp 0.6s ease both;
  }

  .marker {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, #145B7A, #0B1226);
    box-shadow: 0 0 18px rgba(20, 91, 122, 0.6);
    margin-top: 8px;
  }

  .line {
    position: absolute;
    top: 22px;
    width: 2px;
    height: calc(100% + 12px);
    background: linear-gradient(180deg, rgba(20, 91, 122, 0.28), rgba(20, 91, 122, 0));
  }

  .timeline-card {
    border-radius: 20px;
    padding: 28px 32px;
    border: 1px solid rgba(20, 91, 122, 0.2);
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(24px);
    color: #e2e8f0;
    box-shadow: 0 32px 80px rgba(15, 23, 42, 0.4);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  :global([data-theme="light"]) .timeline-card {
    background: rgba(241, 245, 249, 0.78);
    color: var(--text-primary);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .badge {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(167, 243, 208, 0.8);
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(20, 91, 122, 0.4);
  }

  :global([data-theme="light"]) .badge {
    color: #145B7A;
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(20, 91, 122, 0.18);
    color: #A7F3D0;
  }

  :global([data-theme="light"]) .icon-wrap {
    color: #145B7A;
  }

  .timeline-card h3 {
    font-size: 22px;
    line-height: 1.3;
  }

  .timeline-card p {
    font-size: 16px;
    line-height: 1.7;
    opacity: 0.85;
  }

  .timeline-card ul {
    display: grid;
    gap: 10px;
    margin: 0;
    padding-left: 18px;
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.9;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1100px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .intro {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .how-it-works {
      padding: 88px 0;
    }

    .intro {
      gap: 18px;
    }

    h2 {
      font-size: 32px;
    }

    .intro-card {
      margin-top: 12px;
      padding: 22px;
    }

    .card-stats {
      flex-direction: column;
      gap: 14px;
    }

    .timeline-step {
      grid-template-columns: 24px 1fr;
      gap: 16px;
    }

    .timeline-card {
      padding: 24px;
    }
  }

  @media (max-width: 480px) {
    .how-it-works {
      padding: 80px 0;
    }

    h2 {
      font-size: 28px;
    }

    .intro p,
    .timeline-card p,
    .timeline-card li {
      font-size: 14px;
      line-height: 1.65;
    }

    .timeline-card {
      padding: 20px 18px;
    }
  }
</style>
