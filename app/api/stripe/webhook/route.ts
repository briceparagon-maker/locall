import { connection } from "next/server";
import type Stripe from "stripe";
import {
  markRestaurantActive,
  markRestaurantCancelled,
} from "@/lib/activate-subscription";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  await connection();
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !webhookSecret) {
    return Response.json({ ok: false, error: "Webhook Stripe non configuré." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ ok: false, error: "Signature manquante." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("stripe webhook signature:", error);
    return Response.json({ ok: false, error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const restaurantId = Number(session.metadata?.restaurantId || session.client_reference_id);
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;
    await markRestaurantActive({
      restaurantId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      sendEmail: true,
    });
  }

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const restaurantId = Number(subscription.metadata?.restaurantId);
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    await markRestaurantActive({
      restaurantId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      sendEmail: false,
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    if (subscription.status === "canceled" || subscription.status === "unpaid") {
      await markRestaurantCancelled({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
      });
    } else if (subscription.status === "active" || subscription.status === "trialing") {
      await markRestaurantActive({
        restaurantId: Number(subscription.metadata?.restaurantId),
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        sendEmail: false,
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    await markRestaurantCancelled({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
    });
  }

  return Response.json({ received: true });
}
