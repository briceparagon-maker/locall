import Link from "next/link";

const ctaClassName =
  "absolute z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2";

export function LandingHero() {
  return (
    <div className="filtravis-shell leading-none">
      <div className="relative">
        <img
          src="/page-accueil-filtravis.jpg?v=17"
          alt="FILTRAVIS — Vos mauvaises notes, on en fait une force ! Des clients satisfaits, une réputation protégée. Activer mes 14 jours d'essai gratuits. Sans engagement, sans CB, installation en deux minutes."
          className="block h-auto w-full"
        />
        <Link
          href="/inscription"
          aria-label="Activer mes 14 jours d'essai gratuits"
          className={ctaClassName}
          style={{
            left: "32.5%",
            top: "74%",
            width: "39.5%",
            height: "12%",
          }}
        />
      </div>
      <img
        src="/un-seul-avis-filtravis.jpg?v=2"
        alt="Un seul avis peut changer la perception de votre entreprise. Votre réputation, notre priorité."
        className="block h-auto w-full"
      />
      <div className="relative">
        <img
          src="/bandeau-filtravis-essai.jpg?v=13"
          alt="Comment fonctionne FILTRAVIS ? Après inscription, les supports sont préparés et mis en place. Les clients scannent le QR code, donnent leur avis et partagent leur expérience. Les mécontents deviennent des opportunités : les tensions sont désamorcées, la réponse part automatiquement, la confiance revient. Inscription."
          className="block h-auto w-full"
        />
        <Link
          href="/inscription"
          aria-label="Inscription"
          className={ctaClassName}
          style={{
            left: "68.5%",
            top: "83.5%",
            width: "28%",
            height: "11%",
            zIndex: 20,
          }}
        />
      </div>
    </div>
  );
}
