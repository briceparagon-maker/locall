import { appUrl, escapeHtml, isEmail } from "@/lib/app-url";
import { getResend, resendFrom } from "@/lib/resend-client";
import { db } from "@/src/prisma/db";

export const TRIAL_REMINDER_SUBJECT =
  "⏳ Plus que 3 jours d'essai gratuit sur LOCALL – Protégez votre note Google";

function reminderHtml(input: {
  firstName: string;
  establishmentName: string;
  dashboardUrl: string;
}) {
  return `<div style="font-family:Arial,sans-serif;color:#0A192F;line-height:1.6;max-width:560px">
<p style="margin:0 0 16px">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="margin:0 0 16px">Il ne reste plus que <strong>3 jours</strong> d’essai gratuit pour <strong>${escapeHtml(input.establishmentName)}</strong>.</p>
<p style="margin:0 0 16px">Abonnez-vous maintenant pour continuer à intercepter les avis 1-3★ et protéger votre note Google.</p>
<p style="margin:0 0 20px">
  <a href="${escapeHtml(input.dashboardUrl)}" style="display:inline-block;background:#FF5500;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">Protéger ma note Google</a>
</p>
<p style="margin:0;color:#334155">Vos supports et votre QR code restent actifs à vie.</p>
</div>`;
}

function dayWindow(daysFromNow: number) {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysFromNow),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export async function sendTrialReminders() {
  const { start, end } = dayWindow(3);
  const restaurants = await db.orm.public.Restaurant.all();
  const resend = getResend();
  const dashboardUrl = `${appUrl()}/dashboard`;
  let matched = 0;
  let sent = 0;

  for (const restaurant of restaurants) {
    if ((restaurant.subscriptionStatus ?? "trial") !== "trial") continue;
    if (!restaurant.trialEndsAt) continue;
    const ends = new Date(restaurant.trialEndsAt).getTime();
    if (Number.isNaN(ends) || ends < start.getTime() || ends >= end.getTime()) continue;
    if (restaurant.trialReminderSentAt) continue;
    matched += 1;

    const email = restaurant.ownerEmail?.trim() ?? "";
    if (resend && isEmail(email)) {
      const result = await resend.emails.send({
        from: resendFrom(),
        to: email,
        subject: TRIAL_REMINDER_SUBJECT,
        html: reminderHtml({
          firstName: restaurant.ownerFirstName?.trim() || "commerçant",
          establishmentName: restaurant.name,
          dashboardUrl,
        }),
      });
      if (result.error) {
        console.error("trial reminder Resend:", result.error);
      } else {
        sent += 1;
        await db.orm.public.Restaurant.where({ id: restaurant.id }).update({
          trialReminderSentAt: new Date().toISOString(),
        });
      }
    }
  }

  return { matched, sent, windowStart: start.toISOString(), windowEnd: end.toISOString() };
}
