import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrialStepsBanner } from "@/components/trial-steps-banner";
import { InscriptionForm } from "./inscription-form";

export default function InscriptionPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      <div className="w-full bg-locall-navy leading-none">
        <div className="filtravis-shell">
          <img
            src="/stop-mauvais-avis-filtravis.jpg?v=2"
            alt="Stop aux mauvais avis. Essai gratuit 14 jours."
            className="block h-auto w-full"
          />
        </div>
        <TrialStepsBanner />
        <div className="filtravis-shell">
          <img
            src="/etape-1-filtravis.png?v=1"
            alt="Étape 1 — Votre Smart QR Code."
            className="block h-auto w-full"
          />
          <img
            src="/etape-2-filtravis.jpg?v=1"
            alt="Étape 2 — Téléchargez votre Smart QR Code."
            className="block h-auto w-full"
          />
          <img
            src="/etape-3-filtravis.jpg?v=1"
            alt="Étape 3 — Votre Smart QR Code est opérationnel."
            className="block h-auto w-full"
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <section className="card-locall p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">
            Créez votre compte LOCALL
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sans carte bancaire. Vos 14 jours d’essai commencent quand vous les
            activez dans le dashboard.
          </p>
          <InscriptionForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
