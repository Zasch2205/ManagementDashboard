"use client";

import { useMemo, useState } from "react";
import { signInWithM365, signOutFromM365 } from "@/app/actions/auth-actions";

type SettingsDialogProps = {
  connected: boolean;
  displayName?: string | null;
  email?: string | null;
  versionLabel: string;
};

type ThemeMode = "system" | "light" | "dark";

export function SettingsDialog({ connected, displayName, email, versionLabel }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [showOnlyOpen, setShowOnlyOpen] = useState(true);

  const accountStatusText = useMemo(() => {
    if (connected) return "verbunden";
    return "nicht verbunden";
  }, [connected]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
      >
        Einstellungen
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="dialog" aria-modal="true">
          <section className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-sky-300">Settings</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-100">Dashboard Einstellungen</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-slate-700 px-2.5 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                Schließen
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <h3 className="text-sm font-semibold text-slate-100">M365 Account</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Status: <span className="font-medium text-slate-100">{accountStatusText}</span>
                </p>
                {connected ? (
                  <p className="mt-1 text-xs text-slate-400">
                    {displayName ?? "Unbekannt"}
                    {email ? ` · ${email}` : ""}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {!connected ? (
                    <form action={signInWithM365}>
                      <button
                        type="submit"
                        className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
                      >
                        M365 verbinden
                      </button>
                    </form>
                  ) : (
                    <>
                      <form action={signInWithM365}>
                        <button
                          type="submit"
                          className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
                        >
                          Neu verbinden
                        </button>
                      </form>
                      <form action={signOutFromM365}>
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
                        >
                          Verbindung trennen
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Kalender Defaults</h3>
                <label className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={showOnlyOpen}
                    onChange={(event) => setShowOnlyOpen(event.currentTarget.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                  />
                  Standardmäßig nur offene Vorbereitungen anzeigen
                </label>
              </section>

              <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Darstellung</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["system", "light", "dark"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTheme(mode)}
                      className={`rounded-lg border px-3 py-1.5 text-sm ${
                        theme === mode
                          ? "border-sky-400 bg-sky-500/20 text-sky-200"
                          : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      {mode === "system" ? "System" : mode === "light" ? "Hell" : "Dunkel"}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400">Version: {versionLabel}</div>
          </section>
        </div>
      ) : null}
    </>
  );
}
