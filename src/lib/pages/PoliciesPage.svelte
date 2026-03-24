<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";

  const title = "Richtlinien / Policies";
  const description = "Website-Richtlinien und operative Hinweise fuer AICOYO.";
  const lede =
    "Diese Seite buendelt operative Website-Richtlinien, die neben Impressum, Datenschutz und Nutzungsbedingungen relevant sind.";
</script>

<LegalLayout
  activePath="/policies/"
  eyebrow="Policy Hub"
  {title}
  {description}
  {lede}
>
  <section>
    <h2>1. Speicher- und Praeferenzhinweise</h2>
    <div class="card">
      <p>
        Die Landing Page verwendet derzeit lokale Browser-Speicherungen fuer
        Darstellungs- und Komfortfunktionen, insbesondere fuer Theme- und
        Sprachpraeferenzen. Diese Speicherungen dienen nicht der
        verhaltensbasierten Werbung.
      </p>
    </div>
  </section>

  <section>
    <h2>2. Kontakt- und Terminrichtlinie</h2>
    <div class="card">
      <p>
        Die primaere Kontaktmoeglichkeit auf der Landing Page ist die
        Terminbuchung ueber das eingebundene Buchungs-Widget. Zusaetzlich steht
        die im Footer genannte E-Mail-Adresse fuer allgemeine Anfragen zur
        Verfuegung.
      </p>
    </div>
  </section>

  <section>
    <h2>3. Sicherheit und Responsible Disclosure</h2>
    <div class="card">
      <p>
        Sicherheitsmeldungen zu dieser Website oder den hier verlinkten
        AICOYO-Angeboten koennen an <strong>nikita@aicoflow.com</strong>
        gemeldet werden.
      </p>
      <ul>
        <li>Bitte keine produktiven Daten veraendern, exfiltrieren oder loeschen.</li>
        <li>Bitte keine Systeme ueberlasten oder Verfuegbarkeit gefaehrden.</li>
        <li>Bitte sende reproduzierbare Schritte, betroffene URL und Risiko-Einschaetzung.</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>4. Dokumentrangfolge</h2>
    <div class="card">
      <p>Fuer diese Website gilt folgende Lesereihenfolge:</p>
      <ol>
        <li>Impressum fuer Anbieter- und Pflichtangaben</li>
        <li>Datenschutzerklaerung fuer Datenverarbeitung</li>
        <li>Nutzungsbedingungen fuer den Website-Rahmen</li>
        <li>Diese Richtlinien fuer operative Hinweise</li>
      </ol>
    </div>
  </section>

  <section>
    <h2>5. Aenderungen</h2>
    <div class="card compact">
      <p>
        Wir ueberarbeiten diese Richtlinien, wenn sich Funktionen, Prozesse oder
        rechtliche Anforderungen der Website aendern.
      </p>
    </div>
  </section>
</LegalLayout>

<style>
  section {
    margin: 0 0 28px;
  }

  h2 {
    margin: 0 0 14px;
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  p,
  ul,
  ol {
    margin: 0 0 14px;
  }

  ul,
  ol {
    padding-left: 22px;
  }

  li + li {
    margin-top: 8px;
  }

  .card {
    border-radius: 18px;
    border: 1px solid rgba(86, 141, 171, 0.2);
    background: rgba(15, 23, 42, 0.82);
    box-shadow: 0 28px 90px rgba(2, 8, 23, 0.32);
    padding: 24px;
    margin: 0 0 22px;
  }

  .card.compact {
    padding: 18px 20px;
  }
</style>
