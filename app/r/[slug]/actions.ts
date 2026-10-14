"use server";

import { autoRespondToReview } from "@/lib/auto-respond";
import { db } from "@/src/prisma/db";

function optionalRating(value: FormDataEntryValue | null) {
  const rating = Number(value);
  return [1, 2, 3, 4, 5].includes(rating) ? rating : null;
}

export async function submitManagerFeedback(formData: FormData) {
  const restaurantId = Number(formData.get("restaurantId"));
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim() || null;
  const contact = String(formData.get("contact") ?? "").trim() || null;
  const visitMonth = Number(formData.get("visitMonth"));
  const visitYear = Number(formData.get("visitYear"));
  const cuisineRating = optionalRating(formData.get("cuisineRating"));
  const serviceRating = optionalRating(formData.get("serviceRating"));
  const ambianceRating = optionalRating(formData.get("ambianceRating"));

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return { ok: false as const, error: "Établissement introuvable." };
  }

  if (![1, 2, 3].includes(rating)) {
    return { ok: false as const, error: "Note interne invalide." };
  }

  if (comment.length < 5) {
    return {
      ok: false as const,
      error: "Merci de décrire votre expérience en quelques mots.",
    };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const hasVisitDate =
    Number.isInteger(visitMonth) &&
    visitMonth >= 1 &&
    visitMonth <= 12 &&
    Number.isInteger(visitYear) &&
    visitYear >= currentYear - 8 &&
    visitYear <= currentYear;

  if (hasVisitDate && (visitYear > currentYear || (visitYear === currentYear && visitMonth > currentMonth))) {
    return { ok: false as const, error: "La date de visite ne peut pas être dans le futur." };
  }

  const created = await db.orm.public.Review.select("id").create({
    restaurantId,
    rating,
    comment,
    authorName,
    contact,
    cuisineRating,
    serviceRating,
    ambianceRating,
    visitMonth: hasVisitDate ? visitMonth : null,
    visitYear: hasVisitDate ? visitYear : null,
    status: "INTERCEPTED",
    clientEmailed: false,
    ownerNotified: false,
  });

  if (created?.id) {
    await autoRespondToReview(created.id);
  }

  return { ok: true as const };
}

export async function trackGooglePublish(restaurantId: number, rating: number) {
  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return { ok: false as const };
  }
  if (![4, 5].includes(rating)) {
    return { ok: false as const };
  }

  await db.orm.public.Review.create({
    restaurantId,
    rating,
    comment: null,
    authorName: "Client",
    contact: null,
    cuisineRating: null,
    serviceRating: null,
    ambianceRating: null,
    visitMonth: null,
    visitYear: null,
    status: "GOOGLE_PUSHED",
    clientEmailed: false,
    ownerNotified: false,
  });

  return { ok: true as const };
}
