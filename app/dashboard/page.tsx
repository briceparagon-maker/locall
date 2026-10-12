import { connection } from "next/server";
import QRCode from "qrcode";
import { appUrl } from "@/lib/app-url";
import { db } from "@/src/prisma/db";
import { DashboardClient, type ComplaintRow } from "./dashboard-client";

export default async function DashboardPage() {
  await connection();

  const restaurants = await db.orm.public.Restaurant.all();
  const restaurant =
    restaurants.find((row) => row.slug === "le-petit-comptoir") ??
    restaurants[0];

  if (!restaurant) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f4f6f8] p-6 text-slate-700">
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
  const intercepted = reviews.filter((row) => row.rating <= 3).length;
  const rated = reviews.filter((row) => row.rating >= 1);
  const overall =
    rated.length === 0
      ? "—"
      : (
          rated.reduce((sum, row) => sum + row.rating, 0) / rated.length
        ).toFixed(1);
  const protectionRate = intercepted === 0 ? 0 : 100;

  const slug = restaurant.slug ?? String(restaurant.id);
  const reviewUrl = `${appUrl()}/r/${slug}`;
  const qrDataUrl = await QRCode.toDataURL(reviewUrl, {
    width: 640,
    margin: 2,
    color: { dark: "#0f766e", light: "#ffffff" },
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
      restaurantName={restaurant.name}
      slug={slug}
      qrDataUrl={qrDataUrl}
      reviewUrl={reviewUrl}
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
