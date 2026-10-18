"use client";

import { useMemo, useState } from "react";
import { statusLabel, type SubscriptionStatus } from "@/lib/billing";

export type AdminRestaurant = {
  id: number;
  name: string;
  ownerEmail: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  ownerStatus: string | null;
  city: string | null;
  slug: string | null;
  subscriptionStatus: SubscriptionStatus;
  trialDaysLeft: number | null;
  trialEndsAt: string | null;
  createdAt: string;
};

export type AdminReview = {
  id: number;
  createdAt: string;
  rating: number;
  comment: string | null;
  restaurantName: string;
  restaurantId: number;
  status: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AdminDashboard({
  metrics,
  restaurants,
  reviews,
}: {
  metrics: {
    establishments: number;
    intercepted: number;
    conversionRate: number;
    active: number;
  };
  restaurants: AdminRestaurant[];
  reviews: AdminReview[];
}) {
  const [network, setNetwork] = useState("Tous");
  const networks = useMemo(() => {
    const values = new Set(
      restaurants.map((row) => row.ownerStatus?.trim() || "Non renseigné"),
    );
    return ["Tous", ...Array.from(values).sort((a, b) => a.localeCompare(b, "fr"))];
  }, [restaurants]);

  const filtered = restaurants.filter((row) => {
    if (network === "Tous") return true;
    return (row.ownerStatus?.trim() || "Non renseigné") === network;
  });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-locall-orange">
              LOCALL
            </p>
            <h1 className="text-xl font-semibold">Master Dashboard Admin</h1>
            <p className="text-sm text-white/70">SuperAdmin — vue globale</p>
          </div>
          <a
            href="/dashboard"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
          >
            Dashboard commerçant
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Établissements" value={String(metrics.establishments)} hint="Comptes inscrits" />
          <Metric
            label="Avis 1-3★ interceptés"
            value={String(metrics.intercepted)}
            hint="Tous commerces confondus"
          />
          <Metric
            label="Abonnements actifs"
            value={String(metrics.active)}
            hint="Statut Active"
          />
          <Metric
            label="Taux de conversion"
            value={`${metrics.conversionRate} %`}
            hint="Essais convertis en abonnement"
          />
        </section>

        <section className="card-locall overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Annuaire / gestionnaires
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Professionnels inscrits, filtrables par réseau / franchiseur.
              </p>
            </div>
            <label className="text-sm text-slate-600">
              Réseau
              <select
                value={network}
                onChange={(event) => setNetwork(event.target.value)}
                className="input-locall mt-1 min-w-48"
              >
                {networks.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Établissement</th>
                  <th className="px-4 py-3 font-medium">Gestionnaire</th>
                  <th className="px-4 py-3 font-medium">Réseau</th>
                  <th className="px-4 py-3 font-medium">Essai restant</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Aucun professionnel pour ce filtre.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <p className="font-medium text-locall-navy">{row.name}</p>
                        <p className="text-xs text-slate-500">
                          {row.city || "—"} {row.slug ? `· /r/${row.slug}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {[row.ownerFirstName, row.ownerLastName].filter(Boolean).join(" ") ||
                          "—"}
                        <p className="text-xs text-slate-500">{row.ownerEmail}</p>
                      </td>
                      <td className="px-4 py-3">{row.ownerStatus || "—"}</td>
                      <td className="px-4 py-3">
                        {row.trialDaysLeft === null
                          ? "—"
                          : row.trialDaysLeft > 0
                            ? `${row.trialDaysLeft} j`
                            : "Terminé"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={row.subscriptionStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card-locall overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Suivi des essais
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Jours restants et statut Trial / Active / Cancelled.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Établissement</th>
                  <th className="px-4 py-3 font-medium">Fin d’essai</th>
                  <th className="px-4 py-3 font-medium">Jours restants</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((row) => (
                  <tr key={`trial-${row.id}`} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-locall-navy">{row.name}</td>
                    <td className="px-4 py-3">{row.trialEndsAt ? formatDate(row.trialEndsAt) : "—"}</td>
                    <td className="px-4 py-3">
                      {row.trialDaysLeft === null
                        ? "—"
                        : row.trialDaysLeft > 0
                          ? `${row.trialDaysLeft} j`
                          : "0 j"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={row.subscriptionStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card-locall overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Journal d’activité
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Historique global des avis interceptés par commerce.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Commerce</th>
                  <th className="px-4 py-3 font-medium">Note</th>
                  <th className="px-4 py-3 font-medium">Commentaire</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Aucun avis intercepté pour le moment.
                    </td>
                  </tr>
                ) : (
                  reviews.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-locall-navy">
                        {row.restaurantName}
                      </td>
                      <td className="px-4 py-3">{row.rating}/5</td>
                      <td className="max-w-sm truncate px-4 py-3 text-slate-700">
                        {row.comment || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card-locall p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-locall-navy">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
  );
}

function StatusPill({ status }: { status: SubscriptionStatus }) {
  const styles =
    status === "active"
      ? "bg-emerald-50 text-emerald-800"
      : status === "cancelled"
        ? "bg-slate-100 text-slate-700"
        : status === "pending_activation"
          ? "bg-orange-50 text-orange-800"
          : "bg-amber-50 text-amber-800";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      {statusLabel(status)}
    </span>
  );
}
