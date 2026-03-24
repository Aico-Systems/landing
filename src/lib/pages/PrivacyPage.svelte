<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";

  const title = "Datenschutzerklaerung / Privacy Notice";
  const description = "Datenschutzerklaerung fuer die AICOYO Website.";
  const lede =
    "Diese Datenschutzerklaerung ist auf die aktuell sichtbare Landing Page und die eingebundenen Interaktionsflaechen abgestimmt. Die deutsche Fassung ist die massgebliche Arbeitsversion; fuer einen Live-Betrieb muessen die gekennzeichneten Unternehmens- und Dienstleisterangaben noch vervollstaendigt werden.";
</script>

<LegalLayout
  activePath="/privacy/"
  eyebrow="Datenschutz"
  {title}
  {description}
  {lede}
>
  <div class="notice warning">
    Bitte vor Veroeffentlichung ergaenzen: verantwortliche Stelle,
    Auftragsverarbeiter, Speicherfristen, Drittlandtransfers und konkrete
    Kalender-/Kommunikationsdienste, falls diese in Produktion eingesetzt
    werden.
  </div>

  <section>
    <h2>1. Verantwortlicher</h2>
    <div class="card">
      <p>Verantwortlich fuer die Datenverarbeitung auf dieser Website ist:</p>
      <p class="placeholder">
        [Rechtlicher Unternehmensname, Anschrift, vertretungsberechtigte Person]
      </p>
      <p>Kontakt fuer Datenschutzanfragen: <strong>nikita@aicoflow.com</strong></p>
      <p class="placeholder">[Falls vorhanden: Datenschutzbeauftragter mit Kontaktdaten]</p>
    </div>
  </section>

  <section>
    <h2>2. Datenverarbeitung beim Besuch der Website</h2>
    <div class="card">
      <p>
        Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch
        erforderliche Verbindungsdaten, etwa IP-Adresse, Datum und Uhrzeit des
        Abrufs, angeforderte URL, Referrer, Browser-Informationen sowie
        Fehlermeldungen.
      </p>
      <p>
        Die Verarbeitung dient dem sicheren Betrieb, der Auslieferung der
        Website und der Missbrauchserkennung. Rechtsgrundlage ist Art. 6 Abs. 1
        lit. f DSGVO.
      </p>
      <p class="placeholder">
        [Bitte Hosting-Anbieter und typische Log-Speicherdauer ergaenzen.]
      </p>
    </div>
  </section>

  <section>
    <h2>3. Lokale Speicherungen auf dem Geraet</h2>
    <div class="card">
      <p>
        Die Website speichert aktuell lokale Praeferenzen im Browser, damit die
        Bedienung konsistent bleibt. Dazu gehoeren insbesondere Sprachwahl und
        Theme-Praeferenz.
      </p>
      <p>
        Diese Informationen werden lokal im Browser gespeichert und dienen
        ausschliesslich der Darstellung und Bedienbarkeit der Website.
      </p>
    </div>
  </section>

  <section>
    <h2>4. Demo-Anruf auf der Startseite</h2>
    <div class="card">
      <p>
        Wenn du die Demo-Anruf-Funktion nutzt, verarbeiten wir die von dir
        eingegebene Telefonnummer, um einen Anrufversuch fuer die Demo zu
        starten. Zusaetzlich koennen technische Metadaten wie Zeitpunkt,
        Antwortstatus und Fehlermeldungen verarbeitet werden.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bzw. Art. 6 Abs. 1 lit.
        a DSGVO, soweit du die Funktion aktiv ausloest.
      </p>
      <p class="placeholder">
        [Bitte ergaenzen: welcher Telefonie-/Voice-Dienstleister in Produktion
        eingesetzt wird und wie lange entsprechende Daten gespeichert werden.]
      </p>
    </div>
  </section>

  <section>
    <h2>5. Buchungs-Widget und Terminvereinbarung</h2>
    <div class="card">
      <p>
        Auf der Landing Page ist ein Buchungs-Widget eingebunden. Bei der
        Terminvereinbarung koennen insbesondere folgende Daten verarbeitet
        werden:
      </p>
      <ul>
        <li>ausgewaehlter Termin und Zeitfenster</li>
        <li>Name</li>
        <li>E-Mail-Adresse</li>
        <li>Telefonnummer (falls abgefragt)</li>
        <li>freiwillige Notizen oder Zusatzinformationen</li>
      </ul>
      <p>
        Die Verarbeitung erfolgt zur Organisation und Durchfuehrung der
        angefragten Working Session sowie zur anschliessenden Kommunikation.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
      </p>
      <p class="placeholder">
        [Bitte ergaenzen: eingesetzte Kalender-, Meeting- oder CRM-Dienste,
        Speicherfristen und etwaige Auftragsverarbeiter.]
      </p>
    </div>
  </section>

  <section>
    <h2>6. Tracking, Cookies und Analytik</h2>
    <div class="card">
      <p>
        Nach aktueller technischer Umsetzung dieser Landing Page setzen wir
        keine gesonderten Marketing- oder Web-Analytics-Tools ein, sofern dies
        nicht spaeter ausdruecklich in dieser Datenschutzerklaerung ergaenzt
        wird.
      </p>
      <p>
        Soweit ausschliesslich lokale Praeferenzspeicherungen fuer Sprache oder
        Theme verwendet werden, dienen diese der Bedienbarkeit der Website und
        nicht der Profilbildung.
      </p>
    </div>
  </section>

  <section>
    <h2>7. Empfaenger und Drittlandtransfers</h2>
    <div class="card">
      <p>
        Personenbezogene Daten koennen an technische Dienstleister weitergegeben
        werden, soweit dies fuer Hosting, Terminbuchung, Kommunikation oder den
        Betrieb der Demo-Funktionen erforderlich ist.
      </p>
      <p class="placeholder">
        [Bitte konkrete Empfaenger, Auftragsverarbeiter, Sitzstaaten und
        Schutzmechanismen bei Drittlandtransfers ergaenzen.]
      </p>
    </div>
  </section>

  <section>
    <h2>8. Speicherdauer</h2>
    <div class="card">
      <p>
        Wir speichern personenbezogene Daten nur so lange, wie dies fuer die
        jeweiligen Zwecke erforderlich ist oder gesetzliche
        Aufbewahrungspflichten bestehen.
      </p>
      <p class="placeholder">
        [Bitte konkrete Fristen fuer Logdaten, Demo-Anrufe, Terminbuchungen und
        Kontaktkommunikation festlegen.]
      </p>
    </div>
  </section>

  <section>
    <h2>9. Deine Rechte</h2>
    <div class="card">
      <p>Dir stehen nach der DSGVO insbesondere folgende Rechte zu:</p>
      <ul>
        <li>Auskunft (Art. 15 DSGVO)</li>
        <li>Berichtigung (Art. 16 DSGVO)</li>
        <li>Loeschung (Art. 17 DSGVO)</li>
        <li>Einschraenkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenuebertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO)</li>
        <li>Beschwerde bei einer Datenschutzaufsichtsbehoerde</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>10. Aktualisierungen</h2>
    <div class="card compact">
      <p>
        Wir ueberarbeiten diese Datenschutzerklaerung, wenn sich unsere
        Website, unsere Prozesse oder die eingesetzten Dienstleister wesentlich
        aendern.
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

  .placeholder {
    color: #fbbf24;
    font-weight: 700;
  }
</style>
