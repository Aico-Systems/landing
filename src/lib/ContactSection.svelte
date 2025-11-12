<script lang="ts">
  import Icon from './Icon.svelte';

  const channels = [
    {
      tag: 'Sales',
      title: 'Launch a pilot',
      description: 'Get a walkthrough of call flows, integrations, and pricing built for your operations team.',
      icon: 'calendar',
      actions: [
        { label: 'Book 30-min strategy call', href: 'mailto:sales@aico.ai' },
        { label: 'Download deployment brief', href: '#cta' }
      ]
    },
    {
      tag: 'Support',
      title: '24/7 engineering desk',
      description: 'Existing customers can open a ticket or hop into a live bridge with our voice reliability team.',
      icon: 'lifebuoy',
      actions: [
        { label: 'Create support ticket', href: 'mailto:support@aico.ai' },
        { label: 'View status page', href: 'https://status.aico.ai' }
      ]
    },
    {
      tag: 'Partnerships',
      title: 'Integrations & co-selling',
      description: 'Partner with Aico to embed our agents into your stack or co-deliver voice automation programs.',
      icon: 'handshake',
      actions: [
        { label: 'Contact partnerships', href: 'mailto:partnerships@aico.ai' },
        { label: 'Explore partner playbook', href: '#use-cases' }
      ]
    }
  ];
</script>

<section id="contact" class="contact">
  <div class="container">
    <div class="contact-shell">
      <div class="contact-intro">
        <span class="eyebrow">Let’s build your voice ops</span>
        <h2>Talk to the Aico team.</h2>
        <p>
          Whether you are designing a pilot or rolling out globally, our specialists will help you map each call journey,
          connect tooling, and ship with confidence.
        </p>

        <div class="contact-highlights">
          <div class="highlight">
            <Icon name="clock" size={18} strokeWidth={2} />
            <div>
              <strong>Global coverage</strong>
              <span>08:00 – 24:00 local / weekend on-call</span>
            </div>
          </div>
          <div class="highlight">
            <Icon name="shield-check" size={18} strokeWidth={2} />
            <div>
              <strong>Security ready</strong>
              <span>SOC2 Type II · HIPAA BAA · GDPR</span>
            </div>
          </div>
          <div class="highlight">
            <Icon name="users" size={18} strokeWidth={2} />
            <div>
              <strong>Specialist teams</strong>
              <span>Voice reliability · Knowledge ops · CX strategy</span>
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
                <a href={action.href} class="card-link">
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
    border: 1px solid rgba(102, 126, 234, 0.22);
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(28px);
    color: #f8fafc;
    box-shadow: 0 40px 90px rgba(8, 12, 24, 0.45);
  }

  :global([data-theme="light"]) .contact-intro {
    background: rgba(248, 249, 255, 0.85);
    color: var(--text-primary);
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgba(102, 126, 234, 0.32);
    background: rgba(102, 126, 234, 0.14);
    color: #dbe3ff;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    width: fit-content;
  }

  :global([data-theme="light"]) .eyebrow {
    color: #4c5fe3;
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
    border: 1px solid rgba(102, 126, 234, 0.22);
    background: rgba(11, 17, 32, 0.55);
    backdrop-filter: blur(30px);
    color: #edf2ff;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow: 0 32px 70px rgba(8, 12, 24, 0.4);
    animation: cardFadeIn 0.6s ease both;
  }

  :global([data-theme="light"]) .contact-card {
    background: rgba(248, 249, 255, 0.8);
    color: var(--text-primary);
  }

  .contact-card:hover {
    transform: translateY(-6px);
    border-color: rgba(102, 126, 234, 0.4);
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
    color: rgba(214, 219, 255, 0.95);
  }

  :global([data-theme="light"]) .tag {
    color: rgba(76, 95, 227, 0.9);
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
    background: rgba(102, 126, 234, 0.18);
    color: #cbd5ff;
  }

  :global([data-theme="light"]) .icon-badge {
    color: #4c5fe3;
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
    border: 1px solid rgba(102, 126, 234, 0.25);
    background: rgba(102, 126, 234, 0.12);
    transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
  }

  .card-link:hover {
    transform: translateY(-2px);
    border-color: rgba(102, 126, 234, 0.4);
    background: rgba(102, 126, 234, 0.2);
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
      padding: 100px 0;
    }

    .contact-intro {
      padding: 28px;
    }

    .contact-card {
      padding: 28px;
    }
  }
</style>
