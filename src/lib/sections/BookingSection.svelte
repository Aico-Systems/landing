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
  const embedSnippet = [
    `<script src="${scriptUrl || "https://widget.example.com/widget.js"}"><\\/script>`,
    "",
    `<ac-booking org-id="${orgId || "your-booking-slug"}" api-url="${apiUrl || "https://api.example.com"}"></ac-booking>`,
  ].join("\n");

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

  function scrollToCta() {
    document.getElementById("cta")?.scrollIntoView({
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
        <Badge variant="default">Live Booking Widget</Badge>
        <h2>Book a working session straight from the landing page.</h2>
        <p class="lead">
          The same booking widget can be embedded on any site, microsite, or
          campaign page. Here it is wired into the landing experience with the
          exact production host for the current environment.
        </p>

        <div class="signal-list">
          <div>
            <span class="signal-icon"><Icon name="calendar-check-2" size={18} strokeWidth={1.8} /></span>
            Real availability from the booking backend
          </div>
          <div>
            <span class="signal-icon"><Icon name="globe" size={18} strokeWidth={1.8} /></span>
            Stable widget URL served from Shady deploy infrastructure
          </div>
          <div>
            <span class="signal-icon"><Icon name="sparkles" size={18} strokeWidth={1.8} /></span>
            Brand-aligned presentation without copying widget logic into landing
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-card">
            <span class="meta-label">Widget URL</span>
            <strong>{widgetUrl || "Not configured"}</strong>
          </div>
          <div class="meta-card">
            <span class="meta-label">Default booking slug</span>
            <strong>{orgId || "Not configured"}</strong>
          </div>
        </div>

        <div class="action-row">
          <Button variant="primary" onClick={scrollToCta}>Need a custom rollout?</Button>
          {#if scriptUrl}
            <a
              class="inline-link"
              href={scriptUrl}
              target="_blank"
              rel="noreferrer"
            >Open widget script</a>
          {/if}
        </div>
      </div>

      <div class="booking-preview">
        <div class="preview-card">
          <div class="preview-header">
            <span class="preview-pill">Interactive Preview</span>
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

          <div class="widget-frame">
            <div bind:this={widgetHost} class:widget-host-ready={widgetState === "ready"}></div>

            {#if widgetState === "loading"}
              <div class="widget-message">
                <span class="spin">
                  <Icon name="loader-circle" size={20} strokeWidth={1.8} />
                </span>
                Loading booking experience...
              </div>
            {:else if widgetState === "error"}
              <div class="widget-message error">
                <Icon name="triangle-alert" size={20} strokeWidth={1.8} />
                {widgetError}
              </div>
            {/if}
          </div>
        </div>

        <div class="embed-card">
          <div class="embed-header">
            <h3>Embed snippet</h3>
            <span>Copy into any page shell</span>
          </div>
          <pre><code>{embedSnippet}</code></pre>
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
    gap: 24px;
  }

  .booking-copy h2 {
    font-size: clamp(36px, 4.5vw, 52px);
    line-height: 1.1;
    color: var(--text-primary);
  }

  .lead {
    font-size: 18px;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 60ch;
  }

  .signal-list {
    display: grid;
    gap: 14px;
    color: var(--text-secondary);
  }

  .signal-list div {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
  }

  .signal-icon {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(20, 91, 122, 0.12);
    color: #145b7a;
  }

  :global([data-theme="dark"]) .signal-icon {
    background: rgba(167, 243, 208, 0.14);
    color: #a7f3d0;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .meta-card,
  .preview-card,
  .embed-card {
    border-radius: 28px;
    border: 1px solid rgba(20, 91, 122, 0.18);
    background: rgba(248, 250, 252, 0.78);
    backdrop-filter: blur(18px);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  }

  :global([data-theme="dark"]) .meta-card,
  :global([data-theme="dark"]) .preview-card,
  :global([data-theme="dark"]) .embed-card {
    background: rgba(11, 18, 38, 0.68);
    box-shadow: 0 32px 80px rgba(2, 6, 23, 0.34);
  }

  .meta-card {
    display: grid;
    gap: 8px;
    padding: 20px 22px;
  }

  .meta-label {
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .meta-card strong {
    font-size: 15px;
    line-height: 1.5;
    color: var(--text-primary);
    word-break: break-word;
  }

  .action-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .inline-link {
    color: #145b7a;
    font-weight: 600;
  }

  :global([data-theme="dark"]) .inline-link {
    color: #5eead4;
  }

  .booking-preview {
    display: grid;
    gap: 18px;
  }

  .preview-card {
    padding: 24px;
  }

  .preview-header,
  .embed-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .preview-header {
    margin-bottom: 18px;
  }

  .preview-pill {
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
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

  .widget-frame {
    position: relative;
    min-height: 720px;
    border-radius: 24px;
    border: 1px solid rgba(20, 91, 122, 0.18);
    background:
      radial-gradient(circle at top, rgba(94, 234, 212, 0.12), transparent 42%),
      rgba(255, 255, 255, 0.72);
    padding: 20px;
    overflow: hidden;
  }

  :global([data-theme="dark"]) .widget-frame {
    background:
      radial-gradient(circle at top, rgba(94, 234, 212, 0.18), transparent 42%),
      rgba(15, 23, 42, 0.8);
  }

  .widget-host-ready {
    min-height: 100%;
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

  .embed-card {
    padding: 22px 24px;
  }

  .embed-header {
    margin-bottom: 14px;
  }

  .embed-header h3 {
    font-size: 18px;
    color: var(--text-primary);
  }

  .embed-header span {
    font-size: 13px;
    color: var(--text-tertiary);
  }

  .embed-card pre {
    margin: 0;
    padding: 18px 20px;
    border-radius: 18px;
    overflow: auto;
    background: rgba(15, 23, 42, 0.94);
    color: #e2e8f0;
    font-family:
      "JetBrains Mono",
      "SFMono-Regular",
      Consolas,
      "Liberation Mono",
      monospace;
    font-size: 13px;
    line-height: 1.7;
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

    .meta-grid {
      grid-template-columns: 1fr;
    }

    .widget-frame {
      min-height: 640px;
      padding: 14px;
    }

    .preview-card,
    .embed-card {
      padding: 18px;
    }
  }
</style>
