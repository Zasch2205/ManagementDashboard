# Architekturkonzept

## 1) Zielbild

Der MVP nutzt eine zweistufige Datenstrategie:

- **Hauptweg:** automatische/halbautomatische Kalenderübergabe über Nextcloud (`.ics`)
- **Havarieweg:** Screenshot-Import mit lokaler OCR

## 2) Systemübersicht

```text
[Browser / PWA]
      |
      v
[Next.js UI]
  - Sync-Button
  - Terminliste (Test: 7. September)
  - Screenshot-Fallback
      |
      v
[Next.js API Route]
  - Nextcloud WebDAV PROPFIND
  - ICS-Datei laden
  - ICS parsen
      |
      v
[Nextcloud Public Share]
  - calendar.ics
```

## 3) Hauptweg: Nextcloud-Sync

1. UI ruft `GET /api/sync/nextcloud` auf.
2. API liest Share-Verzeichnis via WebDAV (`PROPFIND`).
3. API identifiziert `.ics`-Datei und deren `last modified`.
4. API lädt die `.ics` und parst `VEVENT`-Einträge.
5. UI zeigt `Synchronisationsdatum` + gefilterte Terminliste.

## 4) Havarieweg: Screenshot

Wenn der Nextcloud-Sync fehlschlägt:

- lokaler Screenshot-Import
- lokale OCR-/Parser-Analyse
- Ergebnisliste im Browser

## 5) Datenmodell

### Kalenderereignis

- `id`
- `title`
- `location` (optional)
- `startIso`
- `endIso` (optional)

### Sync-Metadaten

- `sourceFileName`
- `synchronizationDate`
- `events[]`

## 6) Konfiguration

- `NEXTCLOUD_SHARE_URL` (optional)
  - Format: `https://<host>/s/<token>`

## 7) Grenzen im MVP

- Keine serverseitige Datenbank
- Testansicht aktuell auf `7. September` gefiltert
- Noch keine automatische periodische Hintergrund-Synchronisation in der App

## 8) Nächste Schritte

- Tägliche Sync-Strategie (Task/Trigger)
- Editierbare Terminliste
- Persistenz für Multi-Device-Sync
