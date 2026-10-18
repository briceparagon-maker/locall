"use client";

import { useState } from "react";

const TUTO_IMAGE_SRC = "/images/tuto-lien-google.png";
const TUTO_IMAGE_ALT =
  "Capture d’écran : bouton Demander des avis sur la fiche Google Business, puis copie du lien court.";

export function GoogleReviewLinkGuide() {
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-locall-navy transition-colors hover:border-locall-orange/50 hover:bg-orange-50"
      >
        📸 Comment trouver mon lien d’avis Google ?
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="google-review-link-guide-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="google-review-link-guide-title"
              className="text-lg font-semibold leading-snug text-locall-navy"
            >
              📸 Comment trouver mon lien d’avis Google ?
            </h3>
            <div className="mt-4 space-y-3">
              <p className="text-sm font-semibold text-locall-navy">
                En 3 étapes :
              </p>
              <ul className="space-y-1.5 text-sm leading-6 text-slate-800">
                <li>
                  • Étape 1 : Allez sur la gestion de votre fiche Google
                  Business.
                </li>
                <li>
                  • Étape 2 : Cliquez sur le bouton « Demander des avis ».
                </li>
                <li>
                  • Étape 3 : Copiez le lien court proposé et collez-le
                  ci-dessus.
                </li>
              </ul>
              <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {imageFailed ? (
                  <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-locall-navy">
                      {TUTO_IMAGE_ALT}
                    </p>
                  </div>
                ) : (
                  <img
                    src={TUTO_IMAGE_SRC}
                    alt={TUTO_IMAGE_ALT}
                    className="h-auto w-full object-contain"
                    onError={() => setImageFailed(true)}
                  />
                )}
                <figcaption className="border-t border-slate-100 px-3 py-2 text-xs text-slate-600">
                  {TUTO_IMAGE_ALT}
                </figcaption>
              </figure>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
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
