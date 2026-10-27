"use server";

import { redirect } from "next/navigation";
import { isBackofficeOwner } from "@/lib/admin";
import { isEmail } from "@/lib/app-url";
import { verifyPassword } from "@/lib/password";
import { setOwnerSession } from "@/lib/session";
import { db } from "@/src/prisma/db";

export async function loginOwner(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!isEmail(email) || !password) {
    return { ok: false as const, error: "Indiquez votre e-mail et votre mot de passe." };
  }

  const restaurant = await db.orm.public.Restaurant.where({ ownerEmail: email }).first();
  if (!restaurant?.passwordHash || !verifyPassword(password, restaurant.passwordHash)) {
    return { ok: false as const, error: "E-mail ou mot de passe incorrect." };
  }

  await setOwnerSession(restaurant.id, email, restaurant.passwordHash);
  redirect(isBackofficeOwner(email) ? "/backoffice-secret-filtravis-1324" : "/dashboard");
}
