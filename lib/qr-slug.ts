import { db } from "@/src/prisma/db";

const SLUG_MAX = 160;

export function qrSlugToken(value: unknown) {
  const slug = String(value ?? "").trim();
  if (!slug || slug.length > SLUG_MAX) return null;
  if (/[\u0000-\u001f\s/\\?#]/.test(slug)) return null;
  return slug;
}

export function declaredRestaurantId(value: unknown) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  if (!/^[1-9]\d{0,8}$/.test(text)) return "invalid" as const;
  return Number(text);
}

export async function restaurantFromQrSlug(value: unknown) {
  const slug = qrSlugToken(value);
  if (!slug) return null;

  const bySlug = await db.orm.public.Restaurant.where({ slug }).first();
  if (bySlug) return bySlug;

  if (!/^[1-9]\d{0,8}$/.test(slug)) return null;
  const byId = await db.orm.public.Restaurant.where({ id: Number(slug) }).first();
  if (!byId) return null;
  const ownSlug = byId.slug?.trim() ?? "";
  if (ownSlug && ownSlug !== slug) return null;
  return byId;
}

export async function resolveQrRestaurant(slugValue: unknown, declaredValue: unknown) {
  const restaurant = await restaurantFromQrSlug(slugValue);
  if (!restaurant) {
    return { ok: false as const, error: "Établissement introuvable." };
  }

  const declared = declaredRestaurantId(declaredValue);
  if (declared === "invalid" || (typeof declared === "number" && declared !== restaurant.id)) {
    return { ok: false as const, error: "Établissement introuvable." };
  }

  return { ok: true as const, restaurant };
}
