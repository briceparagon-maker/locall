"use client";

import { useState } from "react";

export function GooglePlaceSetupModal({
  open,
  pending,
  error,
  onClose,
  onSave,
}: {
  open: boolean;
  pending?: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (googlePlaceUrl: string, autoRespondGooglePositive: boolean) => void;
}) {
  const [seoDetailsOpen, setSeoDetailsOpen] = useState(false);
  const [seoEnabled, setSeoEnabled] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      onClick={() => !pending && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-place-setup-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          id="google-place-setup-title"
          className="text-lg font-semibold leading-snug text-locall-navy"
        >
          Renseignez le lien de votre fiche Google
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Cela vous permettra d’accéder directement à votre fiche Google et de
          visualiser vos avis.
        </p>

        <form
          className="mt-5 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            onSave(String(formData.get("googlePlaceUrl") ?? ""), seoEnabled);
          }}
        >
          <label className="label-locall">
            URL de votre fiche Google Business / Google Maps
            <input
              name="googlePlaceUrl"
              type="url"
              required
              placeholder="https://g.page/r/... ou https://maps.google.com/..."
              className="input-locall"
            />
          </label>

          <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-locall-navy">
              <input
                type="checkbox"
                checked={seoEnabled}
                onChange={(event) => setSeoEnabled(event.target.checked)}
                className="mt-1 accent-locall-orange"
              />
              <span>
                Activer maintenant (ou plus tard dans votre tableau de bord) la
                réponse automatique SEO pour vos avis 4/5 et 5/5 Google avec des
                mots-clés spécifiques à votre établissement (Option offerte).
              </span>
            </label>
            <p className="pl-7 text-sm text-slate-500">
              (Cela vous permettra de visualiser les mauvaises notes + nos
              réponses apportées pour les notes 4/5 et/ou 5/5).
            </p>
            <button
              type="button"
              onClick={() => setSeoDetailsOpen((open) => !open)}
              className="link-locall pl-7 text-sm underline"
            >
              {seoDetailsOpen ? "Réduire le texte" : "En savoir +"}
            </button>
            {seoDetailsOpen ? (
              <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <p className="font-semibold text-locall-navy">
                  Réponse automatique SEO pour vos avis Google 4/5 et 5/5
                  (Option offerte)
                </p>
                <p>
                  Autorisez LOCALL à publier des réponses de remerciement
                  personnalisées et optimisées pour votre SEO directement pour
                  vos avis 4/5 et 5/5 sur Google. Aucune action manuelle
                  requise : l’IA s’en occupe 24h/24.
                </p>
                <p className="font-medium text-locall-navy">💡 Important à savoir :</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>Protection à 100 % :</strong> Notre application gère
                    les avis sensibles (1/5, 2/5 et 3/5) directement en interne.
                    Tant que le client scanne votre QR code en établissement,
                    son avis négatif est intercepté à 100 % avant d’atteindre
                    votre fiche Google.
                  </li>
                  <li>
                    <strong>Maximisez vos résultats :</strong> Plus vous disposez
                    de présentoirs et de stickers QR codes (sur vos tables, au
                    comptoir ou en vitrine), plus vos clients seront incités à
                    vous donner leur avis dans votre établissement.
                  </li>
                  <li>
                    <strong>Un cercle vertueux :</strong> Vous récoltez un
                    maximum d’avis positifs sur Google, tout en protégeant votre
                    note et votre réputation des mauvaises surprises !
                  </li>
                </ul>
              </div>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={pending} className="btn-locall-cta">
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={onClose}
              className="btn-locall-ghost"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
