"use server";

import { revalidatePath } from "next/cache";
import { backofficeAllowed } from "@/lib/backoffice-guard";
import {
  normalizeSubscriptionStatus,
  trialDaysLeft,
  trialEndsInFourteenDays,
} from "@/lib/billing";
import { db } from "@/src/prisma/db";

async function requireSuperAdmin() {
  return backofficeAllowed();
}

function addDays(from: Date, days: number) {
  const next = new Date(from.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export async function extendTrial(formData: FormData) {
  if (!(await requireSuperAdmin())) return;
  const id = Number(formData.get("restaurantId"));
  if (!Number.isInteger(id) || id <= 0) return;

  const restaurant = await db.orm.public.Restaurant.where({ id }).first();
  if (!restaurant) return;

  const currentEnd = restaurant.trialEndsAt ? new Date(restaurant.trialEndsAt) : null;
  const base =
    currentEnd && !Number.isNaN(currentEnd.getTime()) && currentEnd.getTime() > Date.now()
      ? currentEnd
      : new Date();
  const status = normalizeSubscriptionStatus(restaurant.subscriptionStatus);

  await db.orm.public.Restaurant.where({ id }).update({
    trialEndsAt: addDays(base, 7).toISOString(),
    subscriptionStatus: status === "active" ? "active" : "trialing",
  });
  revalidatePath("/backoffice-secret-filtravis-1324");
}

export async function toggleQr(formData: FormData) {
  if (!(await requireSuperAdmin())) return;
  const id = Number(formData.get("restaurantId"));
  if (!Number.isInteger(id) || id <= 0) return;

  const restaurant = await db.orm.public.Restaurant.where({ id }).first();
  if (!restaurant) return;

  const status = normalizeSubscriptionStatus(restaurant.subscriptionStatus);
  const days = trialDaysLeft(restaurant.trialEndsAt);
  const live = status === "active" || (status === "trialing" && (days ?? 0) > 0);

  if (live) {
    await db.orm.public.Restaurant.where({ id }).update({
      subscriptionStatus: "pending_activation",
    });
  } else if (restaurant.stripeSubscriptionId) {
    await db.orm.public.Restaurant.where({ id }).update({
      subscriptionStatus: "active",
    });
  } else {
    const end = restaurant.trialEndsAt ? new Date(restaurant.trialEndsAt) : null;
    const trialEndsAt =
      end && !Number.isNaN(end.getTime()) && end.getTime() > Date.now()
        ? end.toISOString()
        : trialEndsInFourteenDays();
    await db.orm.public.Restaurant.where({ id }).update({
      subscriptionStatus: "trialing",
      trialEndsAt,
    });
  }
  revalidatePath("/backoffice-secret-filtravis-1324");
}
