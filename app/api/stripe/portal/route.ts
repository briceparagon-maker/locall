import { connection } from "next/server";
import { appUrl } from "@/lib/app-url";
import { getOwnerRestaurantId } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import { db } from "@/src/prisma/db";

export async function POST() {
  await connection();
  const restaurantId = await getOwnerRestaurantId();
  if (!restaurantId) {
    return Response.json({ ok: false, error: "Connexion requise." }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      { ok: false, error: "Stripe n’est pas encore configuré." },
      { status: 503 },
    );
  }

  const restaurant = await db.orm.public.Restaurant.where({ id: restaurantId }).first();
  if (!restaurant?.stripeCustomerId) {
    return Response.json(
      { ok: false, error: "Aucun client Stripe pour cet établissement." },
      { status: 400 },
    );
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: restaurant.stripeCustomerId,
    return_url: `${appUrl()}/dashboard`,
  });

  return Response.redirect(portal.url, 303);
}
