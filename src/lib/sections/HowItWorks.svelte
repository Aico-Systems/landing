<script lang="ts">
  import Icon from '../components/Icon.svelte';
  
  const steps = [
    {
      badge: 'Day 0',
      title: 'Blueprint your knowledge fabric',
      description: 'Sync call recordings, SOPs, policies, and product docs. Aico auto-clusters everything into reusable knowledge packs ready for RAG.',
      icon: 'book-open',
      bullets: [
        'Segment intent libraries without manual tagging',
        'Flag regulated phrases and compliance guardrails',
        'Preview sample responses by vertical and persona'
      ]
    },
    {
      badge: 'Day 1',
      title: 'Compose your AI call team',
      description: 'Drag-and-drop call flows, assign real-time tools, and layer sentiment guardrails so the agent adapts like your best rep.',
      icon: 'blocks',
      bullets: [
        'Voice, tone, and pacing auto-tuned to your brand',
        'Connect CRMs, ticketing, billing, and internal APIs',
        'Set escalation paths with one-click handoffs'
      ]
    },
    {
      badge: 'Day 5',
      title: 'Ship to production with confidence',
      description: 'Launch with enterprise controls. Monitor transcripts, latency, and automations from a mission control built for operations teams.',
      icon: 'rocket',
      bullets: [
        'Live shadowing with “tap-in” agent assist',
        'QA dashboards surface anomalies instantly',
        'Continuous learning from every interaction'
      ]
    }
  ];
</script>

<section id="how-it-works" class="how-it-works">
  <div class="container">
    <div class="content-grid">
      <div class="intro">
        <span class="eyebrow">Go live without rewriting your ops</span>
        <h2>Design, train, and deploy in less than a week.</h2>
        <p>
          Aico wraps around your existing playbooks, tools, and compliance rules. We orchestrate knowledge, tooling, and voice so you can launch production-ready agents fast—without guesswork.
        </p>

        <div class="intro-card">
          <div>
            <span class="card-label">Ops mission control</span>
            <p>Realtime dashboards for QA reviewers, CX leads, and revenue teams work out-of-the-box.</p>
          </div>
          <div class="card-stats">
            <div>
              <span class="stat-value">12+</span>
              <span class="stat-label">native integrations</span>
            </div>
            <div>
              <span class="stat-value">4 hrs</span>
              <span class="stat-label">avg. pilot kickoff</span>
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
    color: #5567e7;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(102, 126, 234, 0.32);
    background: rgba(102, 126, 234, 0.12);
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
    border: 1px solid rgba(102, 126, 234, 0.2);
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
    color: rgba(85, 103, 231, 0.9);
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
    background: linear-gradient(135deg, #667eea, #764ba2);
    box-shadow: 0 0 18px rgba(118, 75, 162, 0.6);
    margin-top: 8px;
  }

  .line {
    position: absolute;
    top: 22px;
    width: 2px;
    height: calc(100% + 12px);
    background: linear-gradient(180deg, rgba(102, 126, 234, 0.28), rgba(118, 75, 162, 0));
  }

  .timeline-card {
    border-radius: 20px;
    padding: 28px 32px;
    border: 1px solid rgba(102, 126, 234, 0.2);
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(24px);
    color: #e2e8f0;
    box-shadow: 0 32px 80px rgba(15, 23, 42, 0.4);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  :global([data-theme="light"]) .timeline-card {
    background: rgba(248, 249, 255, 0.78);
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
    color: rgba(236, 245, 255, 0.8);
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(102, 126, 234, 0.4);
  }

  :global([data-theme="light"]) .badge {
    color: #3841b1;
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(102, 126, 234, 0.18);
    color: #cbd5ff;
  }

  :global([data-theme="light"]) .icon-wrap {
    color: #4c5fe3;
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
      padding: 96px 0;
    }

    .timeline-step {
      grid-template-columns: 24px 1fr;
      gap: 16px;
    }

    .timeline-card {
      padding: 24px;
    }
  }
</style>
