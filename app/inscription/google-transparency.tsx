"use client";

import { useId, useRef, useState } from "react";

export function GoogleTransparency() {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const headerRef = useRef<HTMLElement>(null);

  function collapse() {
    setOpen(false);
    headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="card-locall relative z-10 mt-4 p-6 text-locall-navy sm:p-8">
      <header ref={headerRef} className="space-y-3">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl border-2 border-emerald-800 px-4 py-4 text-center">
          <h2 className="text-xl font-bold tracking-tight text-locall-navy sm:text-2xl">
            FILTRAVIS et les avis Google : une transparence totale
          </h2>
        </div>
        {open ? null : (
          <button
            type="button"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-locall-navy text-white transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2"
            aria-expanded={false}
            aria-controls={contentId}
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Ouvrir le bandeau</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        )}
      </header>

      {open ? (
        <div id={contentId} className="mt-6 space-y-4 text-sm leading-relaxed sm:text-base">
          <p>FILTRAVIS est un espace indépendant de retour d&apos;expérience privé.</p>
          <p>
            Les notes et commentaires déposés sur FILTRAVIS sont transmis à
            l&apos;établissement et ne sont pas publiés sur Google ou Facebook.
          </p>
          <p>
            Chaque client dispose également d&apos;un accès direct à la
            véritable page Google Avis de votre établissement, quelle que soit
            sa note.
          </p>
          <p>
            Cet accès est visible, libre et sans condition. Le client n&apos;a
            pas besoin de déposer un commentaire sur FILTRAVIS pour publier un
            avis Google.
          </p>
          <p>
            FILTRAVIS ne bloque, ne supprime et ne modifie aucun avis publié
            sur Google.
          </p>

          <h3 className="pt-2 text-lg font-bold">
            Désamorcer les mécontentements à chaud : toute la force de
            FILTRAVIS !
          </h3>
          <p>
            Un client mécontent ressent souvent le besoin immédiat
            d&apos;exprimer sa déception.
          </p>
          <p>
            FILTRAVIS lui offre un espace d&apos;écoute instantané, directement
            dans votre établissement, au moment où son expérience est encore
            toute récente.
          </p>
          <p>
            Plutôt que de laisser une insatisfaction sans réponse, notre
            application vous permet de réceptionner son message, de comprendre
            son mécontentement et d&apos;engager rapidement un dialogue
            personnalisé.
          </p>

          <h3 className="pt-2 text-lg font-bold">
            Notre intelligence artificielle répond avec bienveillance et
            stratégie
          </h3>
          <p>
            Grâce à notre intelligence artificielle, FILTRAVIS analyse les
            commentaires reçus, quelle que soit leur note, de 1 à 5 étoiles.
          </p>
          <p>
            Elle identifie les mots-clés, les motifs de satisfaction ou de
            mécontentement et le contexte du message afin de préparer une
            réponse personnalisée, respectueuse et adaptée à chaque situation.
          </p>
          <p>
            Un accueil décevant ? Une attente trop longue ? Une prestation
            insatisfaisante ?
          </p>
          <p>
            FILTRAVIS privilégie l&apos;écoute, la compréhension et des
            formulations bienveillantes pour apaiser les tensions, valoriser
            les remarques constructives et favoriser le dialogue.
          </p>
          <p>
            Lorsqu&apos;un client accepte d&apos;être contacté, FILTRAVIS peut
            lui adresser automatiquement une réponse personnalisée au nom de
            votre établissement, selon les paramètres que vous avez choisis.
          </p>
          <p>
            Notre objectif : transformer chaque critique en une occasion de
            renouer le dialogue et de regagner la confiance de vos clients.
          </p>

          <h3 className="pt-2 text-lg font-bold">
            Vous préférez répondre personnellement ? Vous gardez la main !
          </h3>
          <p>
            Parce que certaines situations méritent une attention particulière,
            FILTRAVIS vous laisse également la possibilité de répondre
            vous-même aux messages de vos clients.
          </p>
          <p>
            Depuis votre tableau de bord, une simple case à cocher vous permet
            de choisir votre mode de réponse :
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong>Réponse automatique FILTRAVIS sous 8 minutes !</strong>
              <span className="mt-2 block">
                Dès qu&apos;un client partage son expérience, FILTRAVIS prépare
                une réponse personnalisée grâce à son intelligence artificielle,
                en tenant compte de sa note, des mots-clés et des problèmes
                rencontrés.
              </span>
              <span className="mt-2 block">
                Vous préférez répondre personnellement ?
              </span>
              <span className="mt-2 block">
                Cochez simplement « Je souhaite répondre personnellement » dans
                votre tableau de bord avant l&apos;expiration des 8 minutes.
              </span>
              <span className="mt-2 block">
                Sans intervention de votre part, FILTRAVIS prend le relais et
                adresse une réponse bienveillante et adaptée à votre client,
                lorsqu&apos;il a accepté d&apos;être contacté.
              </span>
              <span className="mt-2 block">
                Vous gardez la main, nous assurons la réactivité !
              </span>
            </li>
          </ul>
          <p>
            Vous pouvez ainsi profiter de la rapidité de notre intelligence
            artificielle tout en conservant une relation humaine lorsque vous
            le souhaitez.
          </p>
          <p>
            FILTRAVIS vous accompagne, mais vous gardez toujours le contrôle !
          </p>

          <h3 className="pt-2 text-lg font-bold">
            On transforme les mécontents en opportunités !
          </h3>
          <p>
            Une critique exprimée à chaud peut devenir une véritable occasion
            d&apos;apaiser les tensions, de démontrer votre professionnalisme
            et de redonner confiance à votre client.
          </p>
          <p>
            Grâce à des réponses adaptées, une écoute attentive et la
            possibilité d&apos;une intervention personnelle du responsable,
            FILTRAVIS contribue à transformer les insatisfactions en
            opportunités d&apos;amélioration et de fidélisation.
          </p>
          <p>
            FILTRAVIS ne cherche pas à empêcher les avis publics : il vous
            donne les moyens d&apos;agir sur la satisfaction de vos clients,
            dès les premiers signes de mécontentement.
          </p>

          <button
            type="button"
            className="btn-locall-ghost mx-auto block"
            aria-expanded={true}
            aria-controls={contentId}
            onClick={collapse}
          >
            Rétrécir
          </button>
        </div>
      ) : null}
    </section>
  );
}
