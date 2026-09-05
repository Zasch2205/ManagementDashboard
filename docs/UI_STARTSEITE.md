# UI-Konzept Startseite

## 1) UX-Ziel

Die Startseite beantwortet in unter 30 Sekunden:

- Was ist heute wichtig?
- Was muss ich vor dem nächsten Termin vorbereiten?
- Wo kann ich sofort eine Statusänderung machen?

## 2) Informationshierarchie

1. **Fokus jetzt** (nächster relevanter Termin + Vorbereitungsstatus)
2. **Heute vorbereiten** (priorisierte Liste offener Vorbereitungen)
3. **Tageskalender** (chronologische Sicht)
4. **Schnellaktionen** (Status wechseln, Notiz ergänzen, Filter)

## 3) Layout (Desktop)

- **Header (sticky)**
  - Datum, Begrüßung, Suchfeld, Profil/Sync-Status, Settings-Button
- **Hero/Fokus-Karte (volle Breite)**
  - Nächster Termin, Countdown, Status-Chip, Primäraktion
- **2-Spalten-Content**
  - Links: „Heute vorbereiten“ (Task-ähnliche Karten)
  - Rechts: „Kalender heute" + „Nächste 7 Tage"
- **Footer-Toolbar (optional)**
  - Filter, Ansichten, Shortcuts

## 4) Layout (Mobile)

- Header kompakt mit Datum + Avatar.
- Fokus-Karte zuerst.
- Danach vertikal:
  1. Heute vorbereiten
  2. Kalender heute
  3. Nächste 7 Tage
- Sticky Bottom-Navigation:
  - `Home` | `Kalender` | `Vorbereitung` | `Einstellungen`

## 5) Komponentenliste

- `FocusCard`
- `PrepQueueList`
- `CalendarTimeline`
- `WeekPreview`
- `StatusChip` (`offen`, `in_arbeit`, `vorbereitet`)
- `QuickActionsBar`
- `FilterBar`
- `SettingsDialog`
- `AccountConnectionCard`

## 6) Interaktionsmuster

- Status per One-Tap ändern (Chip/Segmented Control).
- Karte aufklappen für `prep_notes`.
- Swipe auf Mobile:
  - rechts = `vorbereitet`
  - links = `in_arbeit`
- Filter sofort wirksam ohne Seitenwechsel.
- Einstellungen über modalen Dialog ohne Seitenwechsel erreichbar.

## 6.1) Settings-Dialog (MVP Pflicht)

Bereiche im Dialog:

- **M365 Account**
  - Verbindungsstatus (`verbunden` / `nicht verbunden` / `Fehler`)
  - Button `M365 verbinden`
  - Button `Neu verbinden`
  - Button `Verbindung trennen`
- **Kalender-Defaults**
  - Standardkalender wählen
  - Ansicht standardmäßig auf „nur offen“
- **Darstellung**
  - Theme: `System`, `Hell`, `Dunkel`

UX-Regeln:

- Account-Verbindungsstatus ist im Header sichtbar.
- Bei `nicht verbunden` zeigt die Startseite eine prominente CTA zum Verbinden.
- Nach erfolgreicher Verbindung wird die Startseite automatisch neu geladen.

## 7) Visueller Stil

- Klar, ruhig, professionell (Business-Produktivität).
- Light/Dark Mode.
- Hoher Kontrast für Statusfarben.
- Viel Weißraum, klare Typohierarchie.

Farblogik (Beispiel):

- `offen` = Amber
- `in_arbeit` = Blue
- `vorbereitet` = Green

## 8) ASCII-Wireframe (Desktop)

```text
+--------------------------------------------------------------------------------+
| Management Dashboard      Heute, Mo 07.09.2026        [Suche]       [Profil] |
+--------------------------------------------------------------------------------+
| FOKUS JETZT                                                                  |
| 09:30 Kunde ABC - Weekly Sync      in 42 Min      [offen]   [Jetzt vorbereiten] |
+--------------------------------------------+-----------------------------------+
| HEUTE VORBEREITEN                          | KALENDER HEUTE                    |
| [ ] Angebot Q4 besprechen   [offen]        | 09:30 Kunde ABC                   |
| [ ] Team-Retrospektive      [in_arbeit]    | 11:00 Internes Review             |
| [x] Steering vorbereitet    [vorbereitet]  | 15:00 One-on-One                  |
+--------------------------------------------+-----------------------------------+
| NÄCHSTE 7 TAGE                                                               |
| Di: 4 Termine (2 offen)   Mi: 3 Termine (1 offen)   Do: 5 Termine (3 offen)   |
+--------------------------------------------------------------------------------+
```

## 9) Akzeptanzkriterien für die Startseite (MVP)

- Nächster Termin + Status ist direkt sichtbar.
- Offene Vorbereitungen sind mit max. 1 Klick bearbeitbar.
- Ansicht ist auf Smartphone ohne horizontales Scrollen nutzbar.
- Ladezeit für initiale Startseite < 2 Sekunden bei normalem Firmennetz.
- Settings-Dialog ist in maximal 1 Klick aus der Startseite erreichbar.
- M365-Account kann im Settings-Dialog verbunden und getrennt werden.

## 10) UX-Validierung der PWA

Die Startseite dient auch als Nachweis, dass PWA im Alltag ausreicht.

- Auf iPhone und iPad ist die Home-Ansicht ohne Funktionsverlust nutzbar.
- Auf Windows- und macOS-Browser bleibt die Interaktion gleich schnell.
- Touch-Interaktionen (Tap/Swipe) funktionieren zuverlässig.
- Der Unterschied zwischen Browser-Nutzung und installierter PWA ist für Kernflows minimal.
