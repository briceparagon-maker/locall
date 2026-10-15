import Link from "next/link";
import { InscriptionForm } from "./inscription-form";

export default function InscriptionPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-locall-orange">
              LOCALL
            </p>
            <p className="mt-1 text-sm text-white/80">Essai gratuit 14 jours</p>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline"
          >
            Accueil
          </Link>
        </div>
      </header>

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
