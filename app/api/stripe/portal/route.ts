import { connection } from "next/server";
import { appUrl } from "@/lib/app-url";
import { isSameOriginPost } from "@/lib/same-origin";
import { requireOwnerSession } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import { db } from "@/src/prisma/db";

export async function POST(request: Request) {
  await connection();
  if (!isSameOriginPost(request)) {
    return Response.json({ ok: false, error: "Requête refusée." }, { status: 403 });
  }
  const session = await requireOwnerSession();
  if (!session) {
    return Response.json({ ok: false, error: "Connexion requise." }, { status: 401 });
  }
  const restaurantId = session.restaurantId;

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
