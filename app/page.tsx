import { CalendarScreenshotImport } from "@/components/calendar-screenshot-import";
import { NextcloudCalendarSync } from "@/components/sync/nextcloud-calendar-sync";
import { APP_VERSION_LABEL } from "@/lib/version";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto w-full max-w-4xl space-y-8">
        <header>
          <p className="text-sm uppercase tracking-wider text-sky-400">Management Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kalender-Sync mit Nextcloud</h1>
          <p className="mt-3 text-slate-300">
            Hauptweg ist jetzt der tägliche Import aus einer `.ics`-Datei im Nextcloud-Ordner. Screenshot-Import
            bleibt als Havarieweg verfügbar.
          </p>
          <p className="mt-2 text-xs text-slate-500">Version: {APP_VERSION_LABEL}</p>
        </header>

        <NextcloudCalendarSync />

        <section className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4">
          <p className="text-sm font-semibold text-amber-300">Havarieweg</p>
          <p className="mt-1 text-sm text-amber-100/90">
            Falls der Nextcloud-Sync fehlschlägt, kann weiterhin ein Screenshot importiert und lokal analysiert
            werden.
          </p>
        </section>

        <CalendarScreenshotImport />
      </section>
    </main>
  );
}
