"use server";

import { db } from "@/src/prisma/db";

export async function setAutoRespondGooglePositive(
  restaurantId: number,
  enabled: boolean,
) {
  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return { ok: false as const, error: "Établissement introuvable." };
  }

  const updated = await db.orm.public.Restaurant.where({ id: restaurantId }).update({
    autoRespondGooglePositive: Boolean(enabled),
  });

  if (!updated) {
    return { ok: false as const, error: "Impossible d’enregistrer le réglage." };
  }

  return { ok: true as const, enabled: Boolean(enabled) };
}
