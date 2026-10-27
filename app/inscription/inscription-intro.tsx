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
            RÉCAPITULATIF + TARIFS
          </h1>
        </div>
        {open ? (
          <button
            type="button"
            className="btn-locall-ghost mx-auto block"
            aria-expanded={true}
            aria-controls={contentId}
            onClick={collapse}
          >
            Rétrécir
          </button>
        ) : (
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
            <h2 className="text-lg font-bold text-locall-navy">
              Comment ça marche ?
            </h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-locall-navy text-sm font-bold text-white">
                  1
                </span>
                <p className="pt-1 text-sm leading-relaxed">
                  <strong>Votre Smart QR Code unique</strong> vous attend déjà
                  dans votre espace.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-locall-navy text-sm font-bold text-white">
                  2
                </span>
                <p className="pt-1 text-sm leading-relaxed">
                  <strong>Préparez et installez vos supports**</strong>{" "}
                  (comptoir, tables, vitrine ou autres emplacements).
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-locall-navy text-sm font-bold text-white">
                  3
                </span>
                <p className="pt-1 text-sm leading-relaxed">
                  <strong>Activez votre période d’essai :</strong> vos 14 jours
                  gratuits démarrent uniquement à ce moment-là et votre Smart QR
                  Code devient actif{" "}
                  <em className="not-italic font-medium text-emerald-700">
                    (bouton vert)
                  </em>
                  .
                </p>
              </li>
            </ol>
          </section>

          <aside className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 sm:px-5">
            <p className="text-sm font-bold text-locall-navy">Pour rappel</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              <li>
                <strong>100 %* des mauvais avis (1/5, 2/5, 3/5)</strong> sont
                interceptés au sein de votre établissement.
              </li>
              <li>
                <strong>Les avis positifs (4/5 et 5/5)</strong> sont redirigés
                directement sur votre fiche Google et/ou Facebook.
              </li>
            </ul>
          </aside>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-locall-navy">
              14 jours d’essai en toute liberté
            </h2>
            <p className="text-sm leading-relaxed">
              Vous disposez de <strong>14 jours complets</strong> pour tester
              FILTRAVIS en conditions réelles et mesurer son efficacité auprès
              de vos clients.
            </p>
            <p className="text-sm leading-relaxed">
              À l’issue des 14 jours, sans décision de votre part, votre Smart
              QR Code est simplement désactivé{" "}
              <em className="not-italic font-medium text-red-700">
                (bouton rouge)
              </em>
              . Aucune mauvaise surprise !
            </p>
            <p className="text-sm font-medium">
              Pour continuer après l’essai, deux formules claires sans
              engagement :
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Franchisés
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

          <aside className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
            <p className="text-sm font-bold text-locall-navy">
              <span aria-hidden="true">🎁 </span>
              Option offerte : Réponse automatique SEO (Google 4/5 et 5/5)
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Activez le bouton dans votre tableau de bord : nous générons et
              publions des réponses optimisées pour le SEO{" "}
              <strong>en moins d’une heure</strong> après la réception de vos
              avis 4/5 et 5/5. Option désactivable à tout moment.
            </p>
          </aside>

          <footer className="space-y-2 border-t border-slate-200 pt-4">
            <p className="text-xs text-gray-500">
              *Concerne l’ensemble des avis déposés via le Smart QR Code
              uniquement dans votre établissement.
            </p>
            <p className="text-xs text-gray-500">
              **Plus vous disposez de supports Smart QR Code (tables, comptoir,
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
