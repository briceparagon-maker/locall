import Link from "next/link";
import { LegalShell } from "@/components/legal-shell";

export default function ContactPage() {
  return (
    <LegalShell title="Contactez-nous">
      <p>
        Une question sur l’essai, votre Smart QR ou votre abonnement ? Nous
        vous répondons depuis votre espace commerçant, ou avant inscription.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Déjà client :{" "}
          <Link href="/dashboard" className="link-locall">
            ouvrir le dashboard
          </Link>
        </li>
        <li>
          Pas encore de compte :{" "}
          <Link href="/inscription" className="link-locall">
            activer l’essai 14 jours
          </Link>
        </li>
        <li>
          Compte existant :{" "}
          <Link href="/connexion" className="link-locall">
            se connecter
          </Link>
        </li>
      </ul>
      <p>
        Pour un sujet juridique ou une demande RGPD (accès, rectification,
        suppression), indiquez-le depuis votre compte ou via la{" "}
        <Link href="/confidentialite" className="link-locall">
          politique de confidentialité
        </Link>
        .
      </p>
    </LegalShell>
  );
}
