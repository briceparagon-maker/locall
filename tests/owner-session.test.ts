import assert from "node:assert/strict";
import test from "node:test";
import {
  signOwnerSession,
  verifyOwnerSession,
} from "../lib/owner-session.ts";

const secret = "a".repeat(48);
const otherSecret = "b".repeat(48);
const now = Date.parse("2026-10-29T12:00:00Z");
const exp = Math.floor(now / 1000) + 60 * 60;

const accountA = {
  restaurantId: 1,
  email: "a@example.com",
  exp,
  passwordHash: "hash-a",
};

function signatureFor(account: typeof accountA, key = secret) {
  return signOwnerSession(account, key);
}

test("une session légitime est acceptée", () => {
  const signature = signatureFor(accountA);
  assert.equal(
    verifyOwnerSession({ ...accountA, signature, secret, now }),
    true,
  );
});

test("un cookie d'identifiant modifié est refusé", () => {
  const signature = signatureFor(accountA);
  assert.equal(
    verifyOwnerSession({
      ...accountA,
      restaurantId: 2,
      signature,
      secret,
      now,
    }),
    false,
  );
});

test("la session de l'établissement A ne vaut pas pour B", () => {
  const signature = signatureFor(accountA);
  assert.equal(
    verifyOwnerSession({
      restaurantId: 2,
      email: "b@example.com",
      exp,
      passwordHash: "hash-b",
      signature,
      secret,
      now,
    }),
    false,
  );
});

test("une signature incomplète ou falsifiée est refusée", () => {
  assert.equal(
    verifyOwnerSession({ ...accountA, signature: "", secret, now }),
    false,
  );
  assert.equal(
    verifyOwnerSession({ ...accountA, signature: "faux", secret, now }),
    false,
  );
  assert.equal(
    verifyOwnerSession({
      ...accountA,
      signature: signatureFor(accountA, otherSecret),
      secret,
      now,
    }),
    false,
  );
});

test("une session expirée est refusée", () => {
  const signature = signatureFor(accountA);
  assert.equal(
    verifyOwnerSession({
      ...accountA,
      signature,
      secret,
      now: (exp + 1) * 1000,
    }),
    false,
  );
});

test("un changement de mot de passe révoque la session", () => {
  const signature = signatureFor(accountA);
  assert.equal(
    verifyOwnerSession({
      ...accountA,
      passwordHash: "hash-a-nouveau",
      signature,
      secret,
      now,
    }),
    false,
  );
});
