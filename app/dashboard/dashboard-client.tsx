"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GooglePlaceSetupModal } from "@/components/google-place-setup-modal";
import { GoogleReviewLinkGuide } from "@/components/google-review-link-guide";
import { GoogleSeoOptionModal } from "@/components/google-seo-option-modal";
import { InterceptInfoModal } from "@/components/intercept-info-modal";
import { SiteFooter } from "@/components/site-footer";
import { FiltravisLogoLink, TrialCtaLink } from "@/components/site-brand";
import { useStickyLogoScale } from "@/components/use-sticky-logo-scale";
import { LogoutButton } from "@/components/logout-button";
import { isHttpUrl } from "@/lib/app-url";
import type { SubscriptionStatus } from "@/lib/billing";
import { PLV_ORDER_LINKS } from "@/lib/plv-order";
import {
  activateTrial,
  setAutoRespondGooglePositive,
  saveGooglePlaceSetup,
  saveReviewDestinations,
} from "./actions";

export type ComplaintRow = {
  id: number;
  createdAt: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
  contact: string | null;
  cuisineRating: number | null;
  serviceRating: number | null;
  ambianceRating: number | null;
  status: string;
  autoReplyText: string | null;
  clientEmailed: boolean;
  ownerNotified: boolean;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StarPips({ rating }: { rating: number }) {
  return (
    <span className="tabular-nums text-amber-500" aria-label={`${rating} sur 5`}>
      {"★".repeat(rating)}
      <span className="text-slate-300">{"★".repeat(Math.max(0, 5 - rating))}</span>
    </span>
  );
}

export function DashboardClient({
  restaurantId,
  restaurantName,
  slug,
  qrDataUrl,
  reviewUrl,
  googlePlaceUrl,
  facebookReviewUrl,
  autoRespondGooglePositive,
  isAdmin,
  subscriptionStatus,
  trialDaysLeft,
  billingNotice,
  kpis,
  complaints,
}: {
  restaurantId: number;
  restaurantName: string;
  slug: string;
  qrDataUrl: string;
  reviewUrl: string;
  googlePlaceUrl: string;
  facebookReviewUrl: string;
  autoRespondGooglePositive: boolean;
  isAdmin: boolean;
  subscriptionStatus: SubscriptionStatus;
  trialDaysLeft: number | null;
  billingNotice: string | null;
  kpis: {
    overall: string;
    googlePushed: number;
    intercepted: number;
    protectionRate: number;
  };
  complaints: ComplaintRow[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(subscriptionStatus);
  const [daysLeft, setDaysLeft] = useState(trialDaysLeft);
  const [activateError, setActivateError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [optionEnabled, setOptionEnabled] = useState(autoRespondGooglePositive);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showInterceptInfo, setShowInterceptInfo] = useState(false);
  const [optionError, setOptionError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [showPlaceSetup, setShowPlaceSetup] = useState(false);
  const [placeSetupError, setPlaceSetupError] = useState<string | null>(null);
  const [savedGooglePlaceUrl, setSavedGooglePlaceUrl] = useState(googlePlaceUrl);
  const googleListingUrl = savedGooglePlaceUrl || googlePlaceUrl;
  const [googleDestUrl, setGoogleDestUrl] = useState(googleListingUrl);
  const [facebookDestUrl, setFacebookDestUrl] = useState(facebookReviewUrl);
  const [positiveReviewError, setPositiveReviewError] = useState<string | null>(
    null,
  );
  const [positiveReviewSaved, setPositiveReviewSaved] = useState(false);
  const selected = useMemo(
    () => complaints.find((row) => row.id === selectedId) ?? null,
    [complaints, selectedId],
  );

  function persistOption(enabled: boolean) {
    setOptionError(null);
    startTransition(async () => {
      const result = await setAutoRespondGooglePositive(restaurantId, enabled);
      if (!result.ok) {
        setOptionError(result.error);
        return;
      }
      setOptionEnabled(enabled);
    });
  }

  function hasReviewDestination() {
    return isHttpUrl(googleDestUrl.trim()) || isHttpUrl(facebookDestUrl.trim());
  }

  function onToggleOption() {
    if (pending) return;
    if (optionEnabled) {
      persistOption(false);
      return;
    }
    if (!hasReviewDestination()) {
      setOptionError("Mettre au minimum 1 lien pour activer le bouton");
      return;
    }
    persistOption(true);
  }

  function downloadQr() {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `filtravis-qr-${slug}-hd.png`;
    link.click();
  }

  const { scale: logoScale, scrolled: headerScrolled } = useStickyLogoScale();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header
        className={`sticky top-0 z-50 bg-locall-navy text-white transition-shadow ${
          headerScrolled ? "shadow-lg shadow-black/30" : ""
        }`}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-3 overflow-visible px-4 py-4 sm:grid-cols-3">
          <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3">
            <TrialCtaLink />
            <a
              href="#lien-google"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
            >
              Ma fiche Google ↗
            </a>
          </div>
          <div className="justify-self-center text-center">
            <FiltravisLogoLink scale={logoScale} />
            <h1 className="mt-1 text-sm font-semibold leading-tight">
              Dashboard établissement
            </h1>
            <p className="mt-0.5 text-sm text-white/80">{restaurantName}</p>
            {status === "trialing" && daysLeft !== null ? (
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-locall-orange">
                {daysLeft > 0
                  ? `${daysLeft} jour${daysLeft > 1 ? "s" : ""} d’essai restant${daysLeft > 1 ? "s" : ""}`
                  : "Essai terminé"}
              </p>
            ) : status === "pending_activation" ? (
              <p className="mt-1 text-xs font-medium text-white/70">
                Essai 14 jours — en attente d’activation
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end sm:justify-self-end">
            {isAdmin ? (
              <a
                href="/admin"
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Admin
              </a>
            ) : null}
            <a
              href="#lien-facebook"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
            >
              Ma fiche Facebook ↗
            </a>
            <LogoutButton className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8">
        {billingNotice ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {billingNotice}
          </p>
        ) : null}
        {status === "trialing" && daysLeft !== null ? (
          <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-medium text-locall-navy">
            {daysLeft > 0
              ? `Il vous reste ${daysLeft} jour${daysLeft > 1 ? "s" : ""} d’essai gratuit.`
              : "Votre essai de 14 jours est terminé."}
          </p>
        ) : null}
        {status === "active" ? (
          <section className="card-locall flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Abonnement <strong>actif</strong>. Gérez votre moyen de paiement dans le portail Stripe.
            </p>
            <form action="/api/stripe/portal" method="post">
              <button type="submit" className="btn-locall-ghost">
                Gérer l’abonnement
              </button>
            </form>
          </section>
        ) : status !== "pending_activation" ? (
          <section className="card-locall flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-locall-navy">Abonnement mensuel FILTRAVIS</p>
              <p className="mt-1 text-sm text-slate-600">
                {status === "cancelled"
                  ? "Votre abonnement est annulé. Réactivez-le pour continuer à protéger votre note."
                  : daysLeft === null
                    ? "Passez à l’abonnement pour protéger votre note Google sans interruption."
                    : daysLeft > 0
                      ? `Il vous reste ${daysLeft} jour${daysLeft > 1 ? "s" : ""} d’essai.`
                      : "Votre essai est terminé. Abonnez-vous pour garder la protection FILTRAVIS."}
              </p>
            </div>
            <form action="/api/stripe/checkout" method="post">
              <button type="submit" className="btn-locall-cta">
                S’abonner
              </button>
            </form>
          </section>
        ) : null}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Note globale"
            value={kpis.overall}
            hint="Moyenne des avis sensibles interceptés (1-3★)"
          />
          <KpiCard
            label="Avis Google propulsés"
            value={String(kpis.googlePushed)}
            hint="4-5★ envoyés vers Google"
          />
          <KpiCard
            label="Avis interceptés"
            value={String(kpis.intercepted)}
            hint="1-3★ restés internes"
          />
          <KpiCard
            label="Taux de protection"
            value={`${kpis.protectionRate} %`}
            hint="Avis négatifs évités sur Google"
          />
        </section>

        <section>
          <div className="card-locall overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Flux de réclamations
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Retours 1-3★ — cliquez une ligne pour lire le message IA.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                    <th className="px-4 py-3 font-medium">Commentaire</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                        Aucune réclamation interceptée pour le moment.
                      </td>
                    </tr>
                  ) : (
                    complaints.map((row) => (
                      <tr
                        key={row.id}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer border-t border-slate-100 hover:bg-orange-50"
                        onClick={() => setSelectedId(row.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(row.id);
                          }
                        }}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <StarPips rating={row.rating} />
                        </td>
                        <td className="max-w-xs truncate px-4 py-3 text-slate-700">
                          {row.comment || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {row.clientEmailed ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-locall-success">
                                🟢 Réponse client envoyée
                              </span>
                            ) : row.status === "RESOLVED_AUTO" ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-locall-success">
                                🟢 Réponse automatique envoyée par FILTRAVIS
                              </span>
                            ) : (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                                Intercepté
                              </span>
                            )}
                            {row.ownerNotified ? (
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-locall-link">
                                📧 Patron notifié
                              </span>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-locall-navy">
              Votre Smart QR Code
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Chaque scan ouvre votre page d’interception FILTRAVIS : les avis 1-3★
              restent internes. Les avis 4-5★ sont proposés sur Google et/ou
              Facebook, selon les liens que vous renseignez.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="card-locall flex flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                QR code
              </p>
              <img
                src={qrDataUrl}
                alt={`QR code vers ${reviewUrl}`}
                className="mx-auto mt-4 h-52 w-52 bg-white p-2"
              />
              <p className="mt-4 text-center text-sm text-slate-700">
                Ce QR code reste actif à vie, sans aucun frais supplémentaire.
              </p>
              <button
                type="button"
                onClick={downloadQr}
                className="btn-locall-cta mt-4 w-full"
              >
                Télécharger le QR
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="card-locall p-5">
                <p className="font-semibold text-locall-navy">
                  Lien d’interception FILTRAVIS pour vos avis 1/5-2/5-3/5★
                </p>
                <p className="mt-2 break-all rounded-xl bg-slate-50 px-3 py-2 text-sm text-locall-navy">
                  {reviewUrl}
                </p>
                <button
                  type="button"
                  onClick={() => setShowInterceptInfo(true)}
                  className="mt-3 text-sm font-semibold text-locall-link transition-colors hover:text-locall-orange active:text-locall-orange"
                >
                  💡 Important à savoir :
                </button>
              </div>

              <div className="card-locall p-5">
                <p className="font-semibold text-locall-navy">
                  Paramètres Google pour vos avis 4/5 et 5/5 Google (Option
                  offerte)
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <p className="font-medium text-slate-900">
                    Réponse automatique SEO
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowOptionModal(true)}
                    className="link-locall text-sm"
                  >
                    En savoir plus
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-sm text-slate-500">
                    {optionEnabled
                      ? "FILTRAVIS publiera des remerciements SEO sur vos avis Google 4★ et 5★."
                      : "Option désactivée. Activez-la pour laisser l’IA répondre à vos avis positifs."}
                  </p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={optionEnabled}
                    aria-label="Réponse automatique SEO pour vos avis 4/5 et 5/5 Google"
                    disabled={pending}
                    onClick={onToggleOption}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                      optionEnabled ? "bg-locall-success" : "bg-slate-300"
                    } ${pending ? "opacity-60" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                        optionEnabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                {optionError ? (
                  <p className="mt-2 text-sm text-red-600">{optionError}</p>
                ) : null}
                <form
                  className="mt-3 space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setPositiveReviewError(null);
                    setPositiveReviewSaved(false);
                    startTransition(async () => {
                      const result = await saveReviewDestinations(
                        restaurantId,
                        googleDestUrl,
                        facebookDestUrl,
                      );
                      if (!result.ok) {
                        setPositiveReviewError(result.error);
                        return;
                      }
                      setSavedGooglePlaceUrl(result.googleUrl);
                      setGoogleDestUrl(result.googleUrl);
                      setFacebookDestUrl(result.facebookUrl);
                      setPositiveReviewSaved(true);
                      window.setTimeout(
                        () => setPositiveReviewSaved(false),
                        2500,
                      );
                    });
                  }}
                >
                  <p className="text-sm text-slate-600">
                    Renseignez un lien, les deux, ou un seul. Si les deux sont
                    remplis, le client verra deux boutons après une note 4/5
                    ou 5/5. Le QR FILTRAVIS ne change pas.
                  </p>
                  <GoogleReviewLinkGuide />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      id="lien-google"
                      className="label-locall scroll-mt-24"
                    >
                      Fiche Google Maps
                      <input
                        type="url"
                        value={googleDestUrl}
                        onChange={(event) => {
                          setGoogleDestUrl(event.target.value);
                          setPositiveReviewSaved(false);
                        }}
                        placeholder="https://g.page/… ou https://maps.google.com/…"
                        className="input-locall"
                      />
                    </label>
                    <label
                      id="lien-facebook"
                      className="label-locall scroll-mt-24"
                    >
                      Page avis Facebook
                      <input
                        type="url"
                        value={facebookDestUrl}
                        onChange={(event) => {
                          setFacebookDestUrl(event.target.value);
                          setPositiveReviewSaved(false);
                        }}
                        placeholder="https://www.facebook.com/…"
                        className="input-locall"
                      />
                    </label>
                  </div>
                  {positiveReviewError ? (
                    <p className="text-sm text-red-600">{positiveReviewError}</p>
                  ) : null}
                  {positiveReviewSaved ? (
                    <p className="text-sm text-emerald-700">Liens enregistrés.</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-locall-cta w-full sm:w-auto"
                  >
                    {pending ? "Enregistrement…" : "Enregistrer ces liens"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h2 className="text-lg font-semibold text-locall-navy">
              Supports PLV
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Templates PDF prêts à imprimer, avec votre QR d’interception déjà
              intégré.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <PlvCard
                title="Chevalet de table"
                description="Format A6 / A5 — à poser sur vos tables."
                links={[
                  { href: "/api/plv/chevalet-a6", label: "PDF A6" },
                  { href: "/api/plv/chevalet-a5", label: "PDF A5" },
                ]}
              />
              <PlvCard
                title="Autocollant / sticker comptoir"
                description="Format carré ou rond, pour le comptoir."
                links={[
                  { href: "/api/plv/sticker-carre", label: "PDF carré" },
                  { href: "/api/plv/sticker-rond", label: "PDF rond" },
                ]}
              />
              <PlvCard
                title="Affiche A4"
                description="Pour la vitrine ou l’accueil."
                links={[{ href: "/api/plv/affiche-a4", label: "PDF A4" }]}
              />
            </div>
          </div>

          {status === "pending_activation" ? (
            <section className="overflow-hidden rounded-2xl border-2 border-locall-orange bg-white p-5 shadow-sm sm:p-8">
              <p className="font-semibold text-locall-navy">Commande de supports</p>
              <p className="mt-1 text-sm text-slate-600">
                Commandez un kit FILTRAVIS ou passez par un imprimeur partenaire.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PLV_ORDER_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="btn-locall-ghost text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </section>

        {status === "pending_activation" || status === "trialing" ? (
          <section className="card-locall p-5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-locall-navy">
                  Activation de l’essai
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Démarre le compteur de 14 jours et ouvre le Smart QR vers la page
                  d’interception.
                </p>
              </div>
              <button
                type="button"
                disabled={pending || status === "trialing"}
                onClick={() => {
                  if (status === "trialing") return;
                  setActivateError(null);
                  startTransition(async () => {
                    const result = await activateTrial(restaurantId);
                    if (!result.ok) {
                      setActivateError(result.error);
                      return;
                    }
                    setStatus(result.status);
                    setDaysLeft(result.trialDaysLeft);
                    router.refresh();
                  });
                }}
                className={`inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-base font-extrabold tracking-wide text-white shadow-md transition-colors disabled:opacity-100 ${
                  status === "trialing"
                    ? "bg-green-600"
                    : "bg-red-600 hover:bg-red-700"
                } ${pending ? "opacity-70" : ""}`}
              >
                {pending
                  ? "Activation…"
                  : "ACTIVER MES 14 JOURS D’ESSAI GRATUITS"}
              </button>
            </div>
            {activateError ? (
              <p className="mt-2 text-sm text-red-600">{activateError}</p>
            ) : null}
          </section>
        ) : null}
      </main>

      <GooglePlaceSetupModal
        open={showPlaceSetup}
        pending={pending}
        error={placeSetupError}
        onClose={() => setShowPlaceSetup(false)}
        onSave={(url, seo) => {
          setPlaceSetupError(null);
          startTransition(async () => {
            const result = await saveGooglePlaceSetup(restaurantId, url, seo);
            if (!result.ok) {
              setPlaceSetupError(result.error);
              return;
            }
            setSavedGooglePlaceUrl(result.url);
            setGoogleDestUrl(result.url);
            setOptionEnabled(result.enabled);
            setShowPlaceSetup(false);
          });
        }}
      />

      <GoogleSeoOptionModal
        open={showOptionModal}
        alreadyEnabled={optionEnabled}
        onClose={() => setShowOptionModal(false)}
      />

      <InterceptInfoModal
        open={showInterceptInfo}
        onClose={() => setShowInterceptInfo(false)}
      />

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-locall-orange">
              Message envoyé au client
            </p>
            <h3 className="mt-1 text-lg font-semibold">
              {selected.authorName || "Visiteur"} — {selected.rating}/5 ★
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Commentaire : {selected.comment || "—"}
            </p>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-800">
              {selected.autoReplyText ||
                "Aucune réponse IA n’a encore été générée pour ce retour."}
            </pre>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="btn-locall-ghost mt-5"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : null}
      <SiteFooter />
    </div>
  );
}

function PlvCard({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="card-locall flex flex-col p-5">
      <h4 className="font-semibold text-locall-navy">{title}</h4>
      <p className="mt-1 flex-1 text-sm text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="btn-locall-ghost">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card-locall p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-locall-navy">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
  );
}
