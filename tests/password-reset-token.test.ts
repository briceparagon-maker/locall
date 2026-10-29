import assert from "node:assert/strict";
import test from "node:test";
import {
  createResetNonce,
  hashResetNonce,
  passwordResetSecret,
  resetTokenClaimsValid,
  signResetToken,
} from "../lib/password-reset-token.ts";

const secret = "c".repeat(48);
const now = Date.parse("2026-10-29T12:00:00Z");
const email = "a@example.com";
const passwordHash = "hash-a";
const nonce = createResetNonce();
const exp = now + 60 * 60 * 1000;

function claims(overrides: Partial<Parameters<typeof resetTokenClaimsValid>[0]> = {}) {
  const signature = signResetToken(email, exp, passwordHash, nonce, secret);
  return {
    email,
    exp,
    passwordHash,
    nonce,
    signature,
    storedNonceHash: hashResetNonce(nonce),
    secret,
    now,
    ...overrides,
  };
}

test("un jeton valide est accepté une fois", () => {
  assert.equal(resetTokenClaimsValid(claims()), true);
  assert.equal(resetTokenClaimsValid(claims({ storedNonceHash: null })), false);
});

test("sans secret, aucun jeton n'est valide", () => {
  const previous = process.env.PASSWORD_RESET_SECRET;
  delete process.env.PASSWORD_RESET_SECRET;
  assert.equal(passwordResetSecret(), null);
  process.env.PASSWORD_RESET_SECRET = "court";
  assert.equal(passwordResetSecret(), null);
  if (previous === undefined) delete process.env.PASSWORD_RESET_SECRET;
  else process.env.PASSWORD_RESET_SECRET = previous;

  assert.equal(resetTokenClaimsValid(claims({ secret: "" })), false);
});

test("une signature invalide est refusée", () => {
  assert.equal(resetTokenClaimsValid(claims({ signature: "0".repeat(64) })), false);
});

test("un lien expiré est refusé", () => {
  assert.equal(resetTokenClaimsValid(claims({ now: exp + 1 })), false);
});

test("un lien déjà consommé est refusé", () => {
  assert.equal(resetTokenClaimsValid(claims({ storedNonceHash: hashResetNonce("autre") })), false);
});

test("un nouveau mot de passe révoque l'ancien lien", () => {
  assert.equal(resetTokenClaimsValid(claims({ passwordHash: "hash-b" })), false);
});
