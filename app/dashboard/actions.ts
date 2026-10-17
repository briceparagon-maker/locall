"use server";

import { isHttpUrl } from "@/lib/app-url";
import { getOwnerRestaurantId } from "@/lib/session";
import { db } from "@/src/prisma/db";

async function requireOwnedRestaurant(restaurantId: number) {
  const sessionId = await getOwnerRestaurantId();
  if (!sessionId || sessionId !== restaurantId) {
    return { ok: false as const, error: "Établissement introuvable." };
  }
  return { ok: true as const };
}

export async function setAutoRespondGooglePositive(
  restaurantId: number,
  enabled: boolean,
) {
  const owned = await requireOwnedRestaurant(restaurantId);
  if (!owned.ok) return owned;

  const updated = await db.orm.public.Restaurant.where({ id: restaurantId }).update({
    autoRespondGooglePositive: Boolean(enabled),
  });

  if (!updated) {
    return { ok: false as const, error: "Impossible d’enregistrer le réglage." };
  }

  return { ok: true as const, enabled: Boolean(enabled) };
}

export async function saveGooglePlaceSetup(
  restaurantId: number,
  googlePlaceUrl: string,
  autoRespondGooglePositive: boolean,
) {
  const owned = await requireOwnedRestaurant(restaurantId);
  if (!owned.ok) return owned;

  const url = googlePlaceUrl.trim();
  if (!isHttpUrl(url)) {
    return {
      ok: false as const,
      error: "Indiquez l’URL de votre fiche Google Business ou Google Maps.",
    };
  }

  const updated = await db.orm.public.Restaurant.where({ id: restaurantId }).update({
    googlePlaceUrl: url,
    googleReviewUrl: url,
    autoRespondGooglePositive: Boolean(autoRespondGooglePositive),
  });

  if (!updated) {
    return { ok: false as const, error: "Impossible d’enregistrer le réglage." };
  }

  return { ok: true as const, url, enabled: Boolean(autoRespondGooglePositive) };
}

function optionalHttpUrl(value: string) {
  const url = value.trim();
  if (!url) return { ok: true as const, value: null };
  if (!isHttpUrl(url)) {
    return {
      ok: false as const,
      error: "Indiquez une URL valide (https://…).",
    };
  }
  return { ok: true as const, value: url };
}

export async function saveReviewDestinations(
  restaurantId: number,
  googleUrl: string,
  facebookUrl: string,
) {
  const owned = await requireOwnedRestaurant(restaurantId);
  if (!owned.ok) return owned;

  const google = optionalHttpUrl(googleUrl);
  if (!google.ok) {
    return {
      ok: false as const,
      error: "Lien Google invalide. Collez l’URL de votre fiche Google Maps.",
    };
  }
  const facebook = optionalHttpUrl(facebookUrl);
  if (!facebook.ok) {
    return {
      ok: false as const,
      error: "Lien Facebook invalide. Collez l’URL de votre page avis Facebook.",
    };
  }

  const updated = await db.orm.public.Restaurant.where({ id: restaurantId }).update({
    googlePlaceUrl: google.value,
    googleReviewUrl: google.value,
    facebookReviewUrl: facebook.value,
  });

  if (!updated) {
    return { ok: false as const, error: "Impossible d’enregistrer les liens." };
  }

  return {
    ok: true as const,
    googleUrl: google.value ?? "",
    facebookUrl: facebook.value ?? "",
  };
}
