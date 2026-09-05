# MVP Backlog

Ziel: Lokal testbarer PWA-MVP mit Screenshot-zu-Terminliste-Workflow.

## Priorisierung

- `P0` = Muss im aktuellen MVP
- `P1` = Nächster Ausbau

## P0 — Aktueller Scope

### P0-01 PWA-Grundgerüst

- Next.js + TypeScript + Tailwind
- Manifest + Service Worker + Offline-Fallback

### P0-02 Import-Workflow

- Screenshot auswählen
- Dateivalidierung
- Import bestätigen
- Import entfernen

### P0-03 OCR-Pipeline

- Bildvorverarbeitung (Kontrast/Binarisierung)
- OCR via `tesseract.js` (`deu+eng`)
- Confidence-Ermittlung

### P0-04 Termin-Parser

- Zeit-/Range-Erkennung
- Mehrzeilige Titel zusammenführen
- Metadaten von Titeln trennen
- Microsoft-Teams-Rauschtext entfernen

### P0-05 Hybrid-Segmentierung

- Primär über blaue vertikale Linien
- Fallback über Zeitanker

### P0-06 Lokale Persistenz

- Screenshot + Dateiname speichern
- erkannte Termine speichern
- Wiederherstellung nach Reload

## P1 — Nächste Schritte

### P1-01 Korrekturmodus

- erkannte Termine editieren/löschen/zusammenführen

### P1-02 Vorbereitungsstatus

- `offen | in_arbeit | vorbereitet` pro Termin

### P1-03 Export/Sync

- optionaler Export (JSON/CSV)
- optional serverseitige Persistenz

## Definition of Done (MVP)

- Voller lokaler Workflow läuft stabil
- OCR erzeugt eine nutzbare Terminliste
- Daten bleiben nach Reload erhalten
- App läuft auf Desktop und Mobile
