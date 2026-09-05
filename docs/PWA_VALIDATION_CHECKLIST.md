# PWA Validation Checklist (MVP)

Ziel: Validieren, ob der lokale Screenshot-OCR-Workflow auf allen Zielgeräten praktikabel ist.

## 1) Testkontext

- Testdatum:
- Tester:
- Version/Build:
- Browser:
- Netzwerkprofil:

## 2) Zielgeräte

- Windows (Browser + installierte PWA)
- macOS (Browser + installierte PWA)
- iPhone (Safari + Home-Screen App)
- iPad (Safari + Home-Screen App)

## 3) Bewertungslogik

- `PASS` = erfüllt
- `PARTIAL` = teilweise erfüllt
- `FAIL` = nicht erfüllt

## 4) Prüfpunkte

### 4.1 Performance

- [ ] Startseite lädt in < 2 Sekunden → `PASS/PARTIAL/FAIL`
- [ ] Analyse startet ohne spürbare UI-Hänger → `PASS/PARTIAL/FAIL`

### 4.2 Responsiveness

- [ ] Keine Layout-Brüche auf iPhone/iPad → `PASS/PARTIAL/FAIL`
- [ ] Kein horizontales Scrollen in Kernflows → `PASS/PARTIAL/FAIL`

### 4.3 Installierbarkeit

- [ ] Als PWA auf Windows/macOS installierbar → `PASS/PARTIAL/FAIL`
- [ ] Als Home-Screen-App auf iPhone/iPad nutzbar → `PASS/PARTIAL/FAIL`

### 4.4 Workflow

- [ ] Import → Bestätigen → Analysieren funktioniert durchgängig → `PASS/PARTIAL/FAIL`
- [ ] Terminliste ist nach Analyse sichtbar und plausibel → `PASS/PARTIAL/FAIL`
- [ ] Daten bleiben nach Reload erhalten → `PASS/PARTIAL/FAIL`

### 4.5 Stabilität

- [ ] Keine Runtime-Fehler im Standardflow → `PASS/PARTIAL/FAIL`
- [ ] Import entfernen setzt Zustand sauber zurück → `PASS/PARTIAL/FAIL`

## 5) Ergebnis

- Entscheidung: `GO` | `REVIEW` | `NO-GO`
- Begründung:
- Offene Punkte:
- Nächste Maßnahmen:
