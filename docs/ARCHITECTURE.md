# Architekturkonzept

## 1) Architekturziele

- Plattformübergreifende Nutzung auf Windows, Mac, iPhone, iPad.
- Zentrale Datenbasis in M365 ohne redundante Primärdatenhaltung.
- Klare Trennung von UI, Business-Logik und Provider-Integration.
- Erweiterbarkeit (weitere Datenquellen später möglich).

## 1.1) Architekturannahme für MVP

- Die PWA-Architektur ist eine Hypothese, die im MVP validiert wird.
- Ziel ist, mit einer Codebasis alle Zielgeräte ausreichend gut zu bedienen.
- Falls die Validierung fehlschlägt, bleibt die Domänenlogik bestehen und nur der Client-Ansatz wird angepasst.

## 2) Zielarchitektur (MVP)

```text
[Browser / PWA]
      |
      v
[Next.js App]
  - UI Layer
  - Domain Layer (Planungslogik)
  - Data Provider Layer
      |
      v
[Microsoft Graph API]
  - Calendar Events
  - Event Extensions (prep status)
```

## 3) Komponenten

- `UI Layer`
  - React-Komponenten, responsive Layouts, Statusaktionen.
- `Domain Layer`
  - Regeln wie Priorisierung, "Heute vorbereiten", Fristenlogik.
- `Provider Layer`
  - M365-Adapter für Lesen/Schreiben von Terminen und Metadaten.
- `Auth Layer`
  - Entra ID Login, Token-Handling, Session-Schutz.
- `Settings Layer`
  - Einstellungen für Account-Verknüpfung, Anzeigeoptionen und Filter-Defaults.

## 4) Datenmodell (fachlich)

### Termin

- `event_id` (aus Outlook/Graph)
- `title`
- `start_at`
- `end_at`
- `attendees`
- `location`

### Vorbereitung (pro Termin)

- `prep_status`: `offen | in_arbeit | vorbereitet`
- `prep_due_at`: optional
- `prep_notes`: optional
- `updated_at`

### Benutzereinstellungen

- `account_connection_status`: `connected | disconnected | error`
- `default_calendar_id`: optional
- `default_filters`: optional (z. B. nur offene Vorbereitung)
- `theme`: `system | light | dark`

## 5) Speicherstrategie (ohne eigene DB)

MVP-Entscheidung:

- Vorbereitungsdaten werden als Event-Metadaten in M365 gespeichert.
- Variante A (einfach): Outlook-Kategorien für Status.
- Variante B (empfohlen): Graph Event Extensions für strukturierte Felder.

Vorteile:

- Keine zusätzliche Infrastruktur im MVP.
- Daten sind zentral, geräteübergreifend und nah an den Terminen.

Grenzen:

- Komplexe Auswertungen/Historien sind eingeschränkt.
- Für Analytics/Teamfeatures später ggf. zusätzliche DB.

## 6) Sicherheits- und Compliance-Bausteine

- Authentifizierung ausschließlich via Firmen-SSO.
- Nur minimal notwendige Graph-Berechtigungen.
- Kein Export sensibler Daten in Fremdsysteme im MVP.
- Optional: Audit-Logging für Statusänderungen.

## 7) Settings-Dialog (Pflichtfunktion)

Der Settings-Dialog ist ein fester Bestandteil des MVP.

- Bereich `M365 Account`
  - aktueller Verbindungsstatus
  - Aktion `verbinden/neu verbinden`
  - Aktion `trennen`
- Bereich `Kalender`
  - Auswahl Standardkalender
  - Option „nur Termine mit Teilnahme = zugesagt"
- Bereich `Darstellung`
  - Theme-Wahl und Startseiten-Defaultfilter

Technisch:

- Verbindung über Entra ID OAuth-Flow.
- Session/Refresh-Handling serverseitig abgesichert.
- Einstellungen im MVP ohne eigene Datenbank: entweder als M365-gebundene Preferences oder als lokale Geräte-Defaults; finale Entscheidung im Implementierungsstart.

## 8) Technologievorschlag

- Frontend/Backend: Next.js + TypeScript
- UI: Tailwind CSS + komponentenbasierte UI-Library
- API-Integration: Microsoft Graph SDK / REST
- Deployment: z. B. Azure Static Web Apps oder Vercel (abhängig von IT-Richtlinien)

## 9) Erweiterbarkeit

Das Provider-Prinzip erlaubt später zusätzliche Quellen:

- `M365Provider` (MVP)
- `NextcloudProvider` (optional später)

Schnittstelle (Beispiel):

```ts
interface CalendarProvider {
  listEvents(range: { from: string; to: string }): Promise<Event[]>;
  updatePrepState(eventId: string, prep: PrepState): Promise<void>;
}
```

## 10) Umsetzungsreihenfolge

1. Projekt-Setup (Next.js, Auth-Gerüst, Basislayout)
2. Settings-Dialog (Account verbinden/trennen, Defaults)
3. M365 Login + Terminauslese
4. Prep-Status lesen/schreiben
5. Startseitenlogik (Heute, offen, priorisiert)
6. Mobile UX und PWA-Finishing
7. PWA-Eignung messen und Architekturentscheidung bestätigen

## 11) PWA-Validierungskriterien (Go/No-Go)

Die PWA gilt als ausreichend, wenn folgende Punkte im MVP erfüllt sind:

- **Performance**: Startseite lädt in < 2s (Firmennetz, wiederholter Aufruf).
- **Responsiveness**: Bedienung auf iPhone/iPad ohne Layout-Brüche und ohne horizontales Scrollen.
- **Installierbarkeit**: App lässt sich auf iOS, iPadOS, macOS und Windows sinnvoll als App starten.
- **Alltags-UX**: Statusänderung pro Termin in max. 1–2 Interaktionen.
- **Stabilität**: Keine blocker-kritischen Session- oder Refresh-Probleme im Tagesbetrieb.

Wenn 2 oder mehr Kriterien nicht erfüllt sind:

- Entscheidungspfad starten für native Ergänzung (z. B. mobile Shell oder gezielte Native-App).
