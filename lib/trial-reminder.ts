import { appUrl, isEmail } from "@/lib/app-url";
import { trialEndingEmailHtml } from "@/lib/trial-ending-email";
import { getResend, resendFrom } from "@/lib/resend-client";
import { db } from "@/src/prisma/db";

export const TRIAL_REMINDER_SUBJECT = (establishmentName: string) =>
  `⏳ Plus que 2 jours d'essai gratuit pour ${establishmentName}`;

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
  const { start, end } = dayWindow(2);
  const restaurants = await db.orm.public.Restaurant.all();
  const resend = getResend();
  const subscribeUrl = `${appUrl()}/dashboard#tarif`;
  let matched = 0;
  let sent = 0;

  for (const restaurant of restaurants) {
    const status = (restaurant.subscriptionStatus ?? "").trim().toLowerCase();
    if (status === "active" || status === "cancelled" || status === "canceled") continue;
    if (status !== "trial" && status !== "trialing") continue;
    if (!restaurant.trialEndsAt || restaurant.trialReminderSentAt) continue;
    const ends = new Date(restaurant.trialEndsAt).getTime();
    if (Number.isNaN(ends) || ends < start.getTime() || ends >= end.getTime()) continue;
    matched += 1;

    const email = restaurant.ownerEmail?.trim() ?? "";
    if (!resend || !isEmail(email)) continue;

    const result = await resend.emails.send({
      from: resendFrom(),
      to: email,
      subject: TRIAL_REMINDER_SUBJECT(restaurant.name),
      html: trialEndingEmailHtml({
        clientName: restaurant.ownerFirstName?.trim() || "commerçant",
        establishmentName: restaurant.name,
        daysLeft: 2,
        subscribeUrl,
      }),
    });
    if (result.error) {
      console.error("trial reminder Resend:", result.error);
      continue;
    }
    sent += 1;
    await db.orm.public.Restaurant.where({ id: restaurant.id }).update({
      trialReminderSentAt: new Date().toISOString(),
    });
  }

  return { matched, sent, windowStart: start.toISOString(), windowEnd: end.toISOString() };
}
