# MVP Backlog

Ziel: Ein lauffähiges, alltagstaugliches Management Dashboard als PWA mit M365-Anbindung.

## Priorisierung

- `P0` = Muss für MVP
- `P1` = Soll für MVP+ (direkt danach)
- `P2` = Kann / später

## P0 — Muss-Tickets (MVP)

### P0-01 Projektgrundgerüst

- **Beschreibung:** Next.js + TypeScript + Tailwind + Basisstruktur aufsetzen.
- **Ergebnis:** Startfähige App mit sauberer Ordnerstruktur.
- **Akzeptanzkriterien:**
  - App startet lokal fehlerfrei.
  - Basislayout mit Header/Content/Footer vorhanden.
  - Grundlegende Routing-Struktur steht.

### P0-02 PWA-Fähigkeit aktivieren

- **Beschreibung:** Manifest, Icons, Installierbarkeit und PWA-Grundverhalten konfigurieren.
- **Ergebnis:** App als installierbare PWA nutzbar.
- **Akzeptanzkriterien:**
  - Installieren auf Windows/macOS möglich.
  - Home-Screen-Start auf iPhone/iPad möglich.
  - App startet im installierten Modus zuverlässig.

### P0-03 M365 Auth (Entra ID)

- **Beschreibung:** Sign-in mit Firmenkonto über OAuth/OIDC integrieren.
- **Ergebnis:** Sicherer Login für M365 APIs.
- **Akzeptanzkriterien:**
  - Login/Logout funktionieren.
  - Session bleibt stabil im Tagesbetrieb.
  - Token-Fehler werden sauber behandelt.

### P0-04 Settings-Dialog (Pflicht)

- **Beschreibung:** Dialog für Kontoverbindung und Basiseinstellungen bauen.
- **Ergebnis:** Nutzer kann M365-Verbindung und Defaults verwalten.
- **Akzeptanzkriterien:**
  - Dialog ist in max. 1 Klick erreichbar.
  - M365-Status sichtbar (`verbunden`, `nicht verbunden`, `Fehler`).
  - Aktionen `verbinden`, `neu verbinden`, `trennen` vorhanden.

### P0-05 Kalender lesen (Outlook)

- **Beschreibung:** Termine für heute + nächste 7 Tage auslesen.
- **Ergebnis:** Startseite zeigt echte Kalenderdaten.
- **Akzeptanzkriterien:**
  - Termine sind chronologisch korrekt.
  - Zeitzone wird korrekt verarbeitet.
  - Leere Zustände sind sauber dargestellt.

### P0-06 Vorbereitungsstatus je Termin

- **Beschreibung:** `offen | in_arbeit | vorbereitet` speichern/lesen (M365-Metadaten).
- **Ergebnis:** Status pro Termin direkt im Dashboard pflegbar.
- **Akzeptanzkriterien:**
  - Statuswechsel in 1–2 Interaktionen möglich.
  - Änderungen bleiben nach Reload erhalten.
  - Fehler beim Speichern werden im UI angezeigt.

### P0-07 Startseite umsetzen

- **Beschreibung:** Fokus-Karte, Heute vorbereiten, Tageskalender, 7-Tage-Vorschau.
- **Ergebnis:** Tagessteuerung auf einer zentralen Seite.
- **Akzeptanzkriterien:**
  - Nächster relevanter Termin prominent sichtbar.
  - Liste „Heute vorbereiten“ priorisiert offene Punkte.
  - Responsive Darstellung auf Desktop und Mobile.

### P0-08 Filter & Schnellaktionen

- **Beschreibung:** Filter „nur offen“, Zeitraum, schnelle Statusaktionen.
- **Ergebnis:** Effiziente tägliche Bedienung.
- **Akzeptanzkriterien:**
  - Filter wirkt ohne Seitenwechsel.
  - Filterzustand bleibt während Session erhalten.
  - Quick-Actions sind mobil gut bedienbar.

### P0-09 Basisqualität & Fehlertoleranz

- **Beschreibung:** Error-States, Loading-States, Empty-States, Basis-Logging.
- **Ergebnis:** Robustes MVP ohne harte UX-Brüche.
- **Akzeptanzkriterien:**
  - API-Fehler führen nicht zu White Screen.
  - Nutzer erhält verständliche Fehlermeldungen.
  - Wiederherstellung (Retry/Neu laden) ist möglich.

### P0-10 PWA-Validierung (Go/No-Go)

- **Beschreibung:** Validierung mit Checkliste durchführen und entscheiden.
- **Ergebnis:** Entscheidung „PWA bleibt" oder „native Ergänzung".
- **Akzeptanzkriterien:**
  - Checkliste vollständig ausgefüllt.
  - Ergebnis dokumentiert (`GO`/`REVIEW`/`NO-GO`).
  - Maßnahmen für offene Punkte festgelegt.

## P1 — Soll-Tickets (MVP+)

### P1-01 Aufgabenintegration

- Microsoft To Do oder Planner als zusätzliche Vorbereitungssicht integrieren.

### P1-02 Notizenkontext

- Verknüpfung von Terminen mit kompakten Vorbereitungsnotizen verbessern.

### P1-03 Personalisierung

- Persistente UI-Preferences (Theme, Defaultfilter, Sortierung).

### P1-04 Benachrichtigungen

- Erinnerungen für offene Vorbereitungen vor Terminen.

## P2 — Später

### P2-01 Analytics

- Auswertung: Vorbereitungsquote, Engpasszeiten, Wochenrückblick.

### P2-02 Delegation / Teammodus

- Vorbereitungspunkte optional an Teammitglieder delegieren.

### P2-03 Provider-Erweiterung

- Zusätzlicher `NextcloudProvider` als optionale Quelle.

## Empfohlene Reihenfolge (Sprint 0 + Sprint 1)

1. P0-01 bis P0-04 (Fundament + Settings)
2. P0-05 bis P0-06 (Daten + Statusmodell)
3. P0-07 bis P0-08 (Kern-UX)
4. P0-09 bis P0-10 (Stabilität + Architekturentscheidung)

## Definition of Done (MVP)

- Alle `P0`-Tickets umgesetzt.
- Kein kritischer blocker in Kernflows.
- PWA-Entscheidung dokumentiert.
- Dokumentation im Repo aktuell.
