import assert from "node:assert/strict";
import test from "node:test";
import { isSameOriginPost } from "../lib/same-origin.ts";

test("un formulaire du même site est accepté", () => {
  const request = new Request("http://localhost:3000/api/stripe/portal", {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      host: "localhost:3000",
    },
  });
  assert.equal(isSameOriginPost(request), true);
});

test("une origine externe est refusée", () => {
  const request = new Request("http://localhost:3000/api/auto-respond", {
    method: "POST",
    headers: {
      origin: "https://example.invalid",
      host: "localhost:3000",
    },
  });
  assert.equal(isSameOriginPost(request), false);
});

test("une requête sans origine est refusée", () => {
  const request = new Request("http://localhost:3000/api/auto-respond", {
    method: "POST",
    headers: { host: "localhost:3000" },
  });
  assert.equal(isSameOriginPost(request), false);
});
