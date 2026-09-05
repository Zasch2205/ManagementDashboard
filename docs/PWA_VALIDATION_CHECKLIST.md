# PWA Validation Checklist (MVP)

Ziel: Objektiv prüfen, ob die PWA-Umsetzung für den Alltag ausreicht.

## 1) Testkontext

- Testdatum:
- Tester:
- Build/Version:
- Netzwerkprofil (z. B. Firmennetz, VPN, mobil):

## 2) Testgeräte

- Windows Arbeitsrechner (Browser + installierte PWA)
- Privater Mac (Browser + installierte PWA)
- iPhone (Safari + Home-Screen App)
- iPad (Safari + Home-Screen App)

## 3) Go/No-Go Kriterien

Bewertung je Kriterium:

- `PASS` = erfüllt
- `PARTIAL` = teilweise erfüllt
- `FAIL` = nicht erfüllt

### 3.1 Performance

- [ ] Startseite lädt in < 2 Sekunden (wiederholter Aufruf, Firmennetz) → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] Sichtbarer First Content ist schnell da (subjektiv "sofort nutzbar") → Ergebnis: `PASS/PARTIAL/FAIL`

Messwerte notieren:

- Desktop Ladezeit:
- iPhone Ladezeit:
- iPad Ladezeit:

### 3.2 Responsiveness

- [ ] Keine Layout-Brüche auf iPhone (Portrait) → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] Keine Layout-Brüche auf iPad (Portrait/Landscape) → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] Kein horizontales Scrollen in Kernansichten → Ergebnis: `PASS/PARTIAL/FAIL`

### 3.3 Installierbarkeit

- [ ] App lässt sich unter Windows als PWA installieren und starten → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] App lässt sich auf iPhone/iPad zum Home-Screen hinzufügen und starten → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] App verhält sich im installierten Modus stabil (mehrfaches Öffnen/Schließen) → Ergebnis: `PASS/PARTIAL/FAIL`

### 3.4 Alltags-UX

- [ ] Vorbereitungsstatus pro Termin in max. 1–2 Interaktionen änderbar → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] Settings-Dialog in max. 1 Klick von der Startseite erreichbar → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] M365 Account verbinden/trennen im Settings-Dialog funktioniert → Ergebnis: `PASS/PARTIAL/FAIL`

### 3.5 Stabilität (Session/Auth)

- [ ] Keine kritischen Login-/Token-Fehler im Tagesbetrieb → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] Session bleibt bei normaler Nutzung stabil (keine unerwarteten Abmeldungen) → Ergebnis: `PASS/PARTIAL/FAIL`
- [ ] Reconnect/Neuverbinden im Fehlerfall funktioniert → Ergebnis: `PASS/PARTIAL/FAIL`

## 4) Ergebnislogik

- **Go (PWA bleibt):** max. 1 Kriterium auf `PARTIAL`, kein `FAIL`.
- **Review:** mehrere `PARTIAL`, aber kein harter Blocker.
- **No-Go / Native Ergänzung prüfen:** 2 oder mehr `FAIL` oder 1 kritischer `FAIL` im Alltag.

## 5) Offene Punkte & Maßnahmen

- Offene Punkte:
- Blocker:
- Nächste Maßnahmen:
- Verantwortlich:
- Zieltermin:

## 6) Abschlussentscheidung

- Entscheidung: `GO` | `REVIEW` | `NO-GO`
- Begründung:
- Datum:
- Freigabe durch:
