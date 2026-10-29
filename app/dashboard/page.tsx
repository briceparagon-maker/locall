import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isBackofficeOwner } from "@/lib/admin";
import { appUrl } from "@/lib/app-url";
import { normalizeSubscriptionStatus, trialDaysLeft } from "@/lib/billing";
import { qrPngDataUrl } from "@/lib/qr";
import { requireOwnerSession } from "@/lib/session";
import { db } from "@/src/prisma/db";
import { DashboardClient, type ComplaintRow } from "./dashboard-client";

export const instant = false;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  await connection();
  const params = await searchParams;

  const session = await requireOwnerSession();
  if (!session) redirect("/connexion");

  const restaurant = session.restaurant;

  if (!restaurant) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6 text-locall-navy">
        Aucun établissement n’est encore enregistré.
      </div>
    );
  }

  const reviews = await db.orm.public.Review.where({
    restaurantId: restaurant.id,
  }).all();
  reviews.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const googlePushed = reviews.filter(
    (row) => row.status === "GOOGLE_PUSHED" || row.rating >= 4,
  ).length;
  const interceptedReviews = reviews.filter(
    (row) => row.rating >= 1 && row.rating <= 3,
  );
  const intercepted = interceptedReviews.length;
  const overall =
    intercepted === 0
      ? "—"
      : (
          interceptedReviews.reduce((sum, row) => sum + row.rating, 0) /
          intercepted
        ).toFixed(1);
  const protectionRate = intercepted === 0 ? 0 : 100;

  const subscriptionStatus = normalizeSubscriptionStatus(
    restaurant.subscriptionStatus,
  );
  const slug = restaurant.slug ?? String(restaurant.id);
  const reviewUrl = `${appUrl()}/r/${slug}`;
  const qrDataUrl = await qrPngDataUrl(reviewUrl, 2048);

  const complaints: ComplaintRow[] = reviews
    .filter((row) => row.rating <= 3)
    .map((row) => ({
      id: row.id,
      createdAt: String(row.createdAt),
      rating: row.rating,
      comment: row.comment,
      authorName: row.authorName,
      contact: row.contact,
      cuisineRating: row.cuisineRating,
      serviceRating: row.serviceRating,
      ambianceRating: row.ambianceRating,
      status: row.status,
      autoReplyText: row.autoReplyText,
      clientEmailed: Boolean(row.clientEmailed),
      ownerNotified: Boolean(row.ownerNotified),
    }));

  return (
    <DashboardClient
      restaurantId={restaurant.id}
      restaurantName={restaurant.name}
      slug={slug}
      qrDataUrl={qrDataUrl}
      reviewUrl={reviewUrl}
      googlePlaceUrl={restaurant.googlePlaceUrl?.trim() || ""}
      facebookReviewUrl={restaurant.facebookReviewUrl?.trim() || ""}
      autoRespondGooglePositive={Boolean(restaurant.autoRespondGooglePositive)}
      isAdmin={isBackofficeOwner(restaurant.ownerEmail) && isBackofficeOwner(session.email)}
      subscriptionStatus={subscriptionStatus}
      trialDaysLeft={
        subscriptionStatus === "pending_activation"
          ? null
          : trialDaysLeft(restaurant.trialEndsAt)
      }
      billingNotice={
        params.billing === "success"
          ? "Paiement reçu. Votre abonnement sera activé dès confirmation Stripe."
          : params.billing === "cancel"
            ? "Paiement annulé. Vous pouvez réessayer quand vous voulez."
            : null
      }
      kpis={{
        overall,
        googlePushed,
        intercepted,
        protectionRate,
      }}
      complaints={complaints}
    />
  );
}
