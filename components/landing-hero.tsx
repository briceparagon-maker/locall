import Link from "next/link";

const ctaClassName =
  "absolute z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2";

export function LandingHero() {
  return (
    <div className="filtravis-shell leading-none">
      <div className="relative">
        <img
          src="/page-accueil-filtravis.jpg?v=7"
          alt="FILTRAVIS — Chaque avis compte. Stop aux mauvais avis*."
          className="block h-auto w-full"
        />
        <Link
          href="/inscription"
          aria-label="Stop aux mauvais avis*"
          className={ctaClassName}
          style={{
            left: "31.5%",
            top: "38.8%",
            width: "42%",
            height: "6.4%",
          }}
        />
        <Link
          href="/inscription"
          aria-label="Essayez gratuitement pendant 14 jours"
          className={ctaClassName}
          style={{
            left: "26.5%",
            top: "90.3%",
            width: "47%",
            height: "6.7%",
          }}
        />
      </div>
    </div>
  );
}
