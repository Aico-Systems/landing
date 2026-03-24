<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";

  const title = "Impressum / Legal Notice";
  const description = "Impressum und Anbieterkennzeichnung fuer AICOYO.";
  const lede =
    "Diese Seite ist als sauber strukturierter Entwurf fuer die Anbieterkennzeichnung aufgebaut. Alle markierten Platzhalter muessen vor dem Live-Gang durch eure tatsaechlichen Unternehmensdaten ersetzt werden.";
</script>

<LegalLayout
  activePath="/imprint/"
  eyebrow="Pflichtangaben"
  {title}
  {description}
  {lede}
>
  <div class="notice warning">
    Achtung: Dieser Entwurf ist keine Rechtsberatung. Fuer die Veroeffentlichung
    braucht ihr insbesondere eine vollstaendige ladungsfaehige Anschrift,
    Vertretungsangaben und gegebenenfalls Register- und USt.-Daten.
  </div>

  <section>
    <h2>1. Anbieter gemaess § 5 DDG</h2>
    <div class="card">
      <div class="meta-list">
        <div>
          <span class="meta-label">Rechtlicher Anbieter</span>
          <strong class="placeholder">[Rechtlicher Unternehmensname]</strong>
        </div>
        <div>
          <span class="meta-label">Marke / Produkt</span>
          <strong>AICOYO / AICO Flow</strong>
        </div>
        <div>
          <span class="meta-label">Rechtsform</span>
          <strong class="placeholder">[z. B. GmbH / UG / Einzelunternehmen]</strong>
        </div>
        <div>
          <span class="meta-label">Vertreten durch</span>
          <strong class="placeholder">[Geschaeftsfuehrer / Inhaber / Vorstand]</strong>
        </div>
        <div>
          <span class="meta-label">Anschrift</span>
          <strong class="placeholder">[Strasse Hausnummer, PLZ Ort, Deutschland]</strong>
        </div>
        <div>
          <span class="meta-label">Kontakt</span>
          <strong>nikita@aicoflow.com</strong>
          <span class="muted placeholder">[Telefonnummer ergaenzen]</span>
        </div>
      </div>
    </div>
  </section>

  <section>
    <h2>2. Registerangaben und Steuerdaten</h2>
    <div class="legal-grid">
      <div class="card compact">
        <span class="meta-label">Registereintrag (falls vorhanden)</span>
        <p class="placeholder">
          [Registergericht, Registernummer, Handelsregister / Vereinsregister /
          Partnerschaftsregister]
        </p>
      </div>
      <div class="card compact">
        <span class="meta-label">Umsatzsteuer-ID (falls vorhanden)</span>
        <p class="placeholder">[USt-IdNr. gemaess § 27a UStG]</p>
      </div>
    </div>
  </section>

  <section>
    <h2>3. Verantwortlich fuer journalistisch-redaktionelle Inhalte</h2>
    <div class="card compact">
      <p>
        Verantwortlich im Sinne von § 18 Abs. 2 MStV:
        <span class="placeholder">[Name, Anschrift]</span>
      </p>
    </div>
  </section>

  <section>
    <h2>4. Aufsichtsbehoerde / berufsrechtliche Angaben</h2>
    <div class="card compact">
      <p class="placeholder">
        [Nur falls einschlaegig: zustaendige Aufsichtsbehoerde, Kammer,
        Berufsbezeichnung, berufsrechtliche Regelungen]
      </p>
    </div>
  </section>

  <section>
    <h2>5. Verbraucherstreitbeilegung</h2>
    <div class="card">
      <p>
        Hinweis gemaess § 36 VSBG:
        <span class="placeholder">
          [Bitte festlegen, ob ihr bereit oder verpflichtet seid, an einem
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.]
        </span>
      </p>
      <p>
        Die fruehere EU-ODR-Plattform wurde zum 20. Juli 2025 eingestellt.
        Aktuelle Informationen stellt die Europaeische Kommission ueber
        <a href="https://consumer-redress.ec.europa.eu/" target="_blank" rel="noreferrer">
          Consumer Redress in the EU
        </a>
        bereit.
      </p>
    </div>
  </section>

  <section>
    <h2>6. Haftung und Urheberrecht</h2>
    <div class="card">
      <p>
        Die Inhalte dieser Website werden mit angemessener Sorgfalt erstellt.
        Eine Gewaehr fuer Aktualitaet, Vollstaendigkeit und Richtigkeit wird
        jedoch nur im Rahmen zwingender gesetzlicher Vorschriften uebernommen.
      </p>
      <p>
        Fuer Inhalte externer Links sind ausschliesslich deren Betreiber
        verantwortlich. Bei Bekanntwerden konkreter Rechtsverletzungen werden
        entsprechende Verlinkungen unverzueglich entfernt.
      </p>
      <p>
        Die auf dieser Website veroeffentlichten Inhalte, Texte, Marken,
        Grafiken und sonstigen Werke unterliegen dem anwendbaren Urheber-,
        Marken- und Leistungsschutzrecht, soweit nicht anders gekennzeichnet.
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

  p {
    margin: 0 0 14px;
  }

  .notice,
  .card {
    border-radius: 18px;
    border: 1px solid rgba(86, 141, 171, 0.2);
    background: rgba(15, 23, 42, 0.82);
    box-shadow: 0 28px 90px rgba(2, 8, 23, 0.32);
  }

  .notice {
    padding: 18px 20px;
    margin: 0 0 28px;
  }

  .notice.warning {
    border-color: rgba(234, 179, 8, 0.32);
    background: rgba(234, 179, 8, 0.12);
    color: #fde68a;
    box-shadow: none;
  }

  .card {
    padding: 24px;
    margin: 0 0 22px;
  }

  .card.compact {
    padding: 18px 20px;
  }

  .legal-grid {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .meta-list {
    display: grid;
    gap: 10px;
  }

  .meta-list div {
    display: grid;
    gap: 4px;
  }

  .meta-label {
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .placeholder {
    color: #fbbf24;
    font-weight: 700;
  }

  .muted {
    color: var(--text-secondary);
  }

  @media (max-width: 860px) {
    .legal-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
