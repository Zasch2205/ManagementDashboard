# Management Dashboard

Persönliches, plattformübergreifendes Dashboard zur Tagesorganisation mit zentraler Datenbasis in Microsoft 365.

## Aktueller Stand

- Version: `0.0.1`
- Build: `1`

## Ziel

Das Dashboard beantwortet jeden Morgen in wenigen Sekunden:

- Welche Termine habe ich heute und diese Woche?
- Welche Termine sind noch nicht vorbereitet?
- Was ist jetzt der wichtigste nächste Schritt?

## Produktvision

- Eine moderne, schnelle Web-App als installierbare PWA.
- Ein Datenmodell mit Vorbereitungsstatus pro Termin.
- Eine fokussierte Startseite für den täglichen Arbeitsablauf.
- Keine doppelte Datenhaltung außerhalb von M365 im MVP.

## Kernfunktionen (MVP)

- Kalenderansicht (Heute, morgen, nächste 7 Tage) aus Outlook.
- Vorbereitungsstatus pro Termin (`offen`, `in_arbeit`, `vorbereitet`).
- Priorisierte Liste „Heute vorbereiten".
- Schnelles Umschalten des Status direkt im Dashboard.
- Settings-Dialog zum Hinterlegen und Verwalten des M365-Accounts.
- Kontextfelder pro Termin:
  - `prep_due_at` (bis wann vorbereiten)
  - `prep_notes` (Stichworte)

## Technische Leitentscheidung

- Frontend: Next.js (App Router) + TypeScript + Tailwind.
- Authentifizierung: Microsoft Entra ID (OIDC/OAuth).
- APIs: Microsoft Graph (Kalender, optionale Aufgabenintegration).
- Speicherung des Vorbereitungsstatus: M365 Event Extensions (keine eigene DB im MVP).

Hinweis zur Entscheidung:

- PWA ist für den MVP bewusst als pragmatische Lösung gesetzt.
- Die Eignung wird im MVP mit messbaren Kriterien validiert (Performance, UX, Plattformverhalten).
- Nach dem MVP folgt ein Go/No-Go für „PWA bleibt" oder „native Ergänzung erforderlich".

Details: `docs/ARCHITECTURE.md`

## Startseiten-UI

Die Startseite ist auf tägliche Nutzung optimiert:

- Oben: Tageskontext und Fokus.
- Mitte: Termine + Vorbereitung.
- Unten/mobil: schnelle Aktionen.

Details inkl. Wireframe: `docs/UI_STARTSEITE.md`

## Geplanter MVP-Scope (Phase 1)

- Login mit Firmenkonto.
- Settings-Dialog mit Account-Bereich (`verbunden`, `trennen`, `neu verbinden`).
- Lesen der Termine aus dem Hauptkalender.
- Anzeigen und Ändern von Vorbereitungsstatus.
- Filter „nur offen" und „nächste 7 Tage".
- Mobile-optimierte Darstellung.

## Lokaler Entwicklungsstart

- Abhängigkeiten installieren: `npm install`
- Umgebungsvariablen vorbereiten: `.env.example` nach `.env.local` kopieren
- Dev-Server starten: `npm run dev`

### M365 Auth-Konfiguration (P0-03)

Für den Login mit Microsoft Entra ID müssen diese Werte in `.env.local` gesetzt sein:

- `AUTH_SECRET`
- `AUTH_MICROSOFT_ENTRA_ID_ID`
- `AUTH_MICROSOFT_ENTRA_ID_SECRET`
- `AUTH_MICROSOFT_ENTRA_ID_ISSUER`

In der Entra-App-Registrierung sollte als Redirect URI mindestens eingetragen sein:

- `http://localhost:3000/api/auth/callback/microsoft-entra-id`

## Ausbaustufen

- Integration von Microsoft To Do / Planner.
- KI-Hinweise für Vorbereitungsaufgaben pro Termin.
- Team-/Delegationssicht (falls relevant).
- Optionaler Analytics-/Cache-Layer mit eigener Datenbank.
