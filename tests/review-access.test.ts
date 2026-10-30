import assert from "node:assert/strict";
import test from "node:test";
import {
  channelsToSend,
  deliveryComplete,
  isInterceptedRating,
  reviewBelongsToRestaurant,
  statusAfterDelivery,
} from "../lib/review-access.ts";

test("l'établissement A ne traite pas l'avis de B", () => {
  assert.equal(reviewBelongsToRestaurant(2, 1), false);
  assert.equal(reviewBelongsToRestaurant(1, 1), true);
});

test("les notes 1 à 3 restent interceptées et les notes 4 et 5 non", () => {
  assert.equal(isInterceptedRating(1), true);
  assert.equal(isInterceptedRating(2), true);
  assert.equal(isInterceptedRating(3), true);
  assert.equal(isInterceptedRating(4), false);
  assert.equal(isInterceptedRating(5), false);
});

test("un avis déjà notifié n'est pas renvoyé", () => {
  assert.equal(
    deliveryComplete({
      status: "RESOLVED_AUTO",
      clientRequired: true,
      ownerRequired: true,
      clientEmailed: true,
      ownerNotified: true,
    }),
    true,
  );
  assert.equal(
    deliveryComplete({
      status: "INTERCEPTED",
      clientRequired: true,
      ownerRequired: true,
      clientEmailed: false,
      ownerNotified: false,
    }),
    false,
  );
});

test("une notification partielle reste à reprendre, sans renvoyer le canal déjà accepté", () => {
  assert.deepEqual(
    channelsToSend({
      clientRequired: true,
      ownerRequired: true,
      clientEmailed: true,
      ownerNotified: false,
    }),
    { sendClient: false, sendOwner: true },
  );
  assert.equal(
    deliveryComplete({
      status: "RESOLVED_AUTO",
      clientRequired: true,
      ownerRequired: true,
      clientEmailed: true,
      ownerNotified: false,
    }),
    false,
  );
});

test("un échec d'envoi rend l'avis intercepté et un succès complet le clôt", () => {
  assert.deepEqual(
    statusAfterDelivery({
      clientRequired: true,
      ownerRequired: true,
      clientEmailed: false,
      ownerNotified: false,
    }),
    { complete: false, status: "INTERCEPTED" },
  );
  assert.deepEqual(
    statusAfterDelivery({
      clientRequired: true,
      ownerRequired: true,
      clientEmailed: true,
      ownerNotified: false,
    }),
    { complete: false, status: "INTERCEPTED" },
  );
  assert.deepEqual(
    statusAfterDelivery({
      clientRequired: true,
      ownerRequired: true,
      clientEmailed: true,
      ownerNotified: true,
    }),
    { complete: true, status: "RESOLVED_AUTO" },
  );
  assert.deepEqual(
    statusAfterDelivery({
      clientRequired: false,
      ownerRequired: false,
      clientEmailed: false,
      ownerNotified: false,
    }),
    { complete: true, status: "RESOLVED_AUTO" },
  );
});
