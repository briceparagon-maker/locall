import Link from "next/link";

const ctaClassName =
  "absolute z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2";

export function LandingHero() {
  return (
    <div className="filtravis-shell leading-none">
      <div className="relative">
        <img
          src="/page-accueil-filtravis.jpg?v=9"
          alt="FILTRAVIS — Chaque avis compte. Un seul avis peut changer la perception de votre entreprise. Comment fonctionne FILTRAVIS ?"
          className="block h-auto w-full"
        />
        <Link
          href="/inscription"
          aria-label="Stop aux mauvais avis*"
          className={ctaClassName}
          style={{
            left: "24%",
            top: "37.3%",
            width: "52%",
            height: "6%",
          }}
        />
        <Link
          href="/inscription"
          aria-label="Tout savoir : comment fonctionne FILTRAVIS"
          className={ctaClassName}
          style={{
            left: "31%",
            top: "86%",
            width: "38%",
            height: "7.1%",
          }}
        />
      </div>
    </div>
  );
}
