import { LegalShell } from "@/components/legal-shell";

export default function ConfidentialitePage() {
  return (
    <LegalShell title="Politique de confidentialité">
      <p>
        FILTRAVIS traite les données nécessaires à l’inscription et au
        fonctionnement du dashboard : identité du commerçant, coordonnées,
        établissement, avis clients et e-mails de suivi.
      </p>
      <p>
        Ces données servent à créer le compte, activer l’essai de 14 jours,
        générer le Smart QR, gérer l’abonnement et envoyer les alertes liées
        aux avis. Elles ne sont pas revendues. Vous pouvez demander l’accès,
        la rectification ou la suppression de votre compte.
      </p>
    </LegalShell>
  );
}
