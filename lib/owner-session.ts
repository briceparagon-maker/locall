import { createHmac, timingSafeEqual } from "node:crypto";

export const OWNER_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;
const MIN_SECRET_LENGTH = 32;

export function sessionSecret() {
  const secret = process.env.SESSION_SECRET?.trim() ?? "";
  if (secret.length < MIN_SECRET_LENGTH) return null;
  return secret;
}

function sessionPayload(input: {
  restaurantId: number;
  email: string;
  exp: number;
  passwordHash: string;
}) {
  return JSON.stringify([
    input.restaurantId,
    input.email.trim().toLowerCase(),
    input.exp,
    input.passwordHash,
  ]);
}

export function signOwnerSession(
  input: {
    restaurantId: number;
    email: string;
    exp: number;
    passwordHash: string;
  },
  secret: string,
) {
  return createHmac("sha256", secret).update(sessionPayload(input)).digest("base64url");
}

export function verifyOwnerSession(input: {
  restaurantId: number;
  email: string;
  exp: number;
  passwordHash: string;
  signature: string;
  secret: string;
  now?: number;
}) {
  const now = input.now ?? Date.now();
  if (!Number.isInteger(input.restaurantId) || input.restaurantId <= 0) return false;
  if (!input.email.trim() || !input.passwordHash || !input.signature || !input.secret) {
    return false;
  }
  if (!Number.isFinite(input.exp) || input.exp * 1000 <= now) return false;

  const expected = signOwnerSession(input, input.secret);
  const left = Buffer.from(expected);
  const right = Buffer.from(input.signature);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
