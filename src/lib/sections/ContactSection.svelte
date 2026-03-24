<script lang="ts">
  import Icon from '../components/Icon.svelte';
  import { t } from "../../i18n";
  import {
    getSectionIdFromHash,
    requestSectionNavigation,
  } from "../utils/sectionNavigation";

  type Channel = {
    tag: string;
    title: string;
    description: string;
    icon: string;
    actions: Array<{ label: string; href: string }>;
  };

  let channels: Channel[] = [];

  $: channels = [
    {
      tag: $t("contact.channels.sales.tag"),
      title: $t("contact.channels.sales.title"),
      description: $t("contact.channels.sales.description"),
      icon: "calendar",
      actions: [
        { label: $t("contact.channels.sales.actionOne"), href: "mailto:nikita@aicoflow.com" },
        { label: $t("contact.channels.sales.actionTwo"), href: "#cta" }
      ]
    },
    {
      tag: $t("contact.channels.support.tag"),
      title: $t("contact.channels.support.title"),
      description: $t("contact.channels.support.description"),
      icon: "lifebuoy",
      actions: [
        { label: $t("contact.channels.support.actionOne"), href: "mailto:support@aicoflow.com" },
        { label: $t("contact.channels.support.actionTwo"), href: "https://aicoflow.com" }
      ]
    },
    {
      tag: $t("contact.channels.partnerships.tag"),
      title: $t("contact.channels.partnerships.title"),
      description: $t("contact.channels.partnerships.description"),
      icon: "handshake",
      actions: [
        { label: $t("contact.channels.partnerships.actionOne"), href: "mailto:nikita@aicoflow.com" },
        { label: $t("contact.channels.partnerships.actionTwo"), href: "#use-cases" }
      ]
    }
  ];

  function handleActionClick(event: MouseEvent, href: string) {
    const sectionId = getSectionIdFromHash(href);
    if (!sectionId) return;

    event.preventDefault();
    requestSectionNavigation(sectionId);
  }
</script>

<section id="contact" class="contact">
  <div class="container">
    <div class="contact-shell">
      <div class="contact-intro">
        <span class="eyebrow">{$t("contact.eyebrow")}</span>
        <h2>{$t("contact.title")}</h2>
        <p>
          {$t("contact.body")}
        </p>

        <div class="contact-highlights">
          <div class="highlight">
            <Icon name="clock" size={18} strokeWidth={2} />
            <div>
              <strong>{$t("contact.highlights.coverageTitle")}</strong>
              <span>{$t("contact.highlights.coverageBody")}</span>
            </div>
          </div>
          <div class="highlight">
            <Icon name="shield-check" size={18} strokeWidth={2} />
            <div>
              <strong>{$t("contact.highlights.securityTitle")}</strong>
              <span>{$t("contact.highlights.securityBody")}</span>
            </div>
          </div>
          <div class="highlight">
            <Icon name="users" size={18} strokeWidth={2} />
            <div>
              <strong>{$t("contact.highlights.teamsTitle")}</strong>
              <span>{$t("contact.highlights.teamsBody")}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-cards">
        {#each channels as channel, index}
          <article class="contact-card" style="animation-delay: {index * 0.1}s">
            <div class="card-header">
              <span class="tag">{channel.tag}</span>
              <span class="icon-badge">
                <Icon name={channel.icon} size={18} strokeWidth={1.8} />
              </span>
            </div>
            <h3>{channel.title}</h3>
            <p>{channel.description}</p>
            <div class="card-actions">
              {#each channel.actions as action}
                <a
                  href={action.href}
                  class="card-link"
                  on:click={(event) => handleActionClick(event, action.href)}
                >
                  {action.label}
                  <Icon name="arrow-up-right" size={16} strokeWidth={1.8} />
                </a>
              {/each}
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .contact {
    padding: 120px 0;
    background: transparent;
    position: relative;
  }

  .contact-shell {
    display: grid;
    grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
    gap: clamp(40px, 6vw, 80px);
    align-items: stretch;
  }

  .contact-intro {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 36px;
    border-radius: 28px;
    border: 1px solid rgba(20, 91, 122, 0.22);
    background: rgba(11, 18, 38, 0.55);
    backdrop-filter: blur(28px);
    color: #f8fafc;
    box-shadow: 0 40px 90px rgba(8, 12, 24, 0.45);
  }

  :global([data-theme="light"]) .contact-intro {
    background: rgba(241, 245, 249, 0.85);
    color: var(--text-primary);
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgba(20, 91, 122, 0.32);
    background: rgba(20, 91, 122, 0.14);
    color: #A7F3D0;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    width: fit-content;
  }

  :global([data-theme="light"]) .eyebrow {
    color: #145B7A;
  }

  h2 {
    font-size: clamp(36px, 4vw, 48px);
    line-height: 1.2;
  }

  .contact-intro p {
    font-size: 17px;
    line-height: 1.8;
    opacity: 0.9;
  }

  .contact-highlights {
    display: grid;
    gap: 16px;
  }

  .highlight {
    display: grid;
    grid-template-columns: 34px 1fr;
    gap: 14px;
    align-items: center;
  }

  .highlight strong {
    display: block;
    font-size: 15px;
    margin-bottom: 4px;
  }

  .highlight span {
    font-size: 13px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.65;
  }

  .contact-cards {
    display: grid;
    gap: 24px;
  }

  .contact-card {
    padding: 32px;
    border-radius: 24px;
    border: 1px solid rgba(20, 91, 122, 0.22);
    background: rgba(11, 18, 38, 0.55);
    backdrop-filter: blur(30px);
    color: #A7F3D0;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow: 0 32px 70px rgba(8, 12, 24, 0.4);
    animation: cardFadeIn 0.6s ease both;
  }

  :global([data-theme="light"]) .contact-card {
    background: rgba(241, 245, 249, 0.8);
    color: var(--text-primary);
  }

  .contact-card:hover {
    transform: translateY(-6px);
    border-color: rgba(20, 91, 122, 0.4);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .tag {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(167, 243, 208, 0.95);
  }

  :global([data-theme="light"]) .tag {
    color: rgba(20, 91, 122, 0.9);
  }

  h3 {
    font-size: 24px;
    line-height: 1.2;
  }

  .contact-card p {
    font-size: 15px;
    line-height: 1.7;
    opacity: 0.85;
  }

  .icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 14px;
    background: rgba(20, 91, 122, 0.18);
    color: #A7F3D0;
  }

  :global([data-theme="light"]) .icon-badge {
    color: #145B7A;
  }

  .card-actions {
    display: grid;
    gap: 12px;
    margin-top: auto;
  }

  .card-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: inherit;
    padding: 10px 14px;
    border-radius: 14px;
    border: 1px solid rgba(20, 91, 122, 0.25);
    background: rgba(20, 91, 122, 0.12);
    transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
  }

  .card-link:hover {
    transform: translateY(-2px);
    border-color: rgba(20, 91, 122, 0.4);
    background: rgba(20, 91, 122, 0.2);
  }

  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1100px) {
    .contact-shell {
      grid-template-columns: 1fr;
    }

    .contact-intro {
      order: 2;
    }

    .contact-cards {
      order: 1;
    }
  }

  @media (max-width: 768px) {
    .contact {
      padding: 88px 0;
    }

    .contact-intro {
      padding: 28px;
    }

    .contact-card {
      padding: 28px;
    }
  }

  @media (max-width: 480px) {
    .contact {
      padding: 80px 0;
    }

    h2 {
      font-size: 30px;
    }

    .contact-intro,
    .contact-card {
      padding: 22px 18px;
      border-radius: 20px;
    }

    .contact-intro p,
    .contact-card p {
      font-size: 15px;
      line-height: 1.65;
    }

    .highlight {
      align-items: start;
      grid-template-columns: 28px 1fr;
      gap: 12px;
    }

    .card-link {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
