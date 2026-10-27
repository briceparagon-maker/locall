import { escapeHtml } from "@/lib/app-url";

export type TrialEndingEmailProps = {
  clientName: string;
  establishmentName: string;
  daysLeft?: number;
  subscribeUrl: string;
};

export function TrialEndingEmail({
  clientName,
  establishmentName,
  daysLeft = 2,
  subscribeUrl,
}: TrialEndingEmailProps) {
  const name = escapeHtml(clientName);
  const place = escapeHtml(establishmentName);
  const href = escapeHtml(subscribeUrl);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1a1a1a", lineHeight: "1.6" }}>
      <h2 style={{ color: "#000" }}>
        Il vous reste {daysLeft} jours d&apos;essai gratuit ! ⏳
      </h2>
      <p>Bonjour {name},</p>
      <p>
        Votre période d’essai de 14 jours gratuits pour <strong>{place}</strong>{" "}
        touche bientôt à sa fin.
      </p>
      <div
        style={{
          background: "#f8f9fa",
          padding: "16px",
          borderRadius: "8px",
          margin: "20px 0",
          borderLeft: "4px solid #10b981",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>
          🛡️ Pour rappel : Vos 100 %* de mauvais avis restent interceptés en
          interne tant que votre bouton est vert !
        </p>
      </div>
      <p>
        Pour éviter toute interruption de votre Smart QR Code et continuer à
        protéger votre réputation sans engagement, choisissez votre formule
        dans votre espace :
      </p>
      <ul>
        <li>
          <strong>24,90 € HT / mois</strong> pour les indépendants
        </li>
        <li>
          <strong>20 € HT / mois</strong> pour les franchisés
        </li>
      </ul>
      <div style={{ marginTop: "24px" }}>
        <a
          href={href}
          style={{
            background: "#000",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Activer mon abonnement
        </a>
      </div>
      <p style={{ marginTop: "32px", fontSize: "14px", color: "#666" }}>
        Besoin d&apos;aide ou d&apos;un conseil ? Répondez directement à cet
        e-mail, nous sommes là pour vous.
        <br />
        <strong>L&apos;équipe FILTRAVIS</strong>
      </p>
    </div>
  );
}
