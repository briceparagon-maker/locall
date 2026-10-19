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

const STEP_VISUALS = {
  1: {
    src: "/modale-etape-1-filtravis.jpg?v=1",
    alt: "Votre Smart QR Code est disponible. Une fois votre formulaire rempli, un Smart QR Code unique et personnalisé est créé spécialement pour votre établissement.",
    ariaLabel: "Votre Smart QR Code est disponible",
    maxClass: "max-w-3xl",
    closeX: { left: "88%", top: "2.4%", width: "9.5%", height: "10.5%" },
    closeBtn: { left: "27%", top: "84.2%", width: "46%", height: "8.5%" },
  },
  2: {
    src: "/modale-etape-2-filtravis.jpg?v=1",
    alt: "Téléchargez votre Smart QR Code. Choisissez vos supports, utilisez des fournisseurs professionnels et maximisez vos résultats.",
    ariaLabel: "Téléchargez votre Smart QR Code",
    maxClass: "max-w-[720px]",
    closeX: { left: "88.5%", top: "1.6%", width: "10%", height: "9.5%" },
    closeBtn: { left: "33%", top: "83.8%", width: "34%", height: "6.8%" },
  },
  3: {
    src: "/modale-etape-3-filtravis.jpg?v=3",
    alt: "Votre Smart QR Code est opérationnel. Mettez vos supports en place, activez l’essai 14 jours dans le tableau de bord, et votre QR Code est branché.",
    ariaLabel: "Votre Smart QR Code est opérationnel",
    maxClass: "max-w-6xl",
    closeX: { left: "93.2%", top: "0.6%", width: "6.4%", height: "13%" },
    closeBtn: { left: "37.5%", top: "93.4%", width: "25%", height: "5%" },
  },
} as const;

const ctaClassName =
  "absolute z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2";

const closeHotspotClass =
  "absolute z-10 cursor-pointer rounded-full bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a825] focus-visible:ring-offset-2";

export function TrialStepsBanner() {
  const [openStep, setOpenStep] = useState<1 | 2 | 3 | null>(null);
  const current = STEPS.find((step) => step.id === openStep) ?? null;
  const visual = current ? STEP_VISUALS[current.id] : null;

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
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/55 p-3 sm:p-6"
          onClick={() => setOpenStep(null)}
        >
          {visual ? (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={visual.ariaLabel}
              className={`w-full ${visual.maxClass}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative leading-none">
                <img
                  src={visual.src}
                  alt={visual.alt}
                  className="block h-auto w-full"
                />
                {"closeX" in visual ? (
                  <button
                    type="button"
                    aria-label="Fermer"
                    onClick={() => setOpenStep(null)}
                    className={closeHotspotClass}
                    style={visual.closeX}
                  />
                ) : (
                  <button
                    type="button"
                    aria-label="Fermer"
                    onClick={() => setOpenStep(null)}
                    className="absolute -right-1 -top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#e0a825] bg-[#0a2348] text-xl font-bold leading-none text-white shadow-md hover:bg-[#0c2c58]"
                  >
                    ×
                  </button>
                )}
                {"closeBtn" in visual ? (
                  <button
                    type="button"
                    aria-label="Fermer"
                    onClick={() => setOpenStep(null)}
                    className={closeHotspotClass}
                    style={visual.closeBtn}
                  />
                ) : null}
              </div>
              {"closeBtn" in visual ? null : (
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setOpenStep(null)}
                    className="rounded-full bg-white px-10 py-2.5 text-sm font-bold text-locall-navy shadow-md hover:bg-slate-100"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          ) : (
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
          )}
        </div>
      ) : null}
    </div>
  );
}
