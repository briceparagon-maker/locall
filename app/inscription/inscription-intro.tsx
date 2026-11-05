"use client";

import { useId, useRef, useState } from "react";

export function InscriptionIntro() {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const headerRef = useRef<HTMLElement>(null);

  function collapse() {
    setOpen(false);
    headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-6 text-locall-navy">
      <header ref={headerRef} className="space-y-3">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border-2 border-emerald-800 px-4 py-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-locall-navy sm:text-3xl">
            TARIFS
          </h1>
        </div>
        {open ? null : (
          <button
            type="button"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-locall-navy text-white transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2"
            aria-expanded={false}
            aria-controls={contentId}
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Dérouler le récapitulatif</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        )}
      </header>

      {open ? (
        <div id={contentId} className="space-y-6">
          <section className="space-y-4">
            <p className="text-sm font-medium leading-relaxed">
              Pour continuer après l’essai, deux formules claires sans
              engagement :
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Indépendants
                </p>
                <p className="mt-1 text-xl font-bold text-locall-navy">
                  24,90 € HT
                  <span className="text-sm font-semibold text-slate-600">
                    {" "}
                    / mois
                  </span>
                </p>
                <p className="mt-1 text-sm text-locall-navy">
                  avis interceptés illimités
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Franchisés / Succursales / Agences
                </p>
                <p className="mt-1 text-xl font-bold text-locall-navy">
                  20 € HT
                  <span className="text-sm font-semibold text-slate-600">
                    {" "}
                    / mois
                  </span>
                </p>
                <p className="mt-1 text-sm text-locall-navy">
                  avis interceptés illimités
                </p>
              </div>
            </div>
          </section>

          <footer className="space-y-2 border-t border-slate-200 pt-4">
            <p className="text-sm leading-relaxed text-locall-navy">
              Plus vous disposez de supports Smart QR Code (tables, comptoir,
              vitrine), plus vos clients déposent leur avis sur place, au lieu
              de poster un commentaire négatif plus tard à l’extérieur.
            </p>
            <p className="pt-2 text-sm text-locall-navy">
              Nous restons à votre entière disposition pour vous accompagner.
            </p>
            <p className="text-sm font-bold text-locall-navy">
              L’équipe FILTRAVIS
            </p>
          </footer>

          <button
            type="button"
            className="btn-locall-ghost mx-auto block"
            aria-expanded={true}
            aria-controls={contentId}
            onClick={collapse}
          >
            Rétrécir
          </button>
        </div>
      ) : null}
    </div>
  );
}
