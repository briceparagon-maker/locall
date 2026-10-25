import Link from "next/link";

const ctaClassName =
  "absolute z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2";

export function LandingHero() {
  return (
    <div className="filtravis-shell leading-none">
      <div className="relative">
        <img
          src="/page-accueil-filtravis.jpg?v=15"
          alt="FILTRAVIS — Chaque avis compte. Un seul avis peut changer la perception de votre entreprise."
          className="block h-auto w-full"
        />
        <Link
          href="/inscription"
          aria-label="Stop aux mauvais avis*"
          className={ctaClassName}
          style={{
            left: "27%",
            top: "37.5%",
            width: "46%",
            height: "5.8%",
          }}
        />
      </div>
      <img
        src="/bandeau-filtravis-essai.png?v=12"
        alt="Comment fonctionne FILTRAVIS ? Les avis 1/5, 2/5 et 3/5 sont interceptés et non diffusés uniquement dans votre établissement."
        className="block h-auto w-full"
      />
      <img
        src="/bandeau-protection-filtravis.jpg?v=6"
        alt="Protection à 100 %. Les avis sensibles 1, 2 et 3 étoiles sont recueillis en interne quand le client scanne le QR Code dans votre établissement."
        className="block h-auto w-full"
      />
      <div className="relative z-10 -mt-3">
        <img
          src="/stop-inscription-filtravis.png?v=3"
          alt="Stop aux mauvais avis. Essai gratuit 14 jours. Inscription sans engagement et sans carte bancaire."
          className="block h-auto w-full"
        />
        <Link
          href="/inscription"
          aria-label="Inscription — Sans engagement, sans CB"
          className={ctaClassName}
          style={{
            left: "35%",
            top: "58%",
            width: "30%",
            height: "36%",
          }}
        />
      </div>
    </div>
  );
}
