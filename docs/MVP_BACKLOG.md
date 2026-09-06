# MVP Backlog

Ziel: Stabiler Nextcloud-ICS-Workflow mit Screenshot-Fallback.

## P0 — Muss

### P0-01 Nextcloud-Sync (Hauptweg)

- API-Route für WebDAV Share-Zugriff
- `.ics`-Datei finden und laden
- Terminobjekte aus `VEVENT` parsen

### P0-02 Sync-UI

- `Jetzt synchronisieren`-Button
- Anzeige von Quell-Datei und Synchronisationsdatum
- Anzeige der Terminmengen

### P0-03 Testdarstellung

- Termine vom 7. September anzeigen
- Zeit + Titel + Ort darstellen

### P0-04 Havarieweg erhalten

- Screenshot-Import bleibt funktionsfähig
- OCR-Liste weiterhin nutzbar

### P0-05 Qualität

- Lint/Build fehlerfrei
- klare Fehlerzustände im Sync

## P1 — Danach

### P1-01 Regelmäßiger Sync

- täglicher Sync-Prozess definieren (extern getriggert)

### P1-02 Editierbare Termine

- manuelle Korrektur in der Liste

### P1-03 Persistenz

- serverseitige Speicherung für Multi-Device

## Definition of Done

- Hauptweg lädt `.ics` erfolgreich
- Synchronisationsdatum wird angezeigt
- 7.-September-Testliste ist sichtbar
- Havarieweg ist intakt
