import { LegalShell } from "@/components/legal-shell";

export default function FaqPage() {
  return (
    <LegalShell title="FAQ">
      <p className="font-semibold text-locall-navy">L’essai est-il vraiment gratuit ?</p>
      <p>
        Oui : 14 jours, sans carte bancaire et sans engagement. Vous pouvez
        arrêter à tout moment.
      </p>
      <p className="font-semibold text-locall-navy">Que se passe-t-il si un client met 1, 2 ou 3 étoiles ?</p>
      <p>
        L’avis n’est pas envoyé sur Google. FILTRAVIS l’intercepte, vous alerte et
        peut envoyer une réponse d’apaisement au client.
      </p>
      <p className="font-semibold text-locall-navy">Et pour un avis 4 ou 5 étoiles ?</p>
      <p>
        Le client est orienté vers Google. Vous pouvez activer la réponse
        automatique SEO (option offerte).
      </p>
      <p className="font-semibold text-locall-navy">Le QR code reste-t-il valable après l’essai ?</p>
      <p>
        Oui. Vos supports imprimés et ce QR code restent actifs à vie, sans
        frais supplémentaire liés au support lui-même.
      </p>
      <p className="font-semibold text-locall-navy">Comment s’abonner ?</p>
      <p>
        Depuis votre dashboard, bouton « S’abonner ». Le paiement est géré par
        Stripe. Vous pouvez gérer ou résilier dans le portail client.
      </p>
    </LegalShell>
  );
}
