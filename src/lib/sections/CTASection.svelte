<script lang="ts">
  import Icon from "../components/Icon.svelte";
  import Button from "../components/Button.svelte";
  import Badge from "../components/Badge.svelte";

  let email = "";

  function handleSubmit(e: Event) {
    e.preventDefault();
    // Handle form submission
    console.log("Demo requested for:", email);
    email = "";
  }
</script>

<section id="cta" class="cta-section">
  <div class="container">
    <div class="cta-shell">
      <div class="cta-copy">
        <Badge variant="outline">Pilot Aico</Badge>
        <h2>Spin up your voice agent pilot in days, not months.</h2>
        <p>
          Share a work email and our team will schedule a working session. Bring
          your call flows, tools, and success metrics—we’ll show you how Aico
          maps to them instantly.
        </p>

        <form on:submit={handleSubmit} class="cta-form">
          <input
            type="email"
            bind:value={email}
            placeholder="Work email"
            required
            class="email-input"
          />
          <Button type="submit" variant="primary">Request a demo</Button>
        </form>

        <div class="cta-perks">
          <div>
            <Icon name="clock" size={18} strokeWidth={2} />
            30-minute discovery with voice specialists
          </div>
          <div>
            <Icon name="layers" size={18} strokeWidth={2} />
            Custom blueprint aligned to your call journeys
          </div>
          <div>
            <Icon name="shield-check" size={18} strokeWidth={2} />
            Security review and deployment guidance
          </div>
        </div>
      </div>

      <div class="cta-panel">
        <h3>What’s included</h3>
        <ul>
          <li>
            <Icon name="sparkles" size={18} strokeWidth={2} />
            Live demo tailored to your industry playbooks
          </li>
          <li>
            <Icon name="git-branch" size={18} strokeWidth={2} />
            Integration plan for telephony, CRM, and tooling
          </li>
          <li>
            <Icon name="gauge" size={18} strokeWidth={2} />
            Automation ROI forecast and roll-out timeline
          </li>
        </ul>

        <div class="panel-footnote">
          <Icon name="message-circle" size={18} strokeWidth={2} />
          Prefer async? <a href="mailto:hello@aico.ai">Email our team</a> with your
          goals.
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .cta-section {
    padding: 120px 0;
    background: transparent;
    position: relative;
    overflow: hidden;
    min-height: 60vh;
    display: flex;
    align-items: center;
  }

  .cta-shell {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: clamp(32px, 5vw, 56px);
    align-items: stretch;
    padding: clamp(40px, 5vw, 72px);
    border-radius: 36px;
    border: 1px solid rgba(102, 126, 234, 0.28);
    background: rgba(12, 19, 36, 0.65);
    backdrop-filter: blur(38px);
    color: #f8fafc;
    box-shadow: 0 48px 120px rgba(9, 12, 24, 0.42);
  }

  :global([data-theme="light"]) .cta-shell {
    background: rgba(248, 249, 255, 0.9);
    color: var(--text-primary);
  }

  .cta-copy {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .cta-copy h2 {
    font-size: clamp(38px, 4.4vw, 52px);
    line-height: 1.2;
    color: inherit;
  }

  .cta-copy p {
    font-size: 18px;
    line-height: 1.8;
    opacity: 0.9;
  }

  .cta-form {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .email-input {
    flex: 1;
    min-width: 260px;
    padding: 16px 22px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    background: rgba(15, 23, 42, 0.35);
    backdrop-filter: blur(16px);
    color: inherit;
    font-size: 16px;
    transition:
      border-color 0.3s ease,
      background 0.3s ease;
  }

  .email-input::placeholder {
    color: rgba(226, 232, 240, 0.7);
  }

  .email-input:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.65);
    background: rgba(15, 23, 42, 0.5);
  }

  :global([data-theme="light"]) .email-input {
    background: rgba(255, 255, 255, 0.7);
    border-color: rgba(102, 126, 234, 0.35);
    color: var(--text-primary);
  }

  .cta-perks {
    display: grid;
    gap: 12px;
    margin-top: 8px;
    font-size: 15px;
    opacity: 0.85;
  }

  .cta-perks div {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .cta-panel {
    border-radius: 28px;
    border: 1px solid rgba(102, 126, 234, 0.28);
    background: rgba(9, 14, 28, 0.55);
    backdrop-filter: blur(32px);
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  :global([data-theme="light"]) .cta-panel {
    background: rgba(248, 249, 255, 0.85);
    color: var(--text-primary);
  }

  .cta-panel h3 {
    font-size: 22px;
    font-weight: 600;
  }

  .cta-panel ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 16px;
    font-size: 15px;
  }

  .cta-panel li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .cta-panel li :global(svg) {
    flex-shrink: 0;
  }

  .panel-footnote {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(148, 163, 209, 0.3);
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
  }

  .panel-footnote a {
    color: inherit;
    text-decoration: underline;
  }

  @media (max-width: 968px) {
    .cta-shell {
      grid-template-columns: 1fr;
      padding: 36px 28px;
    }

    .cta-form {
      flex-direction: column;
      align-items: stretch;
    }

    .cta-panel {
      padding: 28px;
    }
  }
</style>
