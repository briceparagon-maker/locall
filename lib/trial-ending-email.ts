import { escapeHtml } from "@/lib/app-url";

function reactText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#x27;");
}

function reactAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function trialEndingEmailHtml(input: {
  clientName: string;
  establishmentName: string;
  daysLeft?: number;
  subscribeUrl: string;
}) {
  const daysLeft = input.daysLeft ?? 2;
  const name = reactText(escapeHtml(input.clientName));
  const place = reactText(escapeHtml(input.establishmentName));
  const href = reactAttribute(escapeHtml(input.subscribeUrl));

  return (
    `<div style="font-family:Arial, sans-serif;color:#1a1a1a;line-height:1.6">` +
    `<h2 style="color:#000">Il vous reste ${daysLeft} jours d&#x27;essai gratuit ! ⏳</h2>` +
    `<p>Bonjour ${name},</p>` +
    `<p>Votre période d’essai de 14 jours gratuits pour <strong>${place}</strong> touche bientôt à sa fin.</p>` +
    `<div style="background:#f8f9fa;padding:16px;border-radius:8px;margin:20px 0;border-left:4px solid #10b981">` +
    `<p style="margin:0;font-weight:bold">🛡️ Pour rappel : Vos 100 %* de mauvais avis restent interceptés en interne tant que votre bouton est vert !</p>` +
    `</div>` +
    `<p>Pour éviter toute interruption de votre Smart QR Code et continuer à protéger votre réputation sans engagement, choisissez votre formule dans votre espace :</p>` +
    `<ul>` +
    `<li><strong>24,90 € HT / mois</strong> pour les indépendants</li>` +
    `<li><strong>20 € HT / mois</strong> pour les franchisés, succursales et agences</li>` +
    `</ul>` +
    `<div style="margin-top:24px">` +
    `<a href="${href}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">Activer mon abonnement</a>` +
    `</div>` +
    `<p style="margin-top:32px;font-size:14px;color:#666">Besoin d&#x27;aide ou d&#x27;un conseil ? Répondez directement à cet e-mail, nous sommes là pour vous.<br/><strong>L&#x27;équipe FILTRAVIS</strong></p>` +
    `</div>`
  );
}
