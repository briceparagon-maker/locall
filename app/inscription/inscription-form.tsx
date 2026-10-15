"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { GoogleSeoOptionModal } from "@/components/google-seo-option-modal";
import { registerTrial } from "./actions";

const STATUSES = ["Indépendant", "Franchisé", "Franchiseur"] as const;

const ACTIVITIES = [
  "Restaurant",
  "Boulangerie",
  "Café",
  "Coiffeur",
  "Garage",
  "Hôtel",
  "Commerce",
  "Autre",
];

export function InscriptionForm() {
  const [error, setError] = useState<string | null>(null);
  const [seoEnabled, setSeoEnabled] = useState(false);
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    if (seoEnabled) formData.set("autoRespondGooglePositive", "on");
    startTransition(async () => {
      const result = await registerTrial(formData);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="label-locall">
          Nom de l’établissement
          <input name="name" required className="input-locall" />
        </label>

        <fieldset>
          <legend className="text-sm font-medium text-locall-navy">Statut</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {STATUSES.map((status) => (
              <label
                key={status}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm text-locall-navy has-[:checked]:border-locall-orange has-[:checked]:bg-orange-50"
              >
                <input
                  type="radio"
                  name="ownerStatus"
                  value={status}
                  required
                  defaultChecked={status === "Indépendant"}
                  className="accent-locall-orange"
                />
                {status}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="label-locall">
          Activité / Métier
          <input
            name="activity"
            required
            list="locall-activities"
            placeholder="Restaurant, Coiffeur, Garage…"
            className="input-locall"
          />
          <datalist id="locall-activities">
            {ACTIVITIES.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label-locall">
            Prénom
            <input name="ownerFirstName" required className="input-locall" />
          </label>
          <label className="label-locall">
            Nom
            <input name="ownerLastName" required className="input-locall" />
          </label>
        </div>

        <label className="label-locall">
          Adresse
          <input name="address" required className="input-locall" />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="label-locall">
            Code postal
            <input name="postalCode" required className="input-locall" />
          </label>
          <label className="label-locall">
            Ville
            <input name="city" required className="input-locall" />
          </label>
          <label className="label-locall">
            Département
            <input name="department" required className="input-locall" />
          </label>
        </div>

        <label className="label-locall">
          Téléphone
          <input name="phone" type="tel" required className="input-locall" />
        </label>

        <label className="label-locall">
          Email
          <input name="email" type="email" required className="input-locall" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label-locall">
            Mot de passe
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input-locall"
            />
          </label>
          <label className="label-locall">
            Confirmer le mot de passe
            <input
              name="passwordConfirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input-locall"
            />
          </label>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
            <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-sm text-locall-navy">
              <input
                type="checkbox"
                checked={seoEnabled}
                onChange={(event) => setSeoEnabled(event.target.checked)}
                className="mt-1 accent-locall-orange"
              />
              <span>
                Activer la réponse automatique SEO pour vos avis 4/5 et 5/5
                Google (Option offerte)
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowSeoModal(true)}
              className="link-locall shrink-0 text-sm underline"
            >
              En savoir plus
            </button>
          </div>
          {seoEnabled ? (
            <label className="label-locall">
              URL de votre fiche Google Business / Google Maps (ou Lien d’avis
              Google)
              <input
                name="googlePlaceUrl"
                type="url"
                required
                placeholder="https://g.page/r/... ou https://maps.google.com/..."
                className="input-locall"
              />
            </label>
          ) : null}
        </div>

        <div className="flex items-start gap-3 text-sm text-locall-navy">
          <input
            id="acceptTerms"
            type="checkbox"
            name="acceptTerms"
            required
            className="mt-1 accent-locall-orange"
          />
          <span>
            <label htmlFor="acceptTerms">J’accepte les </label>
            <Link
              href="/cgu"
              className="link-locall"
              target="_blank"
              rel="noopener noreferrer"
            >
              CGU
            </Link>
            <label htmlFor="acceptTerms"> et la </label>
            <Link
              href="/confidentialite"
              className="link-locall"
              target="_blank"
              rel="noopener noreferrer"
            >
              Politique de confidentialité
            </Link>
            .
          </span>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button type="submit" disabled={pending} className="btn-locall-cta h-12 w-full uppercase tracking-wide">
          {pending ? "Activation…" : "Activer mes 14 jours gratuits →"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="link-locall">
            Se connecter
          </Link>
        </p>
        <p className="text-center text-sm text-slate-500">
          Sans engagement | Activation instantanée
        </p>
      </form>

      <GoogleSeoOptionModal
        open={showSeoModal}
        alreadyEnabled={seoEnabled}
        onClose={() => setShowSeoModal(false)}
        onActivate={() => {
          setSeoEnabled(true);
          setShowSeoModal(false);
        }}
      />
    </>
  );
}
