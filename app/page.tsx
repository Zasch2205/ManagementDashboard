import { CalendarScreenshotImport } from "@/components/calendar-screenshot-import";
import { APP_VERSION_LABEL } from "@/lib/version";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto w-full max-w-4xl">
        <p className="text-sm uppercase tracking-wider text-sky-400">Management Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">MVP lokal mit Screenshot-Datenbasis</h1>
        <p className="mt-3 text-slate-300">
          Dieser MVP nutzt einen Kalender-Screenshot als Datenquelle. Import, Analyse und Ergebnisliste laufen
          vollständig lokal im Browser.
        </p>
        <p className="mt-2 text-xs text-slate-500">Version: {APP_VERSION_LABEL}</p>

        <div className="mt-8">
          <CalendarScreenshotImport />
        </div>
      </section>
    </main>
  );
}
