import { createHmac, timingSafeEqual } from "node:crypto";
import { appUrl, escapeHtml, isEmail } from "@/lib/app-url";
import { getResend, resendFrom } from "@/lib/resend-client";
import { db } from "@/src/prisma/db";

const ONE_HOUR_MS = 60 * 60 * 1000;

function resetSecret() {
  return (
    process.env.PASSWORD_RESET_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    "locall-dev-password-reset"
  );
}

function sign(email: string, exp: number, passwordHash: string) {
  return createHmac("sha256", resetSecret())
    .update(`${email}|${exp}|${passwordHash}`)
    .digest("hex");
}

function signaturesMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function buildResetUrl(email: string, passwordHash: string) {
  const exp = Date.now() + ONE_HOUR_MS;
  const sig = sign(email, exp, passwordHash);
  const url = new URL("/reinitialiser-mot-de-passe", appUrl());
  url.searchParams.set("email", email);
  url.searchParams.set("exp", String(exp));
  url.searchParams.set("sig", sig);
  return url.toString();
}

export async function verifyResetToken(email: string, exp: string, sig: string) {
  const expires = Number(exp);
  if (!isEmail(email) || !sig || !Number.isFinite(expires) || expires < Date.now()) {
    return { ok: false as const };
  }
  const restaurant = await db.orm.public.Restaurant.where({ ownerEmail: email }).first();
  if (!restaurant?.passwordHash) return { ok: false as const };
  const expected = sign(email, expires, restaurant.passwordHash);
  if (!signaturesMatch(expected, sig)) return { ok: false as const };
  return { ok: true as const, restaurant };
}

export async function sendPasswordResetEmail(rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  if (!isEmail(email)) {
    return { ok: false as const, error: "Indiquez un e-mail valide." };
  }

  const restaurant = await db.orm.public.Restaurant.where({ ownerEmail: email }).first();
  const resend = getResend();
  if (restaurant?.passwordHash && resend) {
    const resetUrl = buildResetUrl(email, restaurant.passwordHash);
    const sent = await resend.emails.send({
      from: resendFrom(),
      to: email,
      subject: "Réinitialisation de votre mot de passe FILTRAVIS",
      html: `<div style="font-family:Arial,sans-serif;color:#0A192F;line-height:1.6;max-width:560px">
<p>Bonjour ${escapeHtml(restaurant.ownerFirstName?.trim() || "commerçant")},</p>
<p>Une demande de réinitialisation de mot de passe a été faite pour votre compte FILTRAVIS.</p>
<p><a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#FF5500;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">Choisir un nouveau mot de passe</a></p>
<p style="color:#64748b;font-size:13px">Ce lien expire dans 1 heure. Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.</p>
</div>`,
    });
    if (sent.error) console.error("password reset Resend:", sent.error);
  }

  return {
    ok: true as const,
    message:
      "Si un compte existe pour cet e-mail, vous recevrez un lien de réinitialisation.",
  };
}
