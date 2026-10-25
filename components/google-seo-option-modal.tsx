"use client";

export const GOOGLE_SEO_OPTION_TITLE =
  "Réponse automatique SEO pour vos avis Google 4/5 et 5/5 (Option offerte)";

export function GoogleSeoOptionModal({
  open,
  alreadyEnabled,
  pending,
  onClose,
  onActivate,
}: {
  open: boolean;
  alreadyEnabled?: boolean;
  pending?: boolean;
  onClose: () => void;
  onActivate?: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      onClick={() => !pending && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-seo-option-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          id="google-seo-option-title"
          className="text-lg font-semibold leading-snug text-locall-navy"
        >
          {GOOGLE_SEO_OPTION_TITLE}
        </h3>
        <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
          <p>
            Autorisez FILTRAVIS à publier des réponses de remerciement
            personnalisées et optimisées pour votre SEO directement pour vos
            avis 4/5 et 5/5 sur Google. Aucune action manuelle requise :
            l&apos;IA s&apos;en occupe 24h/24.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {!alreadyEnabled && onActivate ? (
            <button
              type="button"
              disabled={pending}
              onClick={onActivate}
              className="btn-locall-cta"
            >
              {pending ? "Activation…" : "Activer l'option"}
            </button>
          ) : null}
          <button
            type="button"
            disabled={pending}
            onClick={onClose}
            className="btn-locall-ghost"
          >
            {alreadyEnabled ? "Fermer" : "Annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}
