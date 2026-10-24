import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InscriptionForm } from "./inscription-form";
import { InscriptionIntro } from "./inscription-intro";

export default function InscriptionPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-locall-navy text-foreground">
      <SiteHeader />

      <main className="filtravis-shell flex-1 pb-10">
        <img
          src="/stop-mauvais-avis-filtravis.png?v=1"
          alt="Stop aux mauvais avis. Essai gratuit 14 jours."
          className="relative z-20 block h-auto w-full"
        />
        <section className="card-locall relative z-10 -mt-8 p-6 pt-10 text-locall-navy sm:p-8 sm:pt-12">
          <InscriptionIntro />
        </section>
        <img
          src="/fleche-filtravis.png?v=1"
          alt=""
          aria-hidden="true"
          className="relative z-20 mx-auto -mb-8 mt-2 block h-auto w-16 sm:w-20"
        />
        <section className="card-locall relative z-10 p-6 pt-10 text-locall-navy sm:p-8 sm:pt-12">
          <header className="mx-auto mb-6 flex max-w-xl flex-col items-center gap-3 rounded-2xl border-2 border-emerald-800 px-4 py-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-locall-navy sm:text-3xl">
              Créez votre compte FILTRAVIS
            </h2>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
              Sans engagement et sans carte bancaire
            </span>
          </header>
          <p className="mb-6 text-sm leading-relaxed sm:text-base">
            Créez votre compte, puis accédez immédiatement à votre tableau de
            bord.
          </p>
          <InscriptionForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
