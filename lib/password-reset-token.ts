import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const MIN_SECRET_LENGTH = 32;
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export function passwordResetSecret() {
  const secret = process.env.PASSWORD_RESET_SECRET?.trim() ?? "";
  if (secret.length < MIN_SECRET_LENGTH) return null;
  return secret;
}

export function createResetNonce() {
  return randomBytes(32).toString("base64url");
}

export function hashResetNonce(nonce: string) {
  return createHash("sha256").update(nonce).digest("hex");
}

function resetPayload(email: string, exp: number, passwordHash: string, nonce: string) {
  return JSON.stringify([email.trim().toLowerCase(), exp, passwordHash, nonce]);
}

export function signResetToken(
  email: string,
  exp: number,
  passwordHash: string,
  nonce: string,
  secret: string,
) {
  return createHmac("sha256", secret)
    .update(resetPayload(email, exp, passwordHash, nonce))
    .digest("hex");
}

export function resetTokenClaimsValid(input: {
  email: string;
  exp: number;
  passwordHash: string;
  nonce: string;
  signature: string;
  storedNonceHash: string | null;
  secret: string;
  now?: number;
}) {
  const now = input.now ?? Date.now();
  if (!input.secret || !input.nonce || !input.signature || !input.passwordHash) return false;
  if (!input.storedNonceHash) return false;
  if (!Number.isFinite(input.exp) || input.exp <= now) return false;

  const nonceHash = hashResetNonce(input.nonce);
  const stored = Buffer.from(input.storedNonceHash);
  const actual = Buffer.from(nonceHash);
  if (stored.length !== actual.length || !timingSafeEqual(stored, actual)) return false;

  const expected = signResetToken(
    input.email,
    input.exp,
    input.passwordHash,
    input.nonce,
    input.secret,
  );
  const left = Buffer.from(expected);
  const right = Buffer.from(input.signature);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
