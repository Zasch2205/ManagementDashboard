# UI-Konzept Startseite

## 1) Ziel

Die Startseite priorisiert den **Nextcloud-Sync** und zeigt direkt nutzbare Termine.

## 2) Reihenfolge auf der Seite

1. Header mit Versionsstand
2. Nextcloud-Sync-Karte (Hauptweg)
3. Testliste „Termine vom 7. September"
4. Havarie-Hinweis
5. Screenshot-Import (Fallback)

## 3) Hauptinteraktion

- `Jetzt synchronisieren`
  - lädt `.ics`
  - aktualisiert `Synchronisationsdatum`
  - zeigt Termine für 7. September

## 4) Sichtbare Sync-Daten

- Quell-Dateiname (`.ics`)
- Synchronisationsdatum
- Anzahl Termine gesamt
- Anzahl Termine am 7. September

## 5) Fehlerfall

Bei Sync-Fehler:

- sichtbare Fehlermeldung
- Nutzer kann in den Screenshot-Havarieweg wechseln

## 6) Akzeptanzkriterien

- Sync-Knopf funktioniert reproduzierbar
- Synchronisationsdatum wird angezeigt
- Termine vom 7. September werden dargestellt
- Havarieweg ist weiter nutzbar
