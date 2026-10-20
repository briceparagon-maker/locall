import Link from "next/link";

export function TrialCtaLink({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Link
      href="/inscription"
      aria-label="Stop aux mauvais Avis — Essai gratuit 14 jours"
      className={`inline-block leading-none no-underline hover:opacity-90 ${className}`}
    >
      <span className="block whitespace-nowrap text-sm font-semibold leading-none text-white sm:text-[15px]">
        Stop aux mauvais Avis
      </span>
      <span className="-mt-0.5 block whitespace-nowrap text-sm font-semibold leading-none text-white">
        Essai gratuit{" "}
        <span className="text-xl font-extrabold leading-none tracking-tight text-filtravis-gold">
          14 jours
        </span>
      </span>
    </Link>
  );
}

export function FiltravisLogoLink({
  className = "",
  scale = 1,
}: {
  className?: string;
  scale?: number;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex no-underline hover:opacity-90 ${className}`}
      aria-label="FILTRAVIS — Accueil"
    >
      <img
        src="/logo-filtravis.jpg"
        alt="FILTRAVIS"
        className="h-11 w-auto max-h-11 origin-center object-contain sm:h-12 sm:max-h-12 sm:max-w-[280px]"
        style={{ transform: `scale(${scale})` }}
      />
    </Link>
  );
}
