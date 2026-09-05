import Link from "next/link";

type ErrorPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorText: Record<string, string> = {
  AccessDenied: "Der Zugriff wurde abgelehnt. Prüfe, ob die App im Tenant freigegeben ist.",
  Configuration: "Die Auth-Konfiguration ist unvollständig. Prüfe die ENV-Variablen.",
  Verification: "Die Anmeldung konnte nicht verifiziert werden. Bitte erneut versuchen.",
  default: "Die Anmeldung war nicht erfolgreich. Bitte versuche es erneut.",
};

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const { error } = await searchParams;
  const message = error ? (errorText[error] ?? errorText.default) : errorText.default;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <section className="w-full max-w-xl rounded-2xl border border-red-900/40 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-wide text-red-300">Authentifizierungsfehler</p>
        <h1 className="mt-2 text-2xl font-semibold">M365 Anmeldung fehlgeschlagen</h1>
        <p className="mt-4 text-slate-300">{message}</p>
        {error ? <p className="mt-2 text-xs text-slate-500">Code: {error}</p> : null}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
          >
            Zurück zum Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
