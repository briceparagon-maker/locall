import Link from "next/link";

export default function ConfidentialitePage() {
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
            Politique de confidentialité
          </h1>
          <p>
            LOCALL traite les données nécessaires à l’inscription et au
            fonctionnement du dashboard : identité du commerçant, coordonnées,
            établissement, avis clients et e-mails de suivi.
          </p>
          <p>
            Ces données servent à créer le compte, activer l’essai de 14 jours,
            générer le Smart QR et envoyer les alertes liées aux avis. Elles ne
            sont pas revendues. Vous pouvez demander l’accès, la rectification
            ou la suppression de votre compte.
          </p>
        </article>
      </main>
    </div>
  );
}
