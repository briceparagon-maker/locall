import { connection } from "next/server";
import { appUrl } from "@/lib/app-url";
import { normalizeSubscriptionStatus } from "@/lib/billing";
import { getOwnerRestaurantId } from "@/lib/session";
import { getStripe, stripePriceId } from "@/lib/stripe";
import { db } from "@/src/prisma/db";

export async function POST() {
  await connection();
  const restaurantId = await getOwnerRestaurantId();
  if (!restaurantId) {
    return Response.json({ ok: false, error: "Connexion requise." }, { status: 401 });
  }

  const stripe = getStripe();
  const priceId = stripePriceId();
  if (!stripe || !priceId) {
    return Response.json(
      { ok: false, error: "Stripe n’est pas encore configuré." },
      { status: 503 },
    );
  }

  const restaurant = await db.orm.public.Restaurant.where({ id: restaurantId }).first();
  if (!restaurant) {
    return Response.json({ ok: false, error: "Établissement introuvable." }, { status: 404 });
  }

  if (
    normalizeSubscriptionStatus(restaurant.subscriptionStatus) ===
    "pending_activation"
  ) {
    return Response.redirect(new URL("/dashboard", appUrl()), 303);
  }

  let customerId = restaurant.stripeCustomerId ?? undefined;
  if (!customerId && restaurant.ownerEmail) {
    const customer = await stripe.customers.create({
      email: restaurant.ownerEmail,
      name: restaurant.name,
      metadata: { restaurantId: String(restaurant.id) },
    });
    customerId = customer.id;
    await db.orm.public.Restaurant.where({ id: restaurant.id }).update({
      stripeCustomerId: customerId,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    customer_email: customerId ? undefined : restaurant.ownerEmail ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl()}/dashboard?billing=success`,
    cancel_url: `${appUrl()}/dashboard?billing=cancel`,
    client_reference_id: String(restaurant.id),
    metadata: { restaurantId: String(restaurant.id) },
    subscription_data: {
      metadata: { restaurantId: String(restaurant.id) },
    },
  });

  if (!session.url) {
    return Response.json({ ok: false, error: "Session Stripe invalide." }, { status: 500 });
  }

  return Response.redirect(session.url, 303);
}
