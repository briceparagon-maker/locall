"use server";

import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/password";
import { verifyResetToken } from "@/lib/password-reset";
import { clearOwnerSession } from "@/lib/session";
import { db } from "@/src/prisma/db";

export async function resetPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const exp = String(formData.get("exp") ?? "");
  const nonce = String(formData.get("nonce") ?? "");
  const sig = String(formData.get("sig") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (password.length < 8) {
    return { ok: false as const, error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== passwordConfirm) {
    return { ok: false as const, error: "Les mots de passe ne correspondent pas." };
  }

  const checked = await verifyResetToken(email, exp, nonce, sig);
  if (!checked.ok) {
    return { ok: false as const, error: "Ce lien n’est plus valide. Refaites une demande." };
  }

  const updated = await db.orm.public.Restaurant.where({
    id: checked.restaurant.id,
    passwordResetNonce: checked.nonceHash,
  }).update({
    passwordHash: hashPassword(password),
    passwordResetNonce: null,
  });
  if (!updated) {
    return { ok: false as const, error: "Ce lien n’est plus valide. Refaites une demande." };
  }

  await clearOwnerSession();
  redirect("/connexion");
}
