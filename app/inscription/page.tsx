import { SiteHeader } from "@/components/site-header";
import { InscriptionForm } from "./inscription-form";

export default function InscriptionPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <section className="card-locall p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">
            Activez votre essai LOCALL
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sans carte bancaire. Votre Smart QR est prêt en 2 minutes.
          </p>
          <InscriptionForm />
        </section>
      </main>
    </div>
  );
}
