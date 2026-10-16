"use server";

import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/password";
import { setOwnerSession } from "@/lib/session";
import { slugifyName } from "@/lib/slug";
import { isEmail } from "@/lib/app-url";
import { db } from "@/src/prisma/db";

const STATUSES = new Set(["Franchiseur", "Franchisé", "Indépendant"]);

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function uniqueSlug(name: string) {
  const base = slugifyName(name);
  for (let i = 0; i < 20; i += 1) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const existing = await db.orm.public.Restaurant.where({ slug }).first();
    if (!existing) return slug;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function registerTrial(formData: FormData) {
  const name = text(formData, "name");
  const ownerStatus = text(formData, "ownerStatus");
  const activity = text(formData, "activity");
  const ownerFirstName = text(formData, "ownerFirstName");
  const ownerLastName = text(formData, "ownerLastName");
  const address = text(formData, "address");
  const postalCode = text(formData, "postalCode");
  const city = text(formData, "city");
  const department = text(formData, "department");
  const phone = text(formData, "phone");
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const autoRespondGooglePositive = formData.get("autoRespondGooglePositive") === "on";
  const googlePlaceUrl = text(formData, "googlePlaceUrl");
  const acceptTerms = formData.get("acceptTerms") === "on";

  if (!name) return { ok: false as const, error: "Indiquez le nom de l’établissement." };
  if (!STATUSES.has(ownerStatus)) {
    return { ok: false as const, error: "Choisissez un statut (franchiseur, franchisé ou indépendant)." };
  }
  if (!activity) return { ok: false as const, error: "Indiquez votre activité." };
  if (!ownerFirstName || !ownerLastName) {
    return { ok: false as const, error: "Indiquez votre prénom et votre nom." };
  }
  if (!address || !postalCode || !city) {
    return { ok: false as const, error: "Complétez l’adresse, le code postal et la ville." };
  }
  if (!phone) return { ok: false as const, error: "Indiquez un téléphone." };
  if (!isEmail(email)) return { ok: false as const, error: "Indiquez un e-mail valide." };
  if (password.length < 8) {
    return { ok: false as const, error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== passwordConfirm) {
    return { ok: false as const, error: "Les mots de passe ne correspondent pas." };
  }
  if (!acceptTerms) {
    return {
      ok: false as const,
      error: "Veuillez accepter les CGU et la Politique de confidentialité.",
    };
  }
  if (autoRespondGooglePositive && !isHttpUrl(googlePlaceUrl)) {
    return {
      ok: false as const,
      error:
        "Indiquez l’URL de votre fiche Google Business, Google Maps ou lien d’avis.",
    };
  }

  const existing = await db.orm.public.Restaurant.where({ ownerEmail: email }).first();
  if (existing) {
    return { ok: false as const, error: "Un compte existe déjà pour cet e-mail. Connectez-vous." };
  }

  const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const slug = await uniqueSlug(name);
  const created = await db.orm.public.Restaurant.select("id").create({
    name,
    address,
    city,
    category: activity.toLowerCase(),
    activity,
    ownerEmail: email,
    slug,
    autoRespondGooglePositive,
    googlePlaceUrl: autoRespondGooglePositive ? googlePlaceUrl : null,
    googleReviewUrl: autoRespondGooglePositive ? googlePlaceUrl : null,
    ownerStatus,
    ownerFirstName,
    ownerLastName,
    postalCode,
    department: department || null,
    phone,
    passwordHash: hashPassword(password),
    trialEndsAt,
  });

  if (!created?.id) {
    return { ok: false as const, error: "Impossible de créer le compte. Réessayez." };
  }

  await setOwnerSession(created.id, email);
  redirect("/dashboard");
}
