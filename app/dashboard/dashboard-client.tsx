"use client";

import { useMemo, useState } from "react";

export type ComplaintRow = {
  id: number;
  createdAt: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
  contact: string | null;
  cuisineRating: number | null;
  serviceRating: number | null;
  ambianceRating: number | null;
  status: string;
  autoReplyText: string | null;
  clientEmailed: boolean;
  ownerNotified: boolean;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StarPips({ rating }: { rating: number }) {
  return (
    <span className="tabular-nums text-amber-500" aria-label={`${rating} sur 5`}>
      {"★".repeat(rating)}
      <span className="text-slate-300">{"★".repeat(Math.max(0, 5 - rating))}</span>
    </span>
  );
}

export function DashboardClient({
  restaurantName,
  slug,
  qrDataUrl,
  reviewUrl,
  kpis,
  complaints,
}: {
  restaurantName: string;
  slug: string;
  qrDataUrl: string;
  reviewUrl: string;
  kpis: {
    overall: string;
    googlePushed: number;
    intercepted: number;
    protectionRate: number;
  };
  complaints: ComplaintRow[];
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(
    () => complaints.find((row) => row.id === selectedId) ?? null,
    [complaints, selectedId],
  );

  function downloadQr() {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `locall-qr-${slug}.png`;
    link.click();
  }

  return (
    <div className="min-h-dvh bg-[#f4f6f8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-teal-700">
              LOCALL
            </p>
            <h1 className="text-xl font-semibold">Dashboard commerçant</h1>
            <p className="text-sm text-slate-500">{restaurantName}</p>
          </div>
          <a
            href={reviewUrl}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Voir /r/{slug}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Note globale" value={kpis.overall} hint="Moyenne des retours captés" />
          <KpiCard
            label="Avis Google propulsés"
            value={String(kpis.googlePushed)}
            hint="4-5★ envoyés vers Google"
          />
          <KpiCard
            label="Avis interceptés"
            value={String(kpis.intercepted)}
            hint="1-3★ restés internes"
          />
          <KpiCard
            label="Taux de protection"
            value={`${kpis.protectionRate} %`}
            hint="Avis négatifs évités sur Google"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Smart QR Code
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Pointe vers votre page de capture /r/{slug}
            </p>
            <img
              src={qrDataUrl}
              alt={`QR code vers ${reviewUrl}`}
              className="mx-auto mt-4 h-48 w-48"
            />
            <button
              type="button"
              onClick={downloadQr}
              className="mt-4 w-full rounded-full bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
            >
              Télécharger le PNG
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Flux de réclamations
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Retours 1-3★ — cliquez une ligne pour lire le message IA.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                    <th className="px-4 py-3 font-medium">Commentaire</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                        Aucune réclamation interceptée pour le moment.
                      </td>
                    </tr>
                  ) : (
                    complaints.map((row) => (
                      <tr
                        key={row.id}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer border-t border-slate-100 hover:bg-teal-50/40"
                        onClick={() => setSelectedId(row.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(row.id);
                          }
                        }}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <StarPips rating={row.rating} />
                        </td>
                        <td className="max-w-xs truncate px-4 py-3 text-slate-700">
                          {row.comment || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {row.clientEmailed ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                                🟢 Réponse client envoyée
                              </span>
                            ) : row.status === "RESOLVED_AUTO" ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                                🟢 Réponse automatique envoyée par LOCALL
                              </span>
                            ) : (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                                Intercepté
                              </span>
                            )}
                            {row.ownerNotified ? (
                              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800">
                                📧 Patron notifié
                              </span>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Message envoyé au client
            </p>
            <h3 className="mt-1 text-lg font-semibold">
              {selected.authorName || "Visiteur"} — {selected.rating}/5 ★
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Commentaire : {selected.comment || "—"}
            </p>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-800">
              {selected.autoReplyText ||
                "Aucune réponse IA n’a encore été générée pour ce retour."}
            </pre>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="mt-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
  );
}
