"use client";

import { useMemo, useState } from "react";
import type { NextcloudSyncResult } from "@/lib/calendar-types";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NextcloudCalendarSync() {
  const [syncData, setSyncData] = useState<NextcloudSyncResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const september7Events = useMemo(() => {
    if (!syncData) return [];

    return syncData.events.filter((event) => {
      const date = new Date(event.startIso);
      return date.getDate() === 7 && date.getMonth() === 8;
    });
  }, [syncData]);

  const synchronize = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sync/nextcloud", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const failure = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(failure?.error ?? "Synchronisation fehlgeschlagen");
      }

      const result = (await response.json()) as NextcloudSyncResult;
      setSyncData(result);
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Synchronisation fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-xl font-semibold text-slate-100">Nextcloud Kalender-Sync (Hauptweg)</h2>
      <p className="mt-2 text-sm text-slate-300">
        Lädt die aktuelle `.ics` aus deinem Nextcloud-Ordner und zeigt für den Test nur Termine vom 7. September.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={synchronize}
          disabled={isLoading}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Synchronisiere..." : "Jetzt synchronisieren"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

      {syncData ? (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p>
            Quelle: <span className="font-medium text-slate-100">{syncData.sourceFileName}</span>
          </p>
          <p className="mt-1">
            Synchronisationsdatum: <span className="font-medium text-slate-100">{formatDateTime(syncData.synchronizationDate)}</span>
          </p>
          <p className="mt-1">
            Termine gesamt: <span className="font-medium text-slate-100">{syncData.events.length}</span>
          </p>
          <p className="mt-1">
            Termine am 7. September: <span className="font-medium text-slate-100">{september7Events.length}</span>
          </p>
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Testansicht: 7. September</p>
        {september7Events.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {september7Events.map((event) => (
              <li key={event.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
                <span className="font-medium text-slate-100">
                  {formatTime(event.startIso)}
                  {event.endIso ? `–${formatTime(event.endIso)}` : ""}
                </span>
                <span className="ml-2 text-slate-300">{event.title}</span>
                {event.location ? <p className="mt-1 text-xs text-slate-400">{event.location}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-400">Keine Termine für den 7. September gefunden.</p>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Alle synchronisierten Termine</p>
        {syncData && syncData.events.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {syncData.events.map((event) => (
              <li key={event.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
                <span className="font-medium text-slate-100">
                  {formatDateTime(event.startIso)}
                  {event.endIso ? ` – ${formatTime(event.endIso)}` : ""}
                </span>
                <span className="ml-2 text-slate-300">{event.title}</span>
                {event.location ? <p className="mt-1 text-xs text-slate-400">{event.location}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-400">Noch keine Termine synchronisiert.</p>
        )}
      </div>
    </section>
  );
}
