import { appUrl, escapeHtml, isEmail } from "@/lib/app-url";
import {
  RESET_TOKEN_TTL_MS,
  createResetNonce,
  hashResetNonce,
  passwordResetSecret,
  resetTokenClaimsValid,
  signResetToken,
} from "@/lib/password-reset-token";
import { getResend, resendFrom } from "@/lib/resend-client";
import { db } from "@/src/prisma/db";

export function buildResetUrl(
  email: string,
  passwordHash: string,
  nonce: string,
  exp = Date.now() + RESET_TOKEN_TTL_MS,
) {
  const secret = passwordResetSecret();
  if (!secret) return null;
  const sig = signResetToken(email, exp, passwordHash, nonce, secret);
  const url = new URL("/reinitialiser-mot-de-passe", appUrl());
  url.searchParams.set("email", email);
  url.searchParams.set("exp", String(exp));
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("sig", sig);
  return url.toString();
}

export async function verifyResetToken(email: string, exp: string, nonce: string, sig: string) {
  const secret = passwordResetSecret();
  const expires = Number(exp);
  if (!secret || !isEmail(email) || !sig || !nonce || !Number.isFinite(expires)) {
    return { ok: false as const };
  }

  const restaurant = await db.orm.public.Restaurant.where({ ownerEmail: email }).first();
  if (
    !restaurant?.passwordHash ||
    !resetTokenClaimsValid({
      email,
      exp: expires,
      passwordHash: restaurant.passwordHash,
      nonce,
      signature: sig,
      storedNonceHash: restaurant.passwordResetNonce,
      secret,
    })
  ) {
    return { ok: false as const };
  }

  return {
    ok: true as const,
    restaurant,
    nonceHash: hashResetNonce(nonce),
  };
}

export async function sendPasswordResetEmail(rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  if (!isEmail(email)) {
    return { ok: false as const, error: "Indiquez un e-mail valide." };
  }

  const generic = {
    ok: true as const,
    message:
      "Si un compte existe pour cet e-mail, vous recevrez un lien de réinitialisation.",
  };

  const secret = passwordResetSecret();
  if (!secret) {
    console.error("PASSWORD_RESET_SECRET manquant");
    return generic;
  }

  const restaurant = await db.orm.public.Restaurant.where({ ownerEmail: email }).first();
  const resend = getResend();
  if (!restaurant?.passwordHash || !resend) return generic;

  const nonce = createResetNonce();
  const exp = Date.now() + RESET_TOKEN_TTL_MS;
  const resetUrl = buildResetUrl(email, restaurant.passwordHash, nonce, exp);
  if (!resetUrl) return generic;

  await db.orm.public.Restaurant.where({ id: restaurant.id }).update({
    passwordResetNonce: hashResetNonce(nonce),
  });

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
  if (sent.error) {
    await db.orm.public.Restaurant.where({ id: restaurant.id }).update({
      passwordResetNonce: null,
    });
    console.error("password reset Resend: envoi refusé");
  }

  return generic;
}
