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
