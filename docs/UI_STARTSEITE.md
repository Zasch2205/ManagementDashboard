# UI-Konzept Startseite

## 1) UX-Ziel

Die Startseite führt den Nutzer durch einen klaren lokalen Workflow:

- Screenshot importieren
- Import bestätigen
- KI-Analyse starten
- erkannte Termine prüfen

## 2) Informationshierarchie

1. **Projektstatus** (Version, Modus)
2. **Import-Karte** (Buttons + Status)
3. **Screenshot-Vorschau**
4. **Ergebnisliste** (erkannte Termine)

## 3) Komponenten

- `CalendarScreenshotImport`
- `ImportStatus`
- `PreviewPanel`
- `DetectedEventsList`

## 4) Interaktionen

- `Screenshot importieren` öffnet Dateiauswahl.
- `Import bestätigen` aktiviert den aktuellen Screenshot.
- `Mit KI analysieren` startet OCR + Parsing.
- `Import entfernen` löscht den lokalen Stand.

## 5) Ergebnisdarstellung

Jeder erkannte Termin zeigt:

- Startzeit und optional Endzeit
- Titel
- optionale Details (z. B. Ort/Metadaten)
- Confidence

Zusätzlich zeigt die Seite:

- OCR-Gesamtqualität
- Anzahl visueller Segmente aus blauen Linien

## 6) Akzeptanzkriterien (MVP)

- Import in 1–2 Interaktionen
- Analyse erst nach Bestätigung möglich
- Terminliste nach Analyse sichtbar
- Daten bleiben nach Reload erhalten
- Import kann jederzeit entfernt werden
