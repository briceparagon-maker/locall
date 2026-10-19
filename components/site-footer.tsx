import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/contact", label: "Contactez-nous" },
  { href: "/a-propos", label: "À propos" },
  { href: "/faq", label: "FAQ" },
  { href: "/connexion", label: "Connexion" },
];

export function SiteFooter() {
  return (
    <footer className="bg-locall-navy text-white">
      <div className="filtravis-shell flex flex-col gap-4 py-6">
        <nav
          aria-label="Liens du pied de page"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/90 underline-offset-4 hover:text-locall-orange hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-xs text-white/55">
          © LOCALL — LocalNational.fr
        </p>
      </div>
    </footer>
  );
}
