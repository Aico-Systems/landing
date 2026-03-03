<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "../components/Icon.svelte";
  import Button from "../components/Button.svelte";
  import Badge from "../components/Badge.svelte";

  let WaveformCanvas: any = null;
  let showWaveform = false;

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }

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
          AICO blends enterprise telephony, RAG, and live tooling so every
          conversation is on-brand, compliant, and outcome-driven from the first
          hello.
        </p>

        <div class="hero-actions">
          <Button variant="primary" onClick={() => scrollToSection("cta")}>
            Book a Pilot
          </Button>
          <Button variant="secondary" onClick={() => scrollToSection("how-it-works")}>
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
              <div class="actor agent">AICO: "Of course — I see your next service is due. Thursday at 10 AM works. Shall I book that?"</div>
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
    padding-top: 80px;
    background: transparent;
    position: relative;
    overflow: hidden;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
    gap: clamp(48px, 6vw, 96px);
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 28px;
    animation: fadeInUp 0.8s ease-out;
  }

  .headline {
    font-size: clamp(44px, 6vw, 64px);
    line-height: 1.1;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .subheadline {
    font-size: 18px;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 620px;
  }

  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }

  .hero-list { display: grid; gap: 14px; margin-top: 8px; }

  .hero-list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    color: var(--text-tertiary);
  }

  .list-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px; height: 30px;
    border-radius: 50%;
    background: rgba(167, 243, 208, 0.15);
    color: #5EEAD4;
  }

  :global([data-theme="light"]) .list-icon {
    color: #145B7A;
    background: rgba(20, 91, 122, 0.1);
  }

  .hero-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-top: 12px;
    padding-top: 16px;
    border-top: 1px solid rgba(20, 91, 122, 0.16);
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
    font-size: 14px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #A7F3D0;
    font-weight: 600;
  }

  :global([data-theme="light"]) .trust-label { color: #145B7A; }

  .hero-visual {
    position: relative;
    animation: fadeInRight 0.8s ease-out 0.2s both;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .visual-glow {
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 42% 18%, rgba(20, 91, 122, 0.45), rgba(20, 91, 122, 0));
    filter: blur(60px);
    opacity: 0.6;
  }

  .hero-waveform { position: relative; min-height: 400px; }

  .waveform-placeholder {
    width: 100%; height: 400px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(20, 91, 122, 0.05) 0%, rgba(167, 243, 208, 0.05) 100%);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.8; } }

  .hero-panel {
    position: relative;
    z-index: 2;
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(20, 91, 122, 0.2);
    background: rgba(11, 18, 38, 0.45);
    color: #f8fafc;
    box-shadow: 0 35px 80px rgba(11, 18, 38, 0.4);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  :global([data-theme="light"]) .hero-panel {
    background: rgba(241, 245, 249, 0.75);
    color: #0f172a;
  }

  .hero-panel.primary { max-width: 380px; margin-left: auto; margin-right: 20px; }
  .hero-panel.secondary { max-width: 320px; margin-left: 28px; font-size: 14px; gap: 14px; }

  .panel-header { display: flex; justify-content: space-between; align-items: center; }

  .badge {
    font-size: 13px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 6px 12px; border-radius: 999px;
    background: rgba(167, 243, 208, 0.15);
    color: #A7F3D0;
  }

  :global([data-theme="light"]) .badge { color: #145B7A; }

  .timestamp { font-size: 14px; opacity: 0.7; }
  .panel-transcript { display: grid; gap: 12px; }
  .actor { font-size: 14px; line-height: 1.6; }
  .actor.customer { opacity: 0.65; }
  .panel-metrics { display: flex; justify-content: space-between; gap: 16px; }
  .panel-metrics div { display: flex; flex-direction: column; gap: 6px; }
  .metric-title { text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; opacity: 0.6; }
  .metric-score { font-size: 18px; font-weight: 700; }
  .metric-score.positive { color: #A7F3D0; }
  .panel-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .panel-label { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: inherit; opacity: 0.8; }
  .panel-value { font-weight: 600; color: inherit; text-align: right; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 968px) {
    .hero { padding-top: 40px; }
    .hero-grid { grid-template-columns: 1fr; }
    .hero-visual { margin-top: 24px; }
    .hero-panel.primary, .hero-panel.secondary { margin: 0; max-width: 100%; }
    .hero-metrics { gap: 16px; }
  }

  @media (max-width: 540px) {
    .hero-actions { width: 100%; }
    .hero-metrics { flex-direction: column; align-items: flex-start; }
  }
</style>
