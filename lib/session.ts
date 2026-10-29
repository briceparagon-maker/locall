import { cookies } from "next/headers";
import {
  OWNER_SESSION_MAX_AGE_SEC,
  sessionSecret,
  signOwnerSession,
  verifyOwnerSession,
} from "@/lib/owner-session";
import { db } from "@/src/prisma/db";

const ID_COOKIE = "locall_restaurant_id";
const EMAIL_COOKIE = "locall_owner_email";
const EXP_COOKIE = "locall_owner_exp";
const SIG_COOKIE = "locall_owner_sig";

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OWNER_SESSION_MAX_AGE_SEC,
  };
}

export async function setOwnerSession(
  restaurantId: number,
  email: string,
  passwordHash: string,
) {
  const secret = sessionSecret();
  if (!secret) {
    console.error("SESSION_SECRET manquant");
    return false;
  }

  const normalized = email.trim().toLowerCase();
  const exp = Math.floor(Date.now() / 1000) + OWNER_SESSION_MAX_AGE_SEC;
  const store = await cookies();
  const options = cookieOptions();
  store.set(ID_COOKIE, String(restaurantId), options);
  store.set(EMAIL_COOKIE, normalized, options);
  store.set(EXP_COOKIE, String(exp), options);
  store.set(
    SIG_COOKIE,
    signOwnerSession(
      { restaurantId, email: normalized, exp, passwordHash },
      secret,
    ),
    options,
  );
  return true;
}

export async function requireOwnerSession() {
  const secret = sessionSecret();
  if (!secret) {
    console.error("SESSION_SECRET manquant");
    return null;
  }

  const store = await cookies();
  const restaurantId = Number(store.get(ID_COOKIE)?.value);
  const email = store.get(EMAIL_COOKIE)?.value?.trim().toLowerCase() ?? "";
  const exp = Number(store.get(EXP_COOKIE)?.value);
  const signature = store.get(SIG_COOKIE)?.value ?? "";
  if (!email || !signature || !Number.isInteger(restaurantId) || restaurantId <= 0) {
    return null;
  }

  const restaurant = await db.orm.public.Restaurant.where({ id: restaurantId }).first();
  if (!restaurant?.passwordHash || !restaurant.ownerEmail) return null;

  const ownerEmail = restaurant.ownerEmail.trim().toLowerCase();
  if (ownerEmail !== email) return null;

  const valid = verifyOwnerSession({
    restaurantId,
    email,
    exp,
    passwordHash: restaurant.passwordHash,
    signature,
    secret,
  });
  if (!valid) return null;

  return { restaurantId, email, restaurant };
}

export async function getOwnerRestaurantId() {
  return (await requireOwnerSession())?.restaurantId ?? null;
}

export async function getOwnerEmail() {
  return (await requireOwnerSession())?.email ?? null;
}

export async function clearOwnerSession() {
  const store = await cookies();
  store.delete(ID_COOKIE);
  store.delete(EMAIL_COOKIE);
  store.delete(EXP_COOKIE);
  store.delete(SIG_COOKIE);
}
