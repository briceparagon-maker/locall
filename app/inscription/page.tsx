import Link from "next/link";

export default function InscriptionPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-5">
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

      <main className="mx-auto max-w-xl px-4 py-12">
        <section className="card-locall p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">
            Activez votre essai LOCALL
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sans carte bancaire. Votre Smart QR est prêt en 2 minutes.
          </p>
          <form className="mt-6 space-y-4" action="/dashboard">
            <label className="block text-sm font-medium text-locall-navy">
              Nom de l’établissement
              <input
                name="name"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition-colors focus:border-locall-orange"
              />
            </label>
            <label className="block text-sm font-medium text-locall-navy">
              E-mail
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition-colors focus:border-locall-orange"
              />
            </label>
            <label className="block text-sm font-medium text-locall-navy">
              Ville
              <input
                name="city"
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition-colors focus:border-locall-orange"
              />
            </label>
            <button type="submit" className="btn-locall-cta h-12 w-full uppercase tracking-wide">
              Essayez LOCALL gratuitement →
            </button>
            <p className="text-center text-sm text-slate-500">
              Déjà client ?{" "}
              <Link href="/dashboard" className="link-locall">
                Accéder au dashboard
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
