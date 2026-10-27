"use client";

import { useState } from "react";
import type { SubscriptionStatus } from "@/lib/billing";
import { extendTrial, toggleQr } from "./actions";

export type AdminRestaurant = {
  id: number;
  name: string;
  slug: string | null;
  type: "Indépendant" | "Franchisé" | "Franchiseur" | "—";
  qrActive: boolean;
  trialDaysLeft: number | null;
  seoEnabled: boolean;
  subscriptionStatus: SubscriptionStatus;
};

export function AdminDashboard({
  metrics,
  restaurants,
}: {
  metrics: {
    trialing: number;
    subscribers2490: number;
    subscribers20: number;
    intercepted: number;
  };
  restaurants: AdminRestaurant[];
}) {
  const [tab, setTab] = useState<"clients" | "plv">("clients");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Clients en essai" value={String(metrics.trialing)} hint="Essai en cours" />
        <Metric label="Abonnés 24,90 €" value={String(metrics.subscribers2490)} hint="Indépendants actifs" />
        <Metric label="Abonnés 20 €" value={String(metrics.subscribers20)} hint="Franchisés actifs" />
        <Metric label="Total avis interceptés" value={String(metrics.intercepted)} hint="Avis 1 à 3 étoiles" />
      </section>

      <div className="flex gap-2">
        <TabButton active={tab === "clients"} onClick={() => setTab("clients")}>
          Clients
        </TabButton>
        <TabButton active={tab === "plv"} onClick={() => setTab("plv")}>
          Commandes supports PLV
        </TabButton>
      </div>

      {tab === "clients" ? <ClientsTable restaurants={restaurants} /> : <PlvOrders restaurants={restaurants} />}
    </main>
  );
}

function ClientsTable({ restaurants }: { restaurants: AdminRestaurant[] }) {
  return (
    <section className="card-locall overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Tableau des clients
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Établissement</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Statut QR Code</th>
              <th className="px-4 py-3 font-medium">Jours d’essai restants</th>
              <th className="px-4 py-3 font-medium">Option réponse SEO</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Aucun client inscrit.
                </td>
              </tr>
            ) : (
              restaurants.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-locall-navy">{row.name}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                        row.qrActive ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {row.qrActive ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.trialDaysLeft === null
                      ? "—"
                      : `${Math.max(0, row.trialDaysLeft)} / 14 jours`}
                  </td>
                  <td className="px-4 py-3">{row.seoEnabled ? "Oui" : "Non"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {row.slug ? (
                        <a
                          href={`/r/${row.slug}`}
                          className="rounded-full border border-locall-navy px-3 py-1 text-xs font-medium text-locall-navy hover:bg-locall-navy hover:text-white"
                        >
                          Voir fiche
                        </a>
                      ) : (
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-400">
                          Voir fiche
                        </span>
                      )}
                      <form action={extendTrial}>
                        <input type="hidden" name="restaurantId" value={row.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-locall-navy px-3 py-1 text-xs font-medium text-locall-navy hover:bg-locall-navy hover:text-white"
                        >
                          Prolonger essai
                        </button>
                      </form>
                      <form action={toggleQr}>
                        <input type="hidden" name="restaurantId" value={row.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-locall-navy px-3 py-1 text-xs font-medium text-locall-navy hover:bg-locall-navy hover:text-white"
                        >
                          {row.qrActive ? "Désactiver" : "Activer"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PlvOrders({ restaurants }: { restaurants: AdminRestaurant[] }) {
  return (
    <section className="card-locall overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Commandes supports PLV
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Suivi des demandes de stickers et présentoirs. Aucune commande n’est
          encore enregistrée : les boutons du dashboard commerçant ouvrent la
          page Contact.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Établissement</th>
              <th className="px-4 py-3 font-medium">Stickers / présentoirs</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  Aucun établissement.
                </td>
              </tr>
            ) : (
              restaurants.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-locall-navy">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">Chevalet, sticker, affiche</td>
                  <td className="px-4 py-3 text-slate-500">Aucune demande enregistrée</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        active
          ? "bg-locall-navy text-white"
          : "border border-slate-300 text-locall-navy hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
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
