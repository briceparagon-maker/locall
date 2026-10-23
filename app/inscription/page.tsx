import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InscriptionForm } from "./inscription-form";
import { InscriptionIntro } from "./inscription-intro";

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
        <section className="card-locall p-6 sm:p-8 text-locall-navy">
          <InscriptionIntro />
          <div className="mt-8 border-t border-slate-200 pt-2">
            <InscriptionForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
