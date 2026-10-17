import { sendSubscriptionConfirmation } from "@/lib/subscription-email";
import { db } from "@/src/prisma/db";

export async function markRestaurantActive(input: {
  restaurantId?: number | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  sendEmail?: boolean;
}) {
  let restaurant =
    input.restaurantId && input.restaurantId > 0
      ? await db.orm.public.Restaurant.where({ id: input.restaurantId }).first()
      : null;

  if (!restaurant && input.stripeCustomerId) {
    const all = await db.orm.public.Restaurant.all();
    restaurant =
      all.find((row) => row.stripeCustomerId === input.stripeCustomerId) ?? null;
  }

  if (!restaurant) return { ok: false as const, error: "Établissement introuvable." };

  await db.orm.public.Restaurant.where({ id: restaurant.id }).update({
    subscriptionStatus: "active",
    stripeCustomerId: input.stripeCustomerId || restaurant.stripeCustomerId,
    stripeSubscriptionId:
      input.stripeSubscriptionId || restaurant.stripeSubscriptionId,
  });

  if (input.sendEmail) {
    await sendSubscriptionConfirmation({
      to: restaurant.ownerEmail,
      firstName: restaurant.ownerFirstName,
      establishmentName: restaurant.name,
    });
  }

  return { ok: true as const, restaurantId: restaurant.id };
}

export async function markRestaurantCancelled(input: {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}) {
  const all = await db.orm.public.Restaurant.all();
  const restaurant =
    all.find(
      (row) =>
        (input.stripeSubscriptionId &&
          row.stripeSubscriptionId === input.stripeSubscriptionId) ||
        (input.stripeCustomerId && row.stripeCustomerId === input.stripeCustomerId),
    ) ?? null;
  if (!restaurant) return { ok: false as const };

  await db.orm.public.Restaurant.where({ id: restaurant.id }).update({
    subscriptionStatus: "cancelled",
  });
  return { ok: true as const, restaurantId: restaurant.id };
}
