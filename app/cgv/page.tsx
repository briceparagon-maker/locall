import { LegalShell } from "@/components/legal-shell";

export default function CgvPage() {
  return (
    <LegalShell title="Conditions générales de vente">
      <p>
        LOCALL propose un essai de 14 jours, sans carte bancaire. À l’issue de
        l’essai, l’accès au service de protection (interception des avis 1-3★,
        dashboard, Smart QR) se poursuit via un abonnement mensuel réglé en
        ligne (Stripe).
      </p>
      <p>
        L’abonnement est sans engagement de durée minimale au-delà de la
        période mensuelle en cours. La résiliation s’effectue depuis le portail
        de paiement ou le dashboard. Les supports imprimés et le QR déjà
        installés restent actifs à vie.
      </p>
      <p>
        Les prix applicables sont ceux affichés au moment du paiement. Une
        facture / reçu est fourni par le prestataire de paiement.
      </p>
    </LegalShell>
  );
}
