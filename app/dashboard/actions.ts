"use server";

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
