# Management Dashboard

Persönliches, plattformübergreifendes Dashboard zur Tagesorganisation als PWA.

## Aktueller Stand

- Version: `0.0.1`
- Build: `1`
- Hauptweg: `Nextcloud ICS-Synchronisation`
- Havarieweg: `Screenshot-Import + lokale OCR`

## Aktueller Workflow

1. `Jetzt synchronisieren` lädt die `.ics` aus dem geteilten Nextcloud-Ordner.
2. Die App zeigt das `Synchronisationsdatum` (aus Dateimetadaten).
3. Für den Test werden Termine vom `7. September` dargestellt.
4. Falls der Sync fehlschlägt, kann der Screenshot-Havarieweg genutzt werden.

## Features im MVP

- Nextcloud-Sync über Public-Share/WebDAV (serverseitig in Next.js)
- ICS-Parsing (`VEVENT`, Zeit, Titel, Ort)
- Testfilter auf Termine am 7. September
- Synchronisationsmetadaten in der UI
- Screenshot-Import als Fallback
- PWA-Basis (Manifest, Service Worker, Offline-Fallback)

## Lokaler Start

- Abhängigkeiten installieren: `npm install`
- Dev-Server starten: `npm run dev`
- App öffnen: `http://localhost:3000`

## Konfiguration

Optional kann der Nextcloud-Share per Environment gesetzt werden:

- `NEXTCLOUD_SHARE_URL=https://.../s/<token>`

Wenn nicht gesetzt, nutzt die App den aktuell hinterlegten Share-Link.

## Wichtige Dateien

- Startseite: `app/page.tsx`
- Nextcloud-Sync API: `app/api/sync/nextcloud/route.ts`
- Sync-UI: `components/sync/nextcloud-calendar-sync.tsx`
- Screenshot-Havarieweg: `components/calendar-screenshot-import.tsx`
- Architektur: `docs/ARCHITECTURE.md`
