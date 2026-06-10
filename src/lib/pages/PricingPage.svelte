<!-- SPDX-License-Identifier: Apache-2.0 -->
<!--
  Public pricing page — n8n-hybrid layout:
    Hero (+ currency toggle)
    Plan cards (Free, Starter, Growth*, Scale, Enterprise)
    Cost calculator (Retell-style itemized)
    OSS "Open core" callout
    Feature matrix
    FAQ
    Enterprise CTA (Cal.com embed slot)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import {
    PlanCard,
    CostCalculator,
    OssCallout,
    PLAN_CATALOG,
    SUPPORTED_CURRENCIES,
    type Currency,
  } from "@aico/blueprint";
  import type { AppPath } from "../utils/appNavigation";
  import type { PlanDef } from "@aico/blueprint";

  interface Props {
    activePath?: AppPath;
  }

  let { activePath: _activePath = "/pricing/" }: Props = $props();
  void _activePath;

  let currency = $state<Currency>("EUR");

  function detectCurrency(): Currency {
    if (typeof window === "undefined") return "EUR";
    const stored = window.localStorage.getItem("aico_currency");
    if (stored && SUPPORTED_CURRENCIES.includes(stored as Currency)) {
      return stored as Currency;
    }
    const locale = navigator.language?.toLowerCase() ?? "";
    if (locale.startsWith("de") || locale.startsWith("fr") || locale.startsWith("nl"))
      return "EUR";
    if (locale.startsWith("en-gb")) return "GBP";
    if (locale.startsWith("de-ch") || locale.startsWith("fr-ch")) return "CHF";
    if (locale.startsWith("en")) return "USD";
    return "EUR";
  }

  function setCurrency(c: Currency) {
    currency = c;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aico_currency", c);
    }
  }

  function startSignup(planKey: string) {
    // Routes to the cloud app's signup with the plan pre-selected.
    const target = `https://app.aicoflow.com/signup?plan=${planKey}&currency=${currency}`;
    if (typeof window !== "undefined") window.location.assign(target);
  }

  function contactSales() {
    if (typeof window !== "undefined")
      window.location.assign("/?section=booking");
  }

  onMount(() => {
    currency = detectCurrency();
  });

  // Non-enterprise plans for the calculator + main card row.
  let paidPlans = $derived<PlanDef[]>(
    PLAN_CATALOG.filter(
      (p: PlanDef) => !p.isContactSales && p.key !== "free",
    ),
  );
</script>

<svelte:head>
  <title>Pricing — AICO</title>
  <meta
    name="description"
    content="AI voice + chat agents from €49/mo. Hard caps on free, transparent overages, EUR / USD / GBP / CHF."
  />
</svelte:head>

<main class="pricing">
  <!-- HERO ====================================================== -->
  <section class="hero">
    <div class="hero__inner">
      <span class="hero__eyebrow">Pricing</span>
      <h1 class="hero__title">
        Voice + chat agents that don't surprise you with a bill.
      </h1>
      <p class="hero__sub">
        Hard caps on the free tier. Transparent overages where they exist.
        Stop guessing what your AI bill will be.
      </p>

      <div class="currency-toggle" role="tablist" aria-label="Currency">
        {#each SUPPORTED_CURRENCIES as c (c)}
          <button
            type="button"
            class:active={currency === c}
            onclick={() => setCurrency(c)}
            role="tab"
            aria-selected={currency === c}
          >
            {c}
          </button>
        {/each}
      </div>
    </div>
  </section>

  <!-- PLAN CARDS ================================================ -->
  <section class="plans">
    <div class="plans__grid">
      {#each PLAN_CATALOG as plan (plan.key)}
        <PlanCard
          {plan}
          {currency}
          recommended={plan.key === "growth"}
          cta={{
            label: plan.isContactSales
              ? "Talk to sales"
              : plan.key === "free"
                ? "Start free"
                : "Start free trial",
            onClick: plan.isContactSales
              ? contactSales
              : () => startSignup(plan.key),
            variant: plan.isContactSales ? "secondary" : undefined,
          }}
          footnote={plan.key === "free"
            ? "Hard cap, no credit card"
            : plan.key === "enterprise"
              ? "On-prem & air-gapped"
              : undefined}
        />
      {/each}
    </div>
    <p class="plans__vat-note">
      Prices shown {currency === "EUR" || currency === "CHF" ? "exclude VAT" : "exclude tax"}.
      VAT applied at checkout based on your billing address.
    </p>
  </section>

  <!-- COST CALCULATOR ============================================ -->
  <section class="calc">
    <div class="calc__inner">
      <CostCalculator plans={paidPlans} {currency} />
    </div>
  </section>

  <!-- OSS CALLOUT =============================================== -->
  <section class="oss">
    <div class="oss__inner">
      <OssCallout />
    </div>
  </section>

  <!-- FEATURE MATRIX ============================================ -->
  <section class="matrix">
    <h2>What's in every plan</h2>
    <div class="matrix__table-wrap">
      <table class="matrix__table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Free</th>
            <th>Starter</th>
            <th>Growth</th>
            <th>Scale</th>
            <th>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Voice minutes / month</td>
            <td>10</td>
            <td>200</td>
            <td>1,000</td>
            <td>4,000</td>
            <td>Custom</td>
          </tr>
          <tr>
            <td>Chat sessions / month</td>
            <td>50</td>
            <td>500</td>
            <td>3,000</td>
            <td>10,000</td>
            <td>Custom</td>
          </tr>
          <tr>
            <td>Concurrent flows</td>
            <td>1</td>
            <td>3</td>
            <td>10</td>
            <td>30</td>
            <td>Unlimited</td>
          </tr>
          <tr>
            <td>Channels (voice / chat / SMS / WhatsApp)</td>
            <td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td>
          </tr>
          <tr>
            <td>Flow versioning</td>
            <td>—</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td>
          </tr>
          <tr>
            <td>Knowledge bases</td>
            <td>—</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td>
          </tr>
          <tr>
            <td>Custom voices</td>
            <td>—</td><td>—</td><td>✓</td><td>✓</td><td>✓</td>
          </tr>
          <tr>
            <td>Audit log + RBAC</td>
            <td>—</td><td>—</td><td>✓</td><td>✓</td><td>✓</td>
          </tr>
          <tr>
            <td>SSO / SAML</td>
            <td>—</td><td>—</td><td>—</td><td>✓</td><td>✓</td>
          </tr>
          <tr>
            <td>SLA</td>
            <td>—</td><td>—</td><td>—</td><td>99.9%</td><td>Custom</td>
          </tr>
          <tr>
            <td>On-prem / air-gapped</td>
            <td>—</td><td>—</td><td>—</td><td>—</td><td>✓</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- FAQ ====================================================== -->
  <section class="faq">
    <h2>Frequently asked</h2>
    <div class="faq__list">
      <details>
        <summary>What happens when I hit the free-tier cap?</summary>
        <p>
          The cap is hard. We never auto-upgrade you, never silently bill
          you. Voice / chat past the included amount returns a 402 with an
          upgrade link. Upgrade or wait for the next month — your call.
        </p>
      </details>
      <details>
        <summary>How do overages work on paid plans?</summary>
        <p>
          Soft overage. Your agent keeps running past the included amount;
          the overage rate shown on each card applies. We show overage
          usage live in the dashboard so there are no end-of-month
          surprises.
        </p>
      </details>
      <details>
        <summary>What about VAT?</summary>
        <p>
          Prices shown exclude VAT. We use Stripe Tax to calculate +
          collect VAT at checkout based on your billing address. Reverse-
          charge handled automatically for EU VAT-registered businesses.
        </p>
      </details>
      <details>
        <summary>Where is my data stored?</summary>
        <p>
          AICO Cloud runs in the EU (Germany). Recordings + transcripts
          stay in the EU. For non-EU residency requirements, see Enterprise.
        </p>
      </details>
      <details>
        <summary>Can I self-host?</summary>
        <p>
          The platform is open-core — self-host trial available today on
          request, public OSS release this year. Commercial features
          (billing, reseller, enterprise telemetry) require a separate
          license.
        </p>
      </details>
      <details>
        <summary>Do you offer non-profit / education discounts?</summary>
        <p>
          Yes. Email <a href="mailto:hello@aicoflow.com">hello@aicoflow.com</a>
          with a brief description of what you're building.
        </p>
      </details>
    </div>
  </section>

  <!-- ENTERPRISE CTA =========================================== -->
  <section class="enterprise-cta">
    <div class="enterprise-cta__inner">
      <h2>Need an enterprise contract?</h2>
      <p>
        Custom contracts, dedicated support engineer, on-prem deployment,
        bespoke integrations. Book a 30-minute intro call below.
      </p>
      <button type="button" class="cta-button" onclick={contactSales}>
        Talk to sales
      </button>
    </div>
  </section>
</main>

<style>
  .pricing {
    color: var(--text-primary, #0f172a);
  }
  .hero {
    padding: 6rem 1.5rem 3rem;
    text-align: center;
  }
  .hero__eyebrow {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(249, 115, 22, 0.1);
    color: var(--accent, #f97316);
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
  }
  .hero__title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 1.5rem;
  }
  .hero__sub {
    font-size: 1.125rem;
    color: var(--text-secondary, #4b5563);
    max-width: 640px;
    margin: 0 auto 2.5rem;
  }
  .currency-toggle {
    display: inline-flex;
    gap: 0;
    padding: 0.25rem;
    background: var(--surface, #ffffff);
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 8px;
  }
  .currency-toggle button {
    padding: 0.5rem 1rem;
    border: 0;
    background: transparent;
    cursor: pointer;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary, #4b5563);
    transition: all 120ms ease;
  }
  .currency-toggle button.active {
    background: var(--accent, #f97316);
    color: white;
  }
  .plans {
    padding: 0 1.5rem 4rem;
  }
  .plans__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  .plans__vat-note {
    text-align: center;
    color: var(--text-muted, #6b7280);
    font-size: 0.8125rem;
    margin: 2rem 0 0;
  }
  .calc {
    padding: 0 1.5rem 4rem;
  }
  .calc__inner {
    max-width: 800px;
    margin: 0 auto;
  }
  .oss {
    padding: 0 1.5rem 4rem;
  }
  .oss__inner {
    max-width: 1000px;
    margin: 0 auto;
  }
  .matrix {
    padding: 0 1.5rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  .matrix h2 {
    text-align: center;
    margin: 0 0 2rem;
  }
  .matrix__table-wrap {
    overflow-x: auto;
  }
  .matrix__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9375rem;
  }
  .matrix__table th,
  .matrix__table td {
    padding: 0.75rem 1rem;
    text-align: center;
    border-bottom: 1px solid var(--border, #e5e7eb);
  }
  .matrix__table th:first-child,
  .matrix__table td:first-child {
    text-align: left;
  }
  .matrix__table thead th {
    background: var(--surface-subtle, #f8fafc);
    font-weight: 600;
  }
  .faq {
    padding: 0 1.5rem 4rem;
    max-width: 800px;
    margin: 0 auto;
  }
  .faq h2 {
    text-align: center;
    margin: 0 0 2rem;
  }
  .faq__list details {
    border-bottom: 1px solid var(--border, #e5e7eb);
    padding: 1rem 0;
  }
  .faq__list summary {
    cursor: pointer;
    font-weight: 500;
    user-select: none;
  }
  .faq__list p {
    margin: 0.75rem 0 0;
    color: var(--text-secondary, #4b5563);
    line-height: 1.6;
  }
  .enterprise-cta {
    background: linear-gradient(
      135deg,
      rgba(249, 115, 22, 0.05) 0%,
      rgba(249, 115, 22, 0.1) 100%
    );
    padding: 4rem 1.5rem;
    text-align: center;
  }
  .enterprise-cta__inner {
    max-width: 600px;
    margin: 0 auto;
  }
  .enterprise-cta h2 {
    margin: 0 0 1rem;
  }
  .enterprise-cta p {
    color: var(--text-secondary, #4b5563);
    margin: 0 0 2rem;
  }
  .cta-button {
    padding: 0.875rem 2rem;
    background: var(--accent, #f97316);
    color: white;
    border: 0;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 120ms ease;
  }
  .cta-button:hover {
    transform: translateY(-2px);
  }
</style>
