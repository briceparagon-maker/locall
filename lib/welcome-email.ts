import { Resend } from "resend";
import { appUrl, escapeHtml, isEmail } from "@/lib/app-url";

export const WELCOME_EMAIL_SUBJECT =
  "🛡️ Bienvenue chez FILTRAVIS — Configurez vos supports, puis activez vos 14 jours";

export function welcomeEmailHtml(input: {
  firstName: string;
  establishmentName: string;
  dashboardUrl: string;
}) {
  const firstName = escapeHtml(input.firstName);
  const establishmentName = escapeHtml(input.establishmentName);
  const dashboardUrl = escapeHtml(input.dashboardUrl);

  return `<div style="font-family:Arial,sans-serif;color:#0A192F;line-height:1.6;max-width:560px">
<p style="margin:0 0 16px">Bonjour ${firstName},</p>
<p style="margin:0 0 16px">Bienvenue chez <strong>FILTRAVIS</strong>. Votre compte <strong>${establishmentName}</strong> est créé, <strong>sans carte bancaire</strong>.</p>
<p style="margin:0 0 16px">Vos 14 jours d’essai commencent lorsque vous cliquez sur <strong>Activer mes 14 jours d’essai gratuits</strong> dans le dashboard, une fois vos supports en place.</p>
<p style="margin:0 0 8px"><strong>Pour démarrer :</strong></p>
<ol style="margin:0 0 20px;padding-left:20px">
<li style="margin:0 0 8px">Connectez-vous à votre Dashboard.</li>
<li style="margin:0 0 8px">Vérifiez vos fiches Google / Facebook, imprimez vos QR, puis activez l’essai.</li>
<li>Installez vos supports sur place.</li>
</ol>
<p style="margin:0 0 20px">
  <a href="${dashboardUrl}" style="display:inline-block;background:#FF5500;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">Accéder à mon Dashboard</a>
</p>
<p style="margin:0 0 16px;color:#334155">Vos supports et votre QR code restent actifs à vie.</p>
<p style="margin:0">L’équipe FILTRAVIS</p>
</div>`;
}

export async function sendWelcomeEmail(input: {
  to: string;
  firstName: string;
  establishmentName: string;
}) {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const to = input.to.trim();
  if (!resendKey || !isEmail(to)) return { sent: false as const };

  const from =
    process.env.RESEND_FROM?.trim() || "FILTRAVIS <onboarding@resend.dev>";
  const dashboardUrl = `${appUrl()}/dashboard`;
  const resend = new Resend(resendKey);

  const sent = await resend.emails.send({
    from,
    to,
    subject: WELCOME_EMAIL_SUBJECT,
    html: welcomeEmailHtml({
      firstName: input.firstName,
      establishmentName: input.establishmentName,
      dashboardUrl,
    }),
  });

  if (sent.error) {
    console.error("welcome email Resend:", sent.error);
    return { sent: false as const };
  }

  return { sent: true as const };
}
