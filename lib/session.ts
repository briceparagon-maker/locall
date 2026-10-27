import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ID_COOKIE = "locall_restaurant_id";
const EMAIL_COOKIE = "locall_owner_email";
const SIG_COOKIE = "locall_owner_sig";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export function ownerSessionSignature(restaurantId: number, email: string, passwordHash: string) {
  return createHmac("sha256", passwordHash)
    .update(`${restaurantId}:${email.trim().toLowerCase()}`)
    .digest("base64url");
}

export function ownerSignatureMatches(
  restaurantId: number,
  email: string,
  passwordHash: string,
  signature: string,
) {
  const expected = ownerSessionSignature(restaurantId, email, passwordHash);
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function setOwnerSession(restaurantId: number, email: string, passwordHash: string) {
  const normalized = email.trim().toLowerCase();
  const store = await cookies();
  store.set(ID_COOKIE, String(restaurantId), cookieOptions);
  store.set(EMAIL_COOKIE, normalized, cookieOptions);
  store.set(SIG_COOKIE, ownerSessionSignature(restaurantId, normalized, passwordHash), cookieOptions);
}

export async function getOwnerRestaurantId() {
  const store = await cookies();
  const id = Number(store.get(ID_COOKIE)?.value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function getOwnerEmail() {
  const store = await cookies();
  const email = store.get(EMAIL_COOKIE)?.value?.trim().toLowerCase() ?? "";
  return email || null;
}

export async function getOwnerSignature() {
  const store = await cookies();
  return store.get(SIG_COOKIE)?.value ?? "";
}

export async function clearOwnerSession() {
  const store = await cookies();
  store.delete(ID_COOKIE);
  store.delete(EMAIL_COOKIE);
  store.delete(SIG_COOKIE);
}
