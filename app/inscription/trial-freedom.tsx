"use client";

import { useId, useRef, useState } from "react";

export function TrialFreedom() {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const headerRef = useRef<HTMLElement>(null);

  function collapse() {
    setOpen(false);
    headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="card-locall relative z-10 mt-6 p-6 text-center text-locall-navy sm:p-8">
      <header ref={headerRef} className="space-y-3">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl border-2 border-emerald-800 px-4 py-4">
          <h2 className="text-xl font-bold tracking-tight text-locall-navy sm:text-2xl">
            14 jours d&apos;essai en toute liberté
          </h2>
        </div>
        {open ? null : (
          <button
            type="button"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-locall-navy text-white transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2"
            aria-expanded={false}
            aria-controls={contentId}
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Ouvrir le bandeau</span>
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
        <div
          id={contentId}
          className="mx-auto mt-6 max-w-2xl space-y-4 text-sm leading-relaxed sm:text-base"
        >
          <p>Sans engagement et sans carte bancaire.</p>
          <p>
            Votre période d&apos;essai démarre uniquement lorsque vous activez
            votre Smart QR Code depuis votre tableau de bord.
          </p>
          <p>
            Vous disposez de 14 jours complets pour tester FILTRAVIS en
            conditions réelles et mesurer son efficacité auprès de vos clients.
          </p>
          <p>
            À l&apos;issue des 14 jours, sans décision de votre part, votre
            Smart QR Code est simplement désactivé{" "}
            <span className="font-semibold text-red-600">(bouton rouge)</span>.
            Aucune
            mauvaise surprise !
          </p>
          <button
            type="button"
            className="btn-locall-ghost mx-auto mt-6 block"
            aria-expanded={true}
            aria-controls={contentId}
            onClick={collapse}
          >
            Rétrécir
          </button>
        </div>
      ) : null}
    </section>
  );
}
