"use client";

import Link from "next/link";
import { useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "Étape 1 — Votre Smart QR Code est disponible",
    body: "Le texte de cette étape arrive bientôt.",
    style: { left: "6%", top: "73%", width: "28%", height: "16%" },
  },
  {
    id: 2,
    title: "Étape 2 — Préparation de vos supports",
    body: "Le texte de cette étape arrive bientôt.",
    style: { left: "36%", top: "73%", width: "28%", height: "16%" },
  },
  {
    id: 3,
    title: "Étape 3 — Votre période d’essai offerte commence",
    body: "Le texte de cette étape arrive bientôt.",
    style: { left: "66%", top: "73%", width: "28%", height: "16%" },
  },
] as const;

const ctaClassName =
  "absolute z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2";

export function TrialStepsBanner() {
  const [openStep, setOpenStep] = useState<1 | 2 | 3 | null>(null);
  const current = STEPS.find((step) => step.id === openStep) ?? null;

  return (
    <div className="filtravis-shell relative leading-none">
      <img
        src="/page-accueil-filtravis.jpg?v=4"
        alt="FILTRAVIS — Chaque avis compte. Essayez gratuitement pendant 14 jours."
        className="block h-auto w-full"
      />
      <Link
        href="/inscription"
        aria-label="Essayez gratuitement pendant 14 jours"
        className={ctaClassName}
        style={{
          left: "31.5%",
          top: "25.6%",
          width: "42%",
          height: "4.2%",
        }}
      />
      <Link
        href="/inscription"
        aria-label="Essayez gratuitement pendant 14 jours"
        className={ctaClassName}
        style={{
          left: "26.5%",
          top: "59.5%",
          width: "47%",
          height: "4.4%",
        }}
      />
      {STEPS.map((step) => (
        <button
          key={step.id}
          type="button"
          aria-label={`Ouvrir l’explication de l’étape ${step.id}`}
          onClick={() => setOpenStep(step.id)}
          className="absolute z-10 cursor-pointer rounded-[1.75rem] bg-transparent transition-transform duration-150 ease-out hover:scale-[1.04] hover:bg-white/5 active:translate-y-1 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a825] focus-visible:ring-offset-2"
          style={step.style}
        />
      ))}
      {current ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
          onClick={() => setOpenStep(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="trial-step-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="trial-step-title"
              className="text-lg font-semibold leading-snug text-locall-navy"
            >
              {current.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-700">{current.body}</p>
            <button
              type="button"
              onClick={() => setOpenStep(null)}
              className="btn-locall-ghost mt-6"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
