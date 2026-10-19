import Link from "next/link";

export function TrialCtaLink({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Link
      href="/inscription"
      className={`inline-block leading-tight no-underline hover:opacity-90 ${className}`}
    >
      <span className="block text-sm font-semibold text-white">
        Essai gratuit
      </span>
      <span className="block text-xl font-extrabold tracking-tight text-white">
        14{" "}
        <span className="text-filtravis-gold underline decoration-[#e0a825] decoration-[3px] underline-offset-4">
          jours
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
