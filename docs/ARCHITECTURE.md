# Architekturkonzept

## 1) Zielbild (MVP)

Der aktuelle MVP ist bewusst lokal und unabhängig von externen Kontorechten:

- Eine PWA als Client
- Screenshot als Input
- Lokale OCR-/Parsing-Pipeline im Browser
- Lokale Persistenz im Browser (`localStorage`)

## 2) Systemübersicht

```text
[Browser / PWA]
      |
      v
[Next.js UI]
  - Import UI
  - Analyse-Trigger
  - Ergebnisliste
      |
      v
[Lokale Pipeline]
  - Bildvorverarbeitung (Canvas)
  - OCR (tesseract.js)
  - Termin-Parser (Hybrid)
      |
      v
[localStorage]
  - letzter Screenshot
  - Dateiname
  - erkannte Termine
```

## 3) Pipeline-Logik

1. **Import**: Nutzer lädt Screenshot hoch.
2. **Bestätigung**: Import wird als aktive Datenbasis markiert.
3. **Vorverarbeitung**: Upscaling + Kontrast + Binarisierung.
4. **OCR**: Texterkennung mit `deu+eng`.
5. **Event Parsing (Hybrid)**:
   - Primär: visuelle Segmentierung über blaue vertikale Linien.
   - Fallback: zeitankerbasierte Gruppierung aus OCR-Zeilen.
6. **Output**: strukturierte Terminliste mit Confidence.

## 4) Datenmodell (lokal)

### Event

- `id`
- `title`
- `startTime`
- `endTime` (optional)
- `details: string[]`
- `confidence`

### Persistierte Schlüssel

- `management-dashboard.calendar-screenshot`
- `management-dashboard.calendar-screenshot.name`
- `management-dashboard.calendar-screenshot.events`

## 5) Stärken und Grenzen

### Stärken

- Sofort testbar ohne Admin-/Tenant-Abhängigkeit
- Schnelle Iteration am OCR- und UX-Workflow
- Keine Serverinfrastruktur im MVP nötig

### Grenzen

- Daten nur lokal auf einem Gerät/Browser
- OCR-Qualität abhängig von Screenshot-Qualität
- Noch keine manuelle Korrektur oder serverseitiger Sync

## 6) Weiterentwicklung

- Terminliste editierbar machen (Korrekturmodus)
- Vorbereitungsstatus pro Termin ergänzen
- Optional serverseitige Persistenz für Multi-Device-Sync
