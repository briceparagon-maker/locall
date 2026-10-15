import Link from "next/link";
import { ConnexionForm } from "./connexion-form";

export default function ConnexionPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-locall-orange">
            LOCALL
          </p>
          <Link
            href="/"
            className="text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline"
          >
            Accueil
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-12">
        <section className="card-locall p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">Connexion</h1>
          <p className="mt-2 text-sm text-slate-500">
            Accédez à votre dashboard commerçant.
          </p>
          <ConnexionForm />
        </section>
      </main>
    </div>
  );
}
