"use client";

import { useId, useRef, useState } from "react";

export function HowItWorks() {
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
            Comment ça marche ?
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
        <div id={contentId} className="mt-6">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Créez votre compte FILTRAVIS
          </h3>
          <p className="mt-3 text-sm font-semibold text-emerald-800 sm:text-base">
            Sans engagement • Sans carte bancaire • 14 jours gratuits
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
            Créez votre compte, récupérez votre Smart QR Code et préparez votre
            établissement à recueillir les retours de vos clients.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
            Votre essai commencera uniquement lorsque vous déciderez de
            l&apos;activer.
          </p>
          <a
            href="#creer-compte"
            className="btn-locall-cta mt-6 uppercase tracking-wide"
          >
            Créer mon compte gratuitement
          </a>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed sm:text-base">
            L&apos;équipe FILTRAVIS vous accompagne pour transformer les
            retours de vos clients en occasions de progresser et de les
            fidéliser.
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
