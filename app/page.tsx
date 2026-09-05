import { auth } from "@/auth";
import { signInWithM365, signOutFromM365 } from "@/app/actions/auth-actions";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { APP_VERSION_LABEL } from "@/lib/version";

function StatusBadge({ isConnected }: { isConnected: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        isConnected ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
      }`}
    >
      {isConnected ? "M365 verbunden" : "M365 nicht verbunden"}
    </span>
  );
}

export default async function Home() {
  const session = await auth();
  const isConnected = !!session?.user;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <section className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <p className="mb-2 text-sm uppercase tracking-wider text-sky-400">Management Dashboard</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">P0-04: Settings-Dialog ist aktiv</h1>
          <div className="flex items-center gap-2">
            <StatusBadge isConnected={isConnected} />
            <SettingsDialog
              connected={isConnected}
              displayName={session?.user?.name}
              email={session?.user?.email}
              versionLabel={APP_VERSION_LABEL}
            />
          </div>
        </div>

        <p className="mt-4 text-slate-300">
          Die Grundeinstellungen sind jetzt direkt aus der Startseite erreichbar. M365-Konto kann verbunden,
          neu verbunden und getrennt werden.
        </p>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-sm text-slate-400">Aktuelle Session</p>
          <p className="mt-2 text-base text-slate-200">
            {isConnected
              ? `${session.user?.name ?? "Unbekannter Benutzer"} · ${session.user?.email ?? "ohne E-Mail"}`
              : "Keine aktive Verbindung zum M365-Konto"}
          </p>
          <p className="mt-2 text-xs text-slate-500">Version: {APP_VERSION_LABEL}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {!isConnected ? (
            <form action={signInWithM365}>
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              >
                Mit M365 verbinden
              </button>
            </form>
          ) : (
            <form action={signOutFromM365}>
              <button
                type="submit"
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
              >
                Verbindung trennen
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
