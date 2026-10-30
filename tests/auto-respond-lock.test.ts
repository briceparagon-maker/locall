import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

function isolatedUrl() {
  const file = path.join(process.env.TEMP ?? "", "filtravis-isolated", "db-url.txt");
  if (!fs.existsSync(file)) return null;
  const url = fs.readFileSync(file, "utf8").trim();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname !== "127.0.0.1" || parsed.port !== "54329") return null;
  return url;
}

const databaseUrl = isolatedUrl();
let db: AppDb;
let autoRespondToReview: (reviewId: number, restaurantId: number) => Promise<{
  ok: boolean;
  clientEmailed: boolean;
  ownerNotified: boolean;
  autoReplyText: string | null;
}>;
let queue = Promise.resolve();

function serial<T>(fn: () => Promise<T>) {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

test.before(async () => {
  if (!databaseUrl) return;
  const app = await loadApp();
  db = app.db;
  autoRespondToReview = app.autoRespondToReview;
});

test.after(async () => {
  if (db) await db.close();
});

type Call = { role: string };
type AppDb = {
  orm: {
    public: {
      Restaurant: {
        select: (field: "id") => {
          create: (data: Record<string, unknown>) => Promise<{ id: number } | null>;
        };
        where: (where: Record<string, unknown>) => {
          delete: () => Promise<unknown>;
        };
      };
      Review: {
        select: (field: "id") => {
          create: (data: Record<string, unknown>) => Promise<{ id: number } | null>;
        };
        where: (where: Record<string, unknown>) => {
          first: () => Promise<{
            status: string;
            clientEmailed: boolean;
            ownerNotified: boolean;
            autoReplyText: string | null;
            updatedAt: string;
          } | null>;
          update: (data: Record<string, unknown>) => Promise<unknown>;
          delete: () => Promise<unknown>;
        };
      };
    };
  };
  close: () => Promise<void>;
};

async function loadApp() {
  process.env.DIRECT_URL = databaseUrl ?? "";
  process.env.DATABASE_URL = databaseUrl ?? "";
  process.env.RESEND_API_KEY = "re_isolated_not_a_real_key";
  process.env.RESEND_FROM = "FILTRAVIS <onboarding@resend.dev>";
  process.env.GEMINI_API_KEY = "";
  process.env.STRIPE_SECRET_KEY = "";
  process.env.NEXT_PUBLIC_APP_URL = "http://127.0.0.1:3456";
  const [{ db }, { autoRespondToReview }] = await Promise.all([
    import("../src/prisma/db.ts"),
    import("../lib/auto-respond.ts"),
  ]);
  return { db: db as unknown as AppDb, autoRespondToReview };
}

function installFetch(decide: (role: string, attempt: number) => "ok" | "throw") {
  const calls: Call[] = [];
  const seen = new Map<string, number>();
  const original = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const target = String(input instanceof Request ? input.url : input);
    if (!target.includes("api.resend.com")) {
      throw new Error("reseau-externe-bloque");
    }
    const headers = new Headers(input instanceof Request ? input.headers : init?.headers);
    const key = headers.get("idempotency-key") ?? "";
    const role = key.endsWith("-owner") ? "owner" : "client";
    const attempt = (seen.get(role) ?? 0) + 1;
    seen.set(role, attempt);
    calls.push({ role });
    if (decide(role, attempt) === "throw") {
      throw new Error("envoi-refuse");
    }
    return new Response(JSON.stringify({ id: "isolated" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  return {
    calls,
    restore() {
      globalThis.fetch = original;
    },
  };
}

async function seed(db: AppDb, slug: string, contact: string) {
  const restaurant = await db.orm.public.Restaurant.select("id").create({
    name: "Etablissement Verrou",
    ownerEmail: "verrou@example.test",
    slug,
    subscriptionStatus: "active",
    role: "Owner",
  });
  const review = await db.orm.public.Review.select("id").create({
    restaurantId: restaurant!.id,
    rating: 2,
    comment: "Retour isolé suffisant",
    authorName: "Client",
    contact,
    status: "INTERCEPTED",
    clientEmailed: false,
    ownerNotified: false,
  });
  return { restaurantId: restaurant!.id, reviewId: review!.id };
}

async function cleanup(db: AppDb, restaurantId: number) {
  await db.orm.public.Review.where({ restaurantId }).delete();
  await db.orm.public.Restaurant.where({ id: restaurantId }).delete();
}

test("deux appels simultanés n'envoient qu'une notification", { skip: databaseUrl === null }, async () => {
  await serial(async () => {
  const network = installFetch(() => "ok");
  const { restaurantId, reviewId } = await seed(db, "verrou-course-isole", "client-course@example.test");
  try {
    await Promise.all([
      autoRespondToReview(reviewId, restaurantId),
      autoRespondToReview(reviewId, restaurantId),
    ]);
    const row = await db.orm.public.Review.where({ id: reviewId }).first();
    assert.equal(network.calls.filter((call) => call.role === "client").length, 1);
    assert.equal(network.calls.filter((call) => call.role === "owner").length, 1);
    assert.equal(row?.status, "RESOLVED_AUTO");
    assert.equal(row?.clientEmailed, true);
    assert.equal(row?.ownerNotified, true);
  } finally {
    network.restore();
    await cleanup(db, restaurantId);
  }
  });
});

test("un échec d'envoi reste repris sans second envoi client", { skip: databaseUrl === null }, async () => {
  await serial(async () => {
  const network = installFetch((role, attempt) => (role === "owner" && attempt < 4 ? "throw" : "ok"));
  const { restaurantId, reviewId } = await seed(db, "verrou-echec-isole", "client-echec@example.test");
  try {
    const first = await autoRespondToReview(reviewId, restaurantId);
    const afterFailure = await db.orm.public.Review.where({ id: reviewId }).first();
    assert.equal(first.clientEmailed, true);
    assert.equal(first.ownerNotified, false);
    assert.equal(afterFailure?.status, "INTERCEPTED");
    assert.equal(afterFailure?.clientEmailed, true);
    assert.equal(network.calls.filter((call) => call.role === "client").length, 1);
    assert.equal(network.calls.filter((call) => call.role === "owner").length, 3);

    const second = await autoRespondToReview(reviewId, restaurantId);
    const afterRetry = await db.orm.public.Review.where({ id: reviewId }).first();
    assert.equal(second.ownerNotified, true);
    assert.equal(afterRetry?.status, "RESOLVED_AUTO");
    assert.equal(afterRetry?.clientEmailed, true);
    assert.equal(afterRetry?.ownerNotified, true);
    assert.equal(network.calls.filter((call) => call.role === "client").length, 1);
    assert.equal(network.calls.filter((call) => call.role === "owner").length, 4);
  } finally {
    network.restore();
    await cleanup(db, restaurantId);
  }
  });
});

test("une note 4 ne déclenche aucune notification", { skip: databaseUrl === null }, async () => {
  await serial(async () => {
  const network = installFetch(() => "ok");
  const restaurant = await db.orm.public.Restaurant.select("id").create({
    name: "Etablissement Verrou",
    ownerEmail: "verrou@example.test",
    slug: "verrou-note-isole",
    subscriptionStatus: "active",
    role: "Owner",
  });
  const review = await db.orm.public.Review.select("id").create({
    restaurantId: restaurant!.id,
    rating: 4,
    comment: null,
    authorName: "Client",
    contact: "client-note@example.test",
    status: "INTERCEPTED",
    clientEmailed: false,
    ownerNotified: false,
  });
  try {
    const result = await autoRespondToReview(review!.id, restaurant!.id);
    const row = await db.orm.public.Review.where({ id: review!.id }).first();
    assert.equal(result.clientEmailed, false);
    assert.equal(result.ownerNotified, false);
    assert.equal(network.calls.length, 0);
    assert.equal(row?.status, "INTERCEPTED");
  } finally {
    network.restore();
    await cleanup(db, restaurant!.id);
  }
  });
});

test("un secret d'envoi absent laisse l'avis reprisable", { skip: databaseUrl === null }, async () => {
  await serial(async () => {
  process.env.RESEND_API_KEY = "";
  const network = installFetch(() => "ok");
  const { restaurantId, reviewId } = await seed(db, "verrou-secret-isole", "client-secret@example.test");
  try {
    const result = await autoRespondToReview(reviewId, restaurantId);
    const row = await db.orm.public.Review.where({ id: reviewId }).first();
    assert.equal(result.ok, true);
    assert.equal(result.clientEmailed, false);
    assert.equal(result.ownerNotified, false);
    assert.equal(network.calls.length, 0);
    assert.equal(row?.status, "INTERCEPTED");
    assert.equal((row?.autoReplyText ?? "").length > 0, true);
  } finally {
    process.env.RESEND_API_KEY = "re_isolated_not_a_real_key";
    network.restore();
    await cleanup(db, restaurantId);
  }
  });
});
