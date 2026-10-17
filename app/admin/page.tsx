import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/admin";
import { normalizeSubscriptionStatus, trialDaysLeft } from "@/lib/billing";
import { getOwnerEmail } from "@/lib/session";
import { db } from "@/src/prisma/db";
import { AdminDashboard, type AdminRestaurant, type AdminReview } from "./admin-dashboard";

export default async function AdminPage() {
  await connection();
  const email = await getOwnerEmail();
  if (!email) redirect("/connexion");

  const restaurants = await db.orm.public.Restaurant.all();
  const reviews = await db.orm.public.Review.all();
  const me = restaurants.find(
    (row) => row.ownerEmail?.trim().toLowerCase() === email,
  );
  if (!isSuperAdmin(email, me?.role)) {
    redirect("/dashboard");
  }

  const intercepted = reviews.filter((row) => row.rating >= 1 && row.rating <= 3);
  const signedUp = restaurants.filter((row) => row.ownerEmail);
  const active = signedUp.filter(
    (row) => normalizeSubscriptionStatus(row.subscriptionStatus) === "active",
  ).length;
  const conversionRate =
    signedUp.length === 0 ? 0 : Math.round((active / signedUp.length) * 100);

  const directory: AdminRestaurant[] = signedUp
    .map((row) => ({
      id: row.id,
      name: row.name,
      ownerEmail: row.ownerEmail,
      ownerFirstName: row.ownerFirstName,
      ownerLastName: row.ownerLastName,
      ownerStatus: row.ownerStatus,
      city: row.city,
      slug: row.slug,
      subscriptionStatus: normalizeSubscriptionStatus(row.subscriptionStatus),
      trialDaysLeft: trialDaysLeft(row.trialEndsAt),
      trialEndsAt: row.trialEndsAt,
      createdAt: String(row.createdAt),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const journal: AdminReview[] = intercepted
    .map((row) => {
      const restaurant = restaurants.find((item) => item.id === row.restaurantId);
      return {
        id: row.id,
        createdAt: String(row.createdAt),
        rating: row.rating,
        comment: row.comment,
        restaurantName: restaurant?.name ?? `Établissement #${row.restaurantId}`,
        restaurantId: row.restaurantId,
        status: row.status,
      };
    })
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <AdminDashboard
      metrics={{
        establishments: signedUp.length,
        intercepted: intercepted.length,
        conversionRate,
        active,
      }}
      restaurants={directory}
      reviews={journal}
    />
  );
}
