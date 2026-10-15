import Link from "next/link";

export default function CguPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-locall-orange">
            LOCALL
          </p>
          <Link
            href="/inscription"
            className="text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline"
          >
            Retour à l’inscription
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <article className="card-locall space-y-4 p-6 text-sm leading-6 text-slate-700 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">
            Conditions générales d’utilisation
          </h1>
          <p>
            L’essai gratuit LOCALL dure 14 jours, sans carte bancaire et sans
            engagement. En créant un compte, vous utilisez le service pour
            capturer les avis clients via Smart QR, intercepter les retours
            sensibles et, le cas échéant, publier des réponses SEO sur les avis
            Google 4★ et 5★.
          </p>
          <p>
            Vous êtes responsable des informations transmises (établissement,
            coordonnées, contenus d’avis). LOCALL peut suspendre un compte en
            cas d’usage abusif. L’essai peut être interrompu à tout moment.
          </p>
        </article>
      </main>
    </div>
  );
}
