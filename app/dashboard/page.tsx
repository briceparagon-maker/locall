import { connection } from "next/server";
import QRCode from "qrcode";
import { appUrl } from "@/lib/app-url";
import { getOwnerRestaurantId } from "@/lib/session";
import { db } from "@/src/prisma/db";
import { DashboardClient, type ComplaintRow } from "./dashboard-client";

export default async function DashboardPage() {
  await connection();

  const restaurants = await db.orm.public.Restaurant.all();
  const sessionRestaurantId = await getOwnerRestaurantId();
  const restaurant =
    restaurants.find((row) => row.id === sessionRestaurantId) ??
    restaurants.find((row) => row.slug === "le-petit-comptoir") ??
    restaurants[0];

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

  const slug = restaurant.slug ?? String(restaurant.id);
  const reviewUrl = `${appUrl()}/r/${slug}`;
  const qrDataUrl = await QRCode.toDataURL(reviewUrl, {
    width: 640,
    margin: 2,
    color: { dark: "#0A192F", light: "#ffffff" },
  });

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
      autoRespondGooglePositive={Boolean(restaurant.autoRespondGooglePositive)}
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
