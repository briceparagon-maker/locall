import assert from "node:assert/strict";
import test from "node:test";
import {
  autoRespondAlreadySent,
  isInterceptedRating,
  reviewBelongsToRestaurant,
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
    autoRespondAlreadySent({
      status: "RESOLVED_AUTO",
      clientEmailed: true,
      ownerNotified: false,
    }),
    true,
  );
  assert.equal(
    autoRespondAlreadySent({
      status: "INTERCEPTED",
      clientEmailed: false,
      ownerNotified: false,
    }),
    false,
  );
});
