<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "../components/Icon.svelte";
  import Button from "../components/Button.svelte";
  import Badge from "../components/Badge.svelte";
  import { requestSectionNavigation } from "../utils/sectionNavigation";

  let WaveformCanvas: any = null;
  let showWaveform = false;

  onMount(() => {
    const loadWaveform = async () => {
      try {
        const module = await import("../components/WaveformCanvas.svelte");
        WaveformCanvas = module.default;
        showWaveform = true;
      } catch (error) {
        console.error("Failed to load WaveformCanvas:", error);
      }
    };

    requestIdleCallback(() => { loadWaveform(); }, { timeout: 800 });
  });
</script>

<section id="hero" class="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-copy">
        <Badge variant="default">The Conversation Infrastructure</Badge>
        <h1 class="headline">
          Launch call agents that sound like your best team member.
        </h1>
        <p class="subheadline">
          AICOYO blends enterprise telephony, RAG, and live tooling so every
          conversation is on-brand, compliant, and outcome-driven from the first
          hello.
        </p>

        <div class="hero-actions">
          <Button
            variant="primary"
            onClick={() => requestSectionNavigation("booking")}
          >
            Book a Pilot
          </Button>
          <Button
            variant="secondary"
            onClick={() => requestSectionNavigation("how-it-works")}
          >
            Experience the Flow
          </Button>
        </div>

        <div class="hero-list">
          <div class="hero-list-item">
            <span class="list-icon"><Icon name="sparkles" size={18} strokeWidth={1.8} /></span>
            Adaptive talk tracks that mirror your operating manuals.
          </div>
          <div class="hero-list-item">
            <span class="list-icon"><Icon name="cpu" size={18} strokeWidth={1.8} /></span>
            Native integrations to trigger tools, CRMs, and internal APIs.
          </div>
          <div class="hero-list-item">
            <span class="list-icon"><Icon name="shield-check" size={18} strokeWidth={1.8} /></span>
            Auditable transcripts, real-time QA, and tenant-aware controls.
          </div>
        </div>

        <div class="hero-metrics">
          <div class="metric">
            <span class="metric-value">&lt; 300ms</span>
            <span class="metric-label">Voice latency</span>
          </div>
          <div class="metric">
            <span class="metric-value">24/7</span>
            <span class="metric-label">Availability</span>
          </div>
          <div class="metric">
            <span class="metric-value">5+</span>
            <span class="metric-label">LLM providers</span>
          </div>
        </div>

        <div class="hero-trust">
          <span class="trust-label">Design. Deploy. Monitor. Transfer.</span>
        </div>
      </div>

      <div class="hero-visual">
        <div class="visual-glow"></div>
        <div class="hero-waveform">
          {#if showWaveform && WaveformCanvas}
            <svelte:component this={WaveformCanvas} />
          {:else}
            <div class="waveform-placeholder" aria-label="Loading visualization"></div>
          {/if}
        </div>

        <div class="hero-panel primary">
          <div class="panel-header">
            <span class="badge">Live Call · Automotive</span>
            <span class="timestamp">00:36</span>
          </div>
          <div class="panel-body">
            <div class="panel-transcript">
              <div class="actor customer">Customer: "I'd like to schedule a service appointment."</div>
              <div class="actor agent">AICOYO: "Of course — I see your next service is due. Thursday at 10 AM works. Shall I book that?"</div>
            </div>
            <div class="panel-metrics">
              <div>
                <span class="metric-title">Latency</span>
                <span class="metric-score">240ms</span>
              </div>
              <div>
                <span class="metric-title">NPS Prediction</span>
                <span class="metric-score positive">+43</span>
              </div>
            </div>
          </div>
        </div>

        <div class="hero-panel secondary">
          <div class="panel-row">
            <span class="panel-label"><Icon name="badge-check" size={16} strokeWidth={1.6} /> Playbook match</span>
            <span class="panel-value">97%</span>
          </div>
          <div class="panel-row">
            <span class="panel-label"><Icon name="bot" size={16} strokeWidth={1.6} /> Automated tasks</span>
            <span class="panel-value">Calendar · CRM · Follow-up</span>
          </div>
          <div class="panel-row">
            <span class="panel-label"><Icon name="book-open" size={16} strokeWidth={1.6} /> Knowledge hits</span>
            <span class="panel-value">Service handbook · Pricing</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 88px;
    background: transparent;
    position: relative;
    overflow: hidden;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 430px);
    gap: clamp(40px, 5vw, 80px);
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: fadeInUp 0.8s ease-out;
  }

  .headline {
    font-size: clamp(42px, 5.6vw, 60px);
    line-height: 1.04;
    color: var(--text-primary);
    letter-spacing: -0.035em;
    max-width: 10.5ch;
  }

  .subheadline {
    font-size: 17px;
    line-height: 1.65;
    color: var(--text-secondary);
    max-width: 56ch;
  }

  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

  .hero-list { display: grid; gap: 12px; margin-top: 4px; }

  .hero-list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    line-height: 1.55;
    color: var(--text-tertiary);
  }

  .list-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px;
    border-radius: var(--blueprint-radius-md);
    border: 1px solid var(--accent-border);
    background: var(--accent-soft);
    color: var(--accent-primary);
  }

  .hero-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 28px;
    margin-top: 8px;
    padding-top: 18px;
    border-top: 1px solid var(--border-subtle);
  }

  .metric { display: flex; flex-direction: column; gap: 4px; }

  .metric-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .metric-label {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
  }

  .hero-trust {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 12px;
  }

  .trust-label {
    font-size: 13px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent-primary);
    font-weight: 600;
  }

  .hero-visual {
    position: relative;
    animation: fadeInRight 0.8s ease-out 0.2s both;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .visual-glow {
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 42% 18%, rgba(20, 91, 122, 0.22), rgba(20, 91, 122, 0));
    filter: blur(56px);
    opacity: 0.22;
  }

  .hero-waveform { position: relative; min-height: 360px; }

  .waveform-placeholder {
    width: 100%; height: 360px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(20, 91, 122, 0.04) 0%, rgba(167, 243, 208, 0.04) 100%);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.8; } }

  .hero-panel {
    position: relative;
    z-index: 2;
    border-radius: var(--blueprint-radius-lg);
    padding: 18px;
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-subtle);
    background: var(--surface-overlay);
    color: var(--text-primary);
    box-shadow: var(--panel-shadow);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .hero-panel.primary { max-width: 352px; margin-left: auto; margin-right: 12px; }
  .hero-panel.secondary { max-width: 300px; margin-left: 20px; font-size: 13px; gap: 12px; }

  .panel-header { display: flex; justify-content: space-between; align-items: center; }

  .badge {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    min-height: var(--control-height-sm);
    padding: 0 10px; border-radius: 999px;
    border: 1px solid var(--accent-border);
    background: var(--accent-soft);
    color: var(--accent-primary);
  }

  .timestamp { font-size: 13px; opacity: 0.65; }
  .panel-transcript { display: grid; gap: 12px; }
  .actor { font-size: 13px; line-height: 1.6; }
  .actor.customer { opacity: 0.65; }
  .panel-metrics {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }
  .panel-metrics div { display: flex; flex-direction: column; gap: 6px; }
  .metric-title { text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; opacity: 0.6; }
  .metric-score { font-size: 17px; font-weight: 700; }
  .metric-score.positive { color: var(--accent-primary); }
  .panel-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 10px 12px;
    border-radius: var(--blueprint-radius-md);
    border: 1px solid var(--border-subtle);
    background: var(--surface-muted);
  }
  .panel-label { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: inherit; opacity: 0.8; }
  .panel-value { font-weight: 600; color: inherit; text-align: right; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 968px) {
    .hero {
      min-height: auto;
      padding-top: 124px;
      padding-bottom: 56px;
    }
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .headline {
      max-width: none;
    }
    .subheadline {
      max-width: none;
    }
    .hero-visual {
      margin-top: 8px;
      gap: 14px;
    }
    .hero-waveform {
      min-height: 300px;
    }
    .waveform-placeholder {
      height: 300px;
    }
    .hero-panel.primary, .hero-panel.secondary {
      margin: 0;
      max-width: 100%;
    }
    .hero-panel.secondary {
      font-size: 14px;
    }
    .hero-metrics {
      gap: 16px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .hero {
      padding-top: 118px;
      padding-bottom: 44px;
    }
    .hero-copy {
      gap: 20px;
    }
    .headline {
      font-size: clamp(32px, 10vw, 42px);
      line-height: 0.98;
      letter-spacing: -0.04em;
    }
    .subheadline {
      font-size: 15px;
      line-height: 1.55;
    }
    .hero-actions {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
    }
    .hero-actions :global(.btn) {
      width: 100%;
    }
    .hero-list-item {
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      line-height: 1.5;
    }
    .hero-list {
      gap: 10px;
    }
    .hero-metrics {
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .metric-value {
      font-size: 26px;
    }
    .hero-waveform {
      min-height: 248px;
    }
    .waveform-placeholder {
      height: 248px;
      border-radius: 18px;
    }
    .hero-panel {
      padding: 16px;
      border-radius: 16px;
    }
    .panel-header {
      align-items: flex-start;
      gap: 10px;
      flex-direction: column;
    }
    .panel-metrics,
    .panel-row {
      grid-template-columns: 1fr;
    }
    .panel-row {
      align-items: flex-start;
      flex-direction: column;
      gap: 6px;
    }
    .panel-value {
      text-align: left;
    }
  }

  @media (max-width: 420px) {
    .trust-label {
      font-size: 12px;
      letter-spacing: 0.1em;
    }
  }
</style>
