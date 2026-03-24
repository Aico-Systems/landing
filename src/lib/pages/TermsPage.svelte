<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";

  const title = "Nutzungsbedingungen / Terms of Use";
  const description = "Nutzungsbedingungen fuer die AICOYO Website.";
  const lede =
    "Diese Bedingungen regeln die Nutzung der AICOYO Website. Sie bilden einen Website-Rahmen, nicht automatisch einen Kundenvertrag fuer Software- oder Beratungsleistungen.";
</script>

<LegalLayout
  activePath="/terms/"
  eyebrow="Website Terms"
  {title}
  {description}
  {lede}
>
  <section>
    <h2>1. Geltungsbereich</h2>
    <div class="card">
      <p>
        Diese Nutzungsbedingungen gelten fuer die Nutzung der Website
        <strong>aicoyo.com / aicoyo.de / aicoflow.com</strong> sowie
        zugehoeriger Landing- und Informationsseiten, soweit nicht fuer einzelne
        Dienste gesonderte Bedingungen vereinbart werden.
      </p>
    </div>
  </section>

  <section>
    <h2>2. Informationsangebot</h2>
    <div class="card">
      <p>
        Die Inhalte dieser Website dienen der allgemeinen Information ueber
        AICOYO, Produkte, Integrationen, Terminbuchung und Kontaktaufnahme. Die
        Darstellung auf der Website stellt noch kein verbindliches Angebot auf
        Abschluss eines Vertrags dar, sofern nicht ausdruecklich anders
        angegeben.
      </p>
    </div>
  </section>

  <section>
    <h2>3. Terminbuchungen und Anfragen</h2>
    <div class="card">
      <p>
        Ueber das Buchungs-Widget angefragte Termine dienen der Erstabstimmung,
        Produktdemonstration oder Pilotplanung. Ein Vertrag ueber weitergehende
        Leistungen kommt erst durch gesonderte Vereinbarung zustande.
      </p>
      <p>
        Wir behalten uns vor, angefragte Termine aus sachlichen Gruenden zu
        bestaetigen, zu verschieben oder abzulehnen.
      </p>
    </div>
  </section>

  <section>
    <h2>4. Zulaessige Nutzung</h2>
    <div class="card">
      <p>Die Website darf nicht missbraucht werden. Unzulaessig sind insbesondere:</p>
      <ul>
        <li>Stoerung oder Ueberlastung der Infrastruktur</li>
        <li>Automatisierte Zugriffe ohne ausdrueckliche Freigabe</li>
        <li>Einspeisen rechtswidriger, irrefuehrender oder schaedlicher Inhalte</li>
        <li>Umgehung von Sicherheits- oder Zugriffsbeschraenkungen</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>5. Geistiges Eigentum</h2>
    <div class="card">
      <p>
        Texte, Marken, Logos, Visuals, Codebestandteile und sonstige Inhalte der
        Website sind urheber-, marken- oder leistungsschutzrechtlich geschuetzt.
        Eine Nutzung ueber die bestimmungsgemaesse Website-Nutzung hinaus bedarf
        der vorherigen Zustimmung des Rechteinhabers.
      </p>
    </div>
  </section>

  <section>
    <h2>6. Externe Links</h2>
    <div class="card compact">
      <p>
        Die Website kann auf externe Angebote verlinken. Fuer deren Inhalte und
        Verfuegbarkeit sind ausschliesslich die jeweiligen Betreiber
        verantwortlich.
      </p>
    </div>
  </section>

  <section>
    <h2>7. Haftung</h2>
    <div class="card">
      <p>
        Wir haften nach den gesetzlichen Vorschriften bei Vorsatz, grober
        Fahrlaessigkeit sowie bei Verletzung von Leben, Koerper oder Gesundheit.
        Im Uebrigen ist die Haftung, soweit gesetzlich zulaessig, auf typische,
        vorhersehbare Schaeden begrenzt.
      </p>
    </div>
  </section>

  <section>
    <h2>8. Anwendbares Recht</h2>
    <div class="card">
      <p>
        Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts, soweit dem
        keine zwingenden verbraucherschuetzenden Vorschriften entgegenstehen.
      </p>
      <p class="placeholder">
        [Bitte ergaenzen, ob ein Gerichtsstand fuer Unternehmer vereinbart
        werden soll.]
      </p>
    </div>
  </section>

  <section>
    <h2>9. Aenderungen</h2>
    <div class="card compact">
      <p>
        Wir koennen diese Nutzungsbedingungen anpassen, wenn sich die Website,
        angebotene Funktionen oder rechtliche Anforderungen aendern.
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
  ul {
    margin: 0 0 14px;
  }

  ul {
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

  .placeholder {
    color: #fbbf24;
    font-weight: 700;
  }
</style>
