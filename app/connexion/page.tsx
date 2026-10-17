import Link from "next/link";
import { ConnexionForm } from "./connexion-form";

export default function ConnexionPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-5">
          <Link
            href="/"
            className="no-underline hover:opacity-90"
            aria-label="LOCALL — Accueil"
          >
            <img
              src="/logo-locall.jpg"
              alt="LOCALL"
              className="h-10 w-auto max-h-10 max-w-[168px] object-contain object-left sm:h-11 sm:max-h-11 sm:max-w-[196px]"
            />
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
