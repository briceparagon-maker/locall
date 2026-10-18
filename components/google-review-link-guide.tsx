"use client";

import { useState } from "react";

const TUTO_IMAGE_SRC = "/images/tuto-lien-google.png";

export function GoogleReviewLinkGuide() {
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-locall-navy transition-colors hover:border-locall-orange/50 hover:bg-orange-50"
      >
        📸 Comment trouver mon lien d’avis Google ?
      </button>
      {open ? (
        <div className="mt-2 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-locall-navy">
            En 3 étapes :
          </p>
          <ul className="space-y-1.5 text-sm leading-6 text-slate-800">
            <li>
              • Étape 1 : Allez sur la gestion de votre fiche Google Business.
            </li>
            <li>
              • Étape 2 : Cliquez sur le bouton « Demander des avis ».
            </li>
            <li>
              • Étape 3 : Copiez le lien court proposé et collez-le ci-dessus.
            </li>
          </ul>
          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {imageFailed ? (
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                <p className="text-sm font-medium text-locall-navy">
                  Illustration : bouton « Demander des avis »
                </p>
                <p className="max-w-sm text-xs text-slate-600">
                  Placez votre capture dans{" "}
                  <code className="rounded bg-slate-100 px-1">
                    public/images/tuto-lien-google.png
                  </code>{" "}
                  pour l’afficher ici.
                </p>
              </div>
            ) : (
              <img
                src={TUTO_IMAGE_SRC}
                alt="Capture d’écran : bouton Demander des avis sur la fiche Google Business, puis copie du lien court."
                className="h-auto w-full object-contain"
                onError={() => setImageFailed(true)}
              />
            )}
          </figure>
        </div>
      ) : null}
    </div>
  );
}
