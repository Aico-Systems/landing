<script lang="ts">
  import Icon from './Icon.svelte';
  
  const features = [
    {
      icon: 'phone-forwarded',
      title: 'Carrier-grade voice infrastructure',
      description: 'Managed SIP, PSTN, and WebRTC orchestration with adaptive jitter buffers keep every conversation crisp.',
      highlights: [
        'Bring your own carrier or use our Telnyx & Twilio bridges',
        'Sub-300ms roundtrip with dynamic silence detection'
      ]
    },
    {
      icon: 'brain',
      title: 'Knowledge that stays on brand',
      description: 'RAG pipelines tuned for support, sales, and compliance with automatic grounding references in every reply.',
      highlights: [
        'Automatic versioning of SOPs and product updates',
        'Citations embedded in transcripts for audits'
      ]
    },
    {
      icon: 'git-merge',
      title: 'Workflow automation from the call',
      description: 'Trigger downstream systems mid-conversation through secure tool calls—without brittle IVR trees.',
      highlights: [
        'Native Salesforce, Zendesk, HubSpot, & custom API actions',
        'Intent-aware branching with guardrails and fallbacks'
      ]
    },
    {
      icon: 'mic-2',
      title: 'Human-grade voice & emotion',
      description: 'Streaming STT + expressive TTS that handles accents, interruptions, and sentiment pivots in real time.',
      highlights: [
        'Dynamic prosody for empathy, urgency, or escalation',
        'Automatic backchanneling for natural conversations'
      ]
    },
    {
      icon: 'line-chart',
      title: 'Mission control analytics',
      description: 'Monitor call quality, automation coverage, cost, and agent performance from a single glass cockpit.',
      highlights: [
        'Real-time QA classifications and alerting',
        'Outcome attribution down to every automation'
      ]
    },
    {
      icon: 'shield-check',
      title: 'Enterprise safeguards by default',
      description: 'Multi-tenant isolation, SOC2-ready logging, and redaction keep regulated teams secure.',
      highlights: [
        'Data residency controls across regions',
        'Granular RBAC & audit trails for every action'
      ]
    }
  ];
</script>

<section id="features" class="features">
  <div class="container">
    <div class="section-intro">
      <span class="eyebrow">Built for scaled voice automation</span>
      <h2>The platform your operators and engineers both love.</h2>
      <p>
        Aico fuses the reliability of a contact center with the adaptability of modern AI. Every layer—from voice to knowledge to tooling—was designed for mission-critical teams.
      </p>
    </div>

    <div class="features-grid">
      {#each features as feature, index}
        <div class="feature-card" style="animation-delay: {index * 0.1}s">
          <div class="feature-icon">
            <Icon name={feature.icon} size={40} strokeWidth={1.5} />
          </div>
          <div class="feature-header">
            <span class="feature-pill">{feature.title}</span>
            <Icon name="arrow-up-right" size={18} strokeWidth={1.6} />
          </div>
          <p class="feature-description">{feature.description}</p>
          <ul>
            {#each feature.highlights as highlight}
              <li>{highlight}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .features {
    padding: 120px 0;
    background: transparent;
    position: relative;
  }

  .section-intro {
    max-width: 760px;
    margin: 0 auto 72px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgba(102, 126, 234, 0.32);
    background: rgba(102, 126, 234, 0.12);
    color: #4c5fe3;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  h2 {
    font-size: clamp(36px, 4vw, 48px);
    line-height: 1.2;
    color: var(--text-primary);
  }

  .section-intro p {
    color: var(--text-secondary);
    font-size: 18px;
    line-height: 1.8;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  .feature-card {
    padding: 32px;
    border-radius: 22px;
    border: 1px solid rgba(102, 126, 234, 0.22);
    background: rgba(16, 24, 40, 0.55);
    backdrop-filter: blur(28px);
    color: #e2e8f0;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    animation: fadeInUp 0.6s ease-out both;
  }

  :global([data-theme="dark"]) .feature-card {
    background: rgba(16, 24, 40, 0.65);
  }

  :global([data-theme="light"]) .feature-card {
    background: rgba(248, 249, 255, 0.8);
    color: var(--text-primary);
  }

  .feature-card:hover {
    transform: translateY(-10px);
    border-color: rgba(102, 126, 234, 0.55);
    box-shadow: 0 32px 80px rgba(15, 23, 42, 0.35);
  }

  .feature-icon {
    margin-bottom: 24px;
    color: #cbd5ff;
    display: flex;
    align-items: center;
  }

  :global([data-theme="light"]) .feature-icon {
    color: #4c5fe3;
  }

  .feature-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .feature-pill {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
  }

  .feature-description {
    color: inherit;
    opacity: 0.85;
    line-height: 1.7;
    font-size: 15px;
    margin-bottom: 18px;
  }

  .feature-card ul {
    display: grid;
    gap: 12px;
    padding-left: 18px;
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.82;
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

  @media (max-width: 968px) {
    .features-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .section-intro h2 {
      font-size: 36px;
    }

    .feature-card {
      padding: 32px 24px;
    }
  }

  @media (max-width: 640px) {
    .section-intro {
      text-align: left;
      align-items: flex-start;
    }
  }
</style>
