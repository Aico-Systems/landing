<script lang="ts">
  import { onMount } from "svelte";
  import { theme } from "../../stores/theme";
  import Badge from "../components/Badge.svelte";
  import Button from "../components/Button.svelte";
  import Icon from "../components/Icon.svelte";

  type WidgetWindow = Window & {
    __AICO_BOOKING_WIDGET_READY__?: Promise<void>;
  };

  const LOCAL_WIDGET_URL = "http://localhost:5178";
  const LOCAL_API_URL = "http://localhost:5006";
  const LOCAL_DEFAULT_ORG = "aico-global";

  let widgetHost: HTMLDivElement | null = null;
  let widgetElement: HTMLElement | null = null;
  let widgetState: "idle" | "loading" | "ready" | "error" = "idle";
  let widgetError = "";

  let widgetScriptPromise: Promise<void> | null = null;

  function normalizeUrl(value: string | undefined): string {
    return (value || "").trim().replace(/\/+$/, "");
  }

  function isLocalHost(hostname: string): boolean {
    return hostname === "localhost" || hostname === "127.0.0.1";
  }

  function resolveWidgetUrl(): string {
    const configuredUrl = normalizeUrl(import.meta.env.VITE_BOOKING_WIDGET_URL);
    if (configuredUrl) return configuredUrl;
    if (typeof window === "undefined") return "";
    return isLocalHost(window.location.hostname) ? LOCAL_WIDGET_URL : "";
  }

  function resolveOrgId(): string {
    const configuredOrg = (import.meta.env.VITE_BOOKING_WIDGET_ORG || "").trim();
    if (configuredOrg) return configuredOrg;
    if (typeof window === "undefined") return "";
    return isLocalHost(window.location.hostname) ? LOCAL_DEFAULT_ORG : "";
  }

  function resolveApiUrl(): string {
    const configuredUrl = normalizeUrl(
      import.meta.env.VITE_BOOKING_API_URL || import.meta.env.VITE_DEMO_API_URL,
    );
    if (configuredUrl) return configuredUrl;
    if (typeof window === "undefined") return "";
    return isLocalHost(window.location.hostname) ? LOCAL_API_URL : "";
  }

  const widgetUrl = resolveWidgetUrl();
  const apiUrl = resolveApiUrl();
  const orgId = resolveOrgId();
  const scriptUrl = widgetUrl ? `${widgetUrl}/widget.js` : "";
  const isConfigured = Boolean(widgetUrl && apiUrl && orgId);
  async function ensureWidgetScript(): Promise<void> {
    if (typeof window === "undefined" || !scriptUrl) return;
    const widgetWindow = window as WidgetWindow;

    if (widgetWindow.customElements.get("ac-booking")) {
      await widgetWindow.customElements.whenDefined("ac-booking");
      return;
    }

    if (widgetWindow.__AICO_BOOKING_WIDGET_READY__) {
      await widgetWindow.__AICO_BOOKING_WIDGET_READY__;
      return;
    }

    if (widgetScriptPromise) {
      await widgetScriptPromise;
      return;
    }

    widgetScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        'script[data-aico-booking-widget="true"]',
      ) as HTMLScriptElement | null;

      if (existing) {
        if (widgetWindow.customElements.get("ac-booking")) {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Booking widget failed to load.")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.dataset.aicoBookingWidget = "true";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Booking widget failed to load."));
      document.head.appendChild(script);
    });

    await widgetScriptPromise;

    const widgetReady =
      widgetWindow.__AICO_BOOKING_WIDGET_READY__ ||
      widgetWindow.customElements.whenDefined("ac-booking");

    await widgetReady;
  }

  async function mountWidget() {
    if (!widgetHost || !isConfigured) {
      widgetState = "error";
      widgetError = "Booking preview is not configured for this environment yet.";
      return;
    }

    widgetState = "loading";
    widgetError = "";

    try {
      await ensureWidgetScript();

      if (!widgetHost) return;

      if (!widgetElement) {
        widgetHost.innerHTML = "";
        widgetElement = document.createElement("ac-booking");
        widgetHost.appendChild(widgetElement);
      }

      widgetElement.setAttribute("org-id", orgId);
      widgetElement.setAttribute("api-url", apiUrl);
      widgetElement.setAttribute("theme", $theme);
      widgetElement.setAttribute("locale", "en");
      widgetState = "ready";
    } catch (error) {
      widgetState = "error";
      widgetError =
        error instanceof Error ? error.message : "Booking preview failed to load.";
    }
  }

  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  onMount(() => {
    void mountWidget();
  });

  $: if (widgetElement) {
    widgetElement.setAttribute("theme", $theme);
  }
</script>

<section id="booking" class="booking-section">
  <div class="container">
    <div class="booking-shell">
      <div class="booking-copy">
        <Badge variant="default">Book A Pilot</Badge>
        <h2>Schedule a working session with the AICO team.</h2>
        <p class="lead">
          Pick a time that works for your team. In the session we review your
          use case, integration surface, and the fastest path to a production
          rollout.
        </p>

        <div class="booking-points">
          <div class="point-card">
            <span class="point-icon"><Icon name="calendar-check-2" size={18} strokeWidth={1.8} /></span>
            <div>
              <strong>Working session</strong>
              <span>Map the workflow, call volume, and handoff requirements.</span>
            </div>
          </div>
          <div class="point-card">
            <span class="point-icon"><Icon name="cpu" size={18} strokeWidth={1.8} /></span>
            <div>
              <strong>Technical fit</strong>
              <span>Review telephony, tooling, CRM, and internal API touchpoints.</span>
            </div>
          </div>
          <div class="point-card">
            <span class="point-icon"><Icon name="shield-check" size={18} strokeWidth={1.8} /></span>
            <div>
              <strong>Rollout plan</strong>
              <span>Align on security, compliance, pilot scope, and deployment model.</span>
            </div>
          </div>
        </div>

        <p class="booking-note">
          Security review, procurement questions, and enterprise rollout constraints
          are part of the conversation, not an afterthought.
        </p>

        <div class="action-row">
          <Button variant="primary" onClick={() => scrollToSection("cta")}>Talk To Sales</Button>
          <Button variant="secondary" onClick={() => scrollToSection("how-it-works")}>See Delivery Model</Button>
        </div>
      </div>

      <div class="booking-preview">
        <div class="preview-header">
          <div class="preview-copy">
            <span class="preview-pill">Live Scheduling</span>
            <h3>Choose a time and book directly.</h3>
          </div>
          <span class="preview-status" data-state={widgetState}>
            {#if widgetState === "ready"}
              Live
            {:else if widgetState === "loading"}
              Loading
            {:else}
              Pending
            {/if}
          </span>
        </div>

        <div class="widget-stage" class:pending={widgetState !== "ready"}>
          <div bind:this={widgetHost} class:widget-host-ready={widgetState === "ready"}></div>

          {#if widgetState === "loading"}
            <div class="widget-message">
              <span class="spin">
                <Icon name="loader-circle" size={20} strokeWidth={1.8} />
              </span>
              Loading availability...
            </div>
          {:else if widgetState === "error"}
            <div class="widget-message error">
              <Icon name="triangle-alert" size={20} strokeWidth={1.8} />
              {widgetError}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .booking-section {
    padding: 120px 0;
    position: relative;
  }

  .booking-shell {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: clamp(28px, 5vw, 56px);
    align-items: start;
  }

  .booking-copy {
    display: grid;
    gap: 22px;
  }

  .booking-copy h2 {
    font-size: clamp(34px, 4.2vw, 48px);
    line-height: 1.08;
    color: var(--text-primary);
    letter-spacing: -0.03em;
  }

  .lead {
    font-size: 18px;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 58ch;
  }

  .booking-points {
    display: grid;
    gap: 14px;
  }

  .point-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 14px;
    padding: 18px 20px;
    border-radius: 22px;
    border: 1px solid rgba(20, 91, 122, 0.18);
    background: rgba(248, 250, 252, 0.52);
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 44px rgba(15, 23, 42, 0.06);
  }

  :global([data-theme="dark"]) .point-card {
    background: rgba(11, 18, 38, 0.52);
    box-shadow: 0 24px 60px rgba(2, 6, 23, 0.26);
  }

  .point-card strong {
    display: block;
    margin-bottom: 4px;
    color: var(--text-primary);
    font-size: 15px;
  }

  .point-card span:last-child {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.65;
  }

  .point-icon {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(20, 91, 122, 0.12);
    color: #145b7a;
  }

  :global([data-theme="dark"]) .point-icon {
    background: rgba(167, 243, 208, 0.14);
    color: #a7f3d0;
  }

  .booking-note {
    max-width: 54ch;
    color: var(--text-tertiary);
    font-size: 14px;
    line-height: 1.7;
  }

  .action-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .booking-preview {
    display: grid;
    gap: 18px;
    align-content: start;
  }

  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .preview-header {
    margin-bottom: 0;
    padding: 0 4px;
  }

  .preview-copy {
    display: grid;
    gap: 6px;
  }

  .preview-pill {
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .preview-copy h3 {
    font-size: 22px;
    line-height: 1.2;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  .preview-status {
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.16);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .preview-status[data-state="ready"] {
    background: rgba(167, 243, 208, 0.18);
    color: #145b7a;
  }

  :global([data-theme="dark"]) .preview-status[data-state="ready"] {
    color: #a7f3d0;
  }

  .widget-stage {
    position: relative;
    overflow: visible;
  }

  .widget-stage.pending {
    min-height: 520px;
    border-radius: 24px;
    border: 1px solid rgba(20, 91, 122, 0.18);
    background:
      radial-gradient(circle at top, rgba(94, 234, 212, 0.12), transparent 42%),
      rgba(255, 255, 255, 0.72);
    padding: 20px;
    overflow: hidden;
  }

  :global([data-theme="dark"]) .widget-stage.pending {
    background:
      radial-gradient(circle at top, rgba(94, 234, 212, 0.18), transparent 42%),
      rgba(15, 23, 42, 0.8);
  }

  .widget-host-ready {
    min-height: 0;
  }

  .widget-host-ready :global(ac-booking) {
    display: block;
    width: 100%;
  }

  .widget-message {
    position: absolute;
    inset: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border-radius: 20px;
    border: 1px dashed rgba(20, 91, 122, 0.26);
    color: var(--text-secondary);
    background: rgba(248, 250, 252, 0.55);
  }

  :global([data-theme="dark"]) .widget-message {
    background: rgba(11, 18, 38, 0.52);
  }

  .widget-message.error {
    color: #b91c1c;
  }

  :global([data-theme="dark"]) .widget-message.error {
    color: #fca5a5;
  }

  .spin {
    animation: spin 1.1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1024px) {
    .booking-shell {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .booking-section {
      padding: 88px 0;
    }

    .widget-stage.pending {
      min-height: 420px;
      padding: 14px;
    }

    .preview-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
