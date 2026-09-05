# Management Dashboard

Persönliches, plattformübergreifendes Dashboard zur Tagesorganisation als PWA.

## Aktueller Stand

- Version: `0.0.1`
- Build: `1`
- Betriebsmodus: `lokaler MVP`
- Datenbasis: `Kalender-Screenshot`

## MVP-Ziel

Der MVP validiert den Kernworkflow ohne externe Abhängigkeiten:

1. Kalender-Screenshot importieren
2. Import bestätigen
3. Lokale KI/OCR-Analyse starten
4. Erkannte Termine prüfen

## Umgesetzte Funktionen

- Screenshot-Import mit Dateivalidierung
- Bestätigen-Schritt vor Analyse
- Lokale OCR mit `tesseract.js`
- Bildvorverarbeitung (Upscaling, Kontrast, Binarisierung)
- Hybrid-Erkennung:
  - visuelle Segmentierung über blaue Kalenderlinien
  - Fallback über Zeitanker im OCR-Text
- Terminliste mit Start-/Endzeit, Titel, Details und Confidence
- Lokale Persistenz in `localStorage`
- PWA-Basis (Manifest, Service Worker, Offline-Fallback)

## Lokaler Start

- Abhängigkeiten installieren: `npm install`
- Dev-Server starten: `npm run dev`
- App öffnen: `http://localhost:3000`

## Projektstruktur

- App-Einstieg: `app/page.tsx`
- Import + OCR-Workflow: `components/calendar-screenshot-import.tsx`
- Architektur: `docs/ARCHITECTURE.md`
- UI-Konzept: `docs/UI_STARTSEITE.md`
- MVP-Backlog: `docs/MVP_BACKLOG.md`
- PWA-Checkliste: `docs/PWA_VALIDATION_CHECKLIST.md`

## Nächste sinnvolle Schritte

- Manuelle Korrektur erkannter Termine (Edit/Delete/Merge)
- Vorbereitungstatus pro erkanntem Termin
- Optional später: serverseitige Persistenz für Multi-Device-Sync
