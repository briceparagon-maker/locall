import { appUrl, escapeHtml, isEmail } from "@/lib/app-url";
import { getResend, resendFrom } from "@/lib/resend-client";

export const SUBSCRIPTION_CONFIRM_SUBJECT =
  "🎉 Confirmation de votre abonnement FILTRAVIS – Merci pour votre confiance !";

function confirmHtml(input: {
  firstName: string;
  establishmentName: string;
  dashboardUrl: string;
}) {
  return `<div style="font-family:Arial,sans-serif;color:#0A192F;line-height:1.6;max-width:560px">
<p style="margin:0 0 16px">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="margin:0 0 16px">Votre abonnement FILTRAVIS pour <strong>${escapeHtml(input.establishmentName)}</strong> est bien confirmé. Merci pour votre confiance.</p>
<p style="margin:0 0 16px">Votre Smart QR, vos supports et la protection des avis 1-3★ restent actifs.</p>
<p style="margin:0 0 20px">
  <a href="${escapeHtml(input.dashboardUrl)}" style="display:inline-block;background:#FF5500;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">Accéder à mon Dashboard</a>
</p>
<p style="margin:0">L’équipe FILTRAVIS</p>
</div>`;
}

export async function sendSubscriptionConfirmation(input: {
  to: string | null | undefined;
  firstName: string | null | undefined;
  establishmentName: string;
}) {
  const resend = getResend();
  const to = input.to?.trim() ?? "";
  if (!resend || !isEmail(to)) return { sent: false as const };

  const sent = await resend.emails.send({
    from: resendFrom(),
    to,
    subject: SUBSCRIPTION_CONFIRM_SUBJECT,
    html: confirmHtml({
      firstName: input.firstName?.trim() || "commerçant",
      establishmentName: input.establishmentName,
      dashboardUrl: `${appUrl()}/dashboard`,
    }),
  });

  if (sent.error) {
    console.error("subscription confirm Resend:", sent.error);
    return { sent: false as const };
  }
  return { sent: true as const };
}
