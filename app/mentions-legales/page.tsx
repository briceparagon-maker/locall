import { LegalShell } from "@/components/legal-shell";

export default function MentionsLegalesPage() {
  return (
    <LegalShell title="Mentions légales">
      <p>
        Le site LocalNational.fr édite le service LOCALL, solution de
        protection de la réputation locale et de Smart QR pour les commerçants.
      </p>
      <p>
        Directeur de la publication : l’éditeur de LOCALL. Les coordonnées
        complètes (raison sociale, siège, SIREN) seront précisées ici dès
        publication officielle.
      </p>
      <p>
        Hébergement : infrastructure cloud utilisée pour le déploiement de
        l’application (accès via le nom de domaine LocalNational.fr).
      </p>
      <p>
        Pour toute demande :{" "}
        <a href="/contact" className="link-locall">
          Contactez-nous
        </a>
        .
      </p>
    </LegalShell>
  );
}
