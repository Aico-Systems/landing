<script lang="ts">
  import Icon from '../components/Icon.svelte';
  
  const useCases = [
    {
      title: 'Support Control Tower',
      badge: 'Customer Experience',
      headline: 'Resolve any inbound issue without looping in a human.',
      description: 'Aico listens for intent shifts, updates orders, and closes tickets while keeping empathy and compliance intact.',
      icon: 'life-buoy',
      stats: [
        { label: 'Average handle time', value: '-52%' },
        { label: 'First-contact resolution', value: '92%' },
        { label: 'Agent escalations', value: '-68%' }
      ],
      highlights: [
        'Sync Zendesk, Freshdesk, or Salesforce Service to auto-log cases',
        'Offer proactive follow-ups via SMS or email in the same flow',
        'Live supervisors receive alerts on outlier calls instantly'
      ],
      quote: {
        text: 'Customers feel like they are speaking to our best rep. The automation saved us from hiring 15 seasonal agents this quarter.',
        author: 'VP of Support, Orbit Health'
      }
    },
    {
      title: 'Revenue Desk',
      badge: 'Revenue Teams',
      headline: 'Qualify, schedule, and route leads on the first ring.',
      description: 'Whether inbound phone leads or website call-backs, Aico qualifies prospects, captures context, and books meetings in real time.',
      icon: 'target',
      stats: [
        { label: 'Qualified pipeline', value: '+47%' },
        { label: 'Speed-to-lead', value: '46s' },
        { label: 'No-show reduction', value: '-33%' }
      ],
      highlights: [
        'Native calendar orchestration with HubSpot & Salesforce',
        'Push lead notes and call summaries into your CRM automatically',
        'Answers pricing, features, and integrations with sourced citations'
      ],
      quote: {
        text: 'We finally cover inbound after-hours. Meetings turn up pre-qualified, and reps stay focused on closing.',
        author: 'Head of Growth, Nova Commerce'
      }
    },
    {
      title: 'Ops Command Center',
      badge: 'Internal Operations',
      headline: 'Give every employee a voice concierge for systems, policies, and approvals.',
      description: 'Aico handles IT, HR, and facilities requests by orchestrating knowledge, automations, and approvals in seconds.',
      icon: 'building-2',
      stats: [
        { label: 'Ticket deflection', value: '78%' },
        { label: 'Time to resolution', value: '< 2m' },
        { label: 'Employee CSAT', value: '4.8 / 5' }
      ],
      highlights: [
        'Integrates with ServiceNow, Notion, and custom internal APIs',
        'Understands entitlements, regional policies, and SSO context',
        'Escalates to the right team with a complete audit trail'
      ],
      quote: {
        text: 'It’s like giving every team a dedicated operations lead who never sleeps. Approvals, requests, and knowledge are instant.',
        author: 'COO, Atlas Support'
      }
    }
  ];

  let activeCase = 0;
</script>

<section id="use-cases" class="use-cases">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">Where teams deploy Aico</span>
      <h2>A single brain powering every conversational workflow.</h2>
      <p>Pick a use case to see how the globe above repositions to match your audience and KPIs.</p>
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
    border: 1px solid rgba(102, 126, 234, 0.32);
    background: rgba(102, 126, 234, 0.12);
    color: #4c5fe3;
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
    border: 1px solid rgba(102, 126, 234, 0.16);
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
    text-align: left;
    backdrop-filter: blur(16px);
    color: inherit;
  }

  .tab:hover {
    border-color: rgba(102, 126, 234, 0.32);
    transform: translateX(4px);
  }

  .tab.active {
    border-color: rgba(102, 126, 234, 0.45);
    background: rgba(102, 126, 234, 0.14);
    transform: translateX(6px);
  }

  .tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4c5fe3;
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
    border: 1px solid rgba(102, 126, 234, 0.22);
    background: rgba(11, 17, 32, 0.62);
    backdrop-filter: blur(32px);
    color: #f8fafc;
    box-shadow: 0 35px 90px rgba(9, 12, 24, 0.4);
    animation: fadeIn 0.5s ease-out;
  }

  :global([data-theme="light"]) .use-case-card {
    background: rgba(248, 249, 255, 0.86);
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
    border: 1px solid rgba(102, 126, 234, 0.35);
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
    border-top: 1px solid rgba(102, 126, 234, 0.18);
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
    .use-cases-container {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .use-cases-tabs {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .tab {
      min-width: 220px;
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
</style>
