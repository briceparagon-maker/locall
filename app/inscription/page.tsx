import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InscriptionForm } from "./inscription-form";

export default function InscriptionPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-locall-navy text-foreground">
      <SiteHeader />

      <div className="w-full bg-locall-navy leading-none">
        <div className="filtravis-shell leading-none">
          <img
            src="/stop-mauvais-avis-filtravis.jpg?v=6"
            alt="Stop aux mauvais avis. Essai gratuit 14 jours."
            className="block h-auto w-full"
          />
        </div>
      </div>

      <main className="filtravis-shell flex-1 py-10">
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
