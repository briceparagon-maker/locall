import { connection } from "next/server";
import { redirect } from "next/navigation";
import { backofficeAllowed } from "@/lib/backoffice-guard";
import { normalizeSubscriptionStatus, trialDaysLeft } from "@/lib/billing";
import { getOwnerEmail } from "@/lib/session";
import { db } from "@/src/prisma/db";
import { AdminDashboard, type AdminRestaurant } from "./admin-dashboard";

export const instant = false;

export default async function AdminPage() {
  await connection();
  if (!(await backofficeAllowed())) {
    redirect((await getOwnerEmail()) ? "/dashboard" : "/connexion");
  }

  const restaurants = await db.orm.public.Restaurant.all();
  const reviews = await db.orm.public.Review.all();

  const intercepted = reviews.filter((row) => row.rating >= 1 && row.rating <= 3);
  const signedUp = restaurants.filter((row) => row.ownerEmail);

  const directory: AdminRestaurant[] = signedUp
    .map((row) => {
      const subscriptionStatus = normalizeSubscriptionStatus(row.subscriptionStatus);
      const daysLeft = trialDaysLeft(row.trialEndsAt);
      const type = establishmentType(row.ownerStatus);
      const qrActive =
        subscriptionStatus === "active" ||
        (subscriptionStatus === "trialing" && (daysLeft ?? 0) > 0);
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        type,
        qrActive,
        trialDaysLeft: daysLeft,
        seoEnabled: Boolean(row.autoRespondGooglePositive),
        subscriptionStatus,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const trialing = directory.filter(
    (row) => row.subscriptionStatus === "trialing" && (row.trialDaysLeft ?? 0) > 0,
  ).length;
  const subscribers2490 = directory.filter(
    (row) => row.subscriptionStatus === "active" && row.type === "Indépendant",
  ).length;
  const subscribers20 = directory.filter(
    (row) => row.subscriptionStatus === "active" && row.type === "Franchisé",
  ).length;

  return (
    <AdminDashboard
      metrics={{
        trialing,
        subscribers2490,
        subscribers20,
        intercepted: intercepted.length,
      }}
      restaurants={directory}
    />
  );
}

function establishmentType(ownerStatus: string | null) {
  const value = (ownerStatus ?? "")
    .toLowerCase()
    .replaceAll("é", "e")
    .replaceAll("è", "e")
    .replaceAll("ê", "e");
  if (value.startsWith("independant")) return "Indépendant" as const;
  if (value.startsWith("franchiseur")) return "Franchiseur" as const;
  if (value.startsWith("franchise")) return "Franchisé" as const;
  return "—" as const;
}
