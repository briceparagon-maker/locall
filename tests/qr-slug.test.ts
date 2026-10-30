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

type ReviewRow = { id: number; restaurantId: number; comment: string | null; rating: number; status: string };
type AppDb = {
  orm: {
    public: {
      Restaurant: {
        select: (field: "id") => {
          create: (data: Record<string, unknown>) => Promise<{ id: number } | null>;
        };
        where: (where: Record<string, unknown>) => {
          first: () => Promise<{ id: number } | null>;
          delete: () => Promise<unknown>;
          update: (data: Record<string, unknown>) => Promise<unknown>;
        };
      };
      Review: {
        where: (where: Record<string, unknown>) => {
          all: () => Promise<ReviewRow[]>;
          delete: () => Promise<unknown>;
        };
      };
    };
  };
  close: () => Promise<void>;
};

let db: AppDb;
let submitManagerFeedback: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
let trackGooglePublish: (
  slug: string,
  rating: number,
  declaredRestaurantId?: number,
) => Promise<{ ok: boolean }>;
let idA = 0;
let idB = 0;
let idNumeric = 0;
let queue = Promise.resolve();

function serial<T>(fn: () => Promise<T>) {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function form(entries: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  return data;
}

async function count(restaurantId: number) {
  const rows = await db.orm.public.Review.where({ restaurantId }).all();
  return rows.length;
}

async function removeRestaurant(id: number) {
  const reviews = await db.orm.public.Review.where({ restaurantId: id }).all();
  for (const review of reviews) {
    await db.orm.public.Review.where({ id: review.id }).delete();
  }
  await db.orm.public.Restaurant.where({ id }).delete();
}

async function removeOwner(email: string) {
  const existing = await db.orm.public.Restaurant.where({ ownerEmail: email }).first();
  if (existing) await removeRestaurant(existing.id);
}

test.before(async () => {
  assert.ok(databaseUrl, "base locale isolée absente");
  process.env.DIRECT_URL = databaseUrl ?? "";
  process.env.DATABASE_URL = databaseUrl ?? "";
  process.env.RESEND_API_KEY = "";
  process.env.STRIPE_SECRET_KEY = "";
  process.env.GEMINI_API_KEY = "";
  const [{ db: appDb }, actions] = await Promise.all([
    import("../src/prisma/db.ts"),
    import("../app/r/[slug]/actions.ts"),
  ]);
  db = appDb as unknown as AppDb;
  submitManagerFeedback = actions.submitManagerFeedback;
  trackGooglePublish = actions.trackGooglePublish;
  await removeOwner("qr-a@example.test");
  await removeOwner("qr-b@example.test");
  await removeOwner("qr-n@example.test");

  const createdA = await db.orm.public.Restaurant.select("id").create({
    name: "QR A",
    ownerEmail: "qr-a@example.test",
    passwordHash: "hash-de-test",
    slug: "qr-a-isole",
    subscriptionStatus: "active",
    role: "Owner",
    category: "commerce",
    activity: "commerce",
  });
  const createdB = await db.orm.public.Restaurant.select("id").create({
    name: "QR B",
    ownerEmail: "qr-b@example.test",
    passwordHash: "hash-de-test",
    slug: "qr-b-isole",
    subscriptionStatus: "active",
    role: "Owner",
    category: "commerce",
    activity: "commerce",
  });
  const createdNumeric = await db.orm.public.Restaurant.select("id").create({
    name: "QR numerique",
    ownerEmail: "qr-n@example.test",
    passwordHash: "hash-de-test",
    slug: "qr-numerique-temporaire-isole",
    subscriptionStatus: "active",
    role: "Owner",
    category: "commerce",
    activity: "commerce",
  });
  idA = createdA!.id;
  idB = createdB!.id;
  idNumeric = createdNumeric!.id;
  await db.orm.public.Restaurant.where({ id: idNumeric }).update({ slug: null });
});

test.after(async () => {
  if (!db) return;
  for (const id of [idA, idB, idNumeric]) {
    if (!id) continue;
    await removeRestaurant(id);
  }
  await db.close();
});

test("un slug valide enregistre l'avis sur cet établissement", () => serial(async () => {
  const before = await count(idA);
  const result = await submitManagerFeedback(
    form({
      slug: "qr-a-isole",
      rating: "2",
      comment: "Visite QR suffisante",
      authorName: "Client",
    }),
  );
  assert.equal(result.ok, true);
  const rows = await db.orm.public.Review.where({ restaurantId: idA }).all();
  assert.equal(rows.length, before + 1);
  assert.equal(rows.some((row) => row.comment === "Visite QR suffisante" && row.rating === 2), true);
  assert.equal(await count(idB), 0);
}));

test("une note 1 reste acceptée et une note 5 interne est refusée", () => serial(async () => {
  const low = await submitManagerFeedback(
    form({ slug: "qr-a-isole", rating: "1", comment: "Note minimale conservée" }),
  );
  const high = await submitManagerFeedback(
    form({ slug: "qr-a-isole", rating: "5", comment: "Cette note ne reste pas interne" }),
  );
  assert.equal(low.ok, true);
  assert.equal(high.ok, false);
  const rows = await db.orm.public.Review.where({ restaurantId: idA }).all();
  assert.equal(rows.some((row) => row.rating === 1 && row.status === "INTERCEPTED"), true);
  assert.equal(rows.some((row) => row.comment === "Cette note ne reste pas interne"), false);
}));

test("un identifiant substitué n'écrit pas chez l'autre établissement", () => serial(async () => {
  const beforeB = await count(idB);
  const beforeA = await count(idA);
  const result = await submitManagerFeedback(
    form({
      slug: "qr-a-isole",
      restaurantId: String(idB),
      rating: "2",
      comment: "Tentative de substitution",
    }),
  );
  assert.equal(result.ok, false);
  assert.equal(await count(idB), beforeB);
  assert.equal(await count(idA), beforeA);
  const rows = await db.orm.public.Review.where({ restaurantId: idB }).all();
  assert.equal(rows.some((row) => row.comment === "Tentative de substitution"), false);
}));

test("un slug invalide ou un identifiant seul est refusé", () => serial(async () => {
  const beforeA = await count(idA);
  const beforeB = await count(idB);
  const unknown = await submitManagerFeedback(
    form({ slug: "slug-inexistant-isole", rating: "2", comment: "Slug inconnu refusé" }),
  );
  const onlyId = await submitManagerFeedback(
    form({ restaurantId: String(idB), rating: "2", comment: "Identifiant seul refusé" }),
  );
  assert.equal(unknown.ok, false);
  assert.equal(onlyId.ok, false);
  assert.equal(await count(idA), beforeA);
  assert.equal(await count(idB), beforeB);
}));

test("la publication 4 ou 5 suit le slug et refuse l'autre établissement", () => serial(async () => {
  const published = await trackGooglePublish("qr-a-isole", 4);
  const substituted = await trackGooglePublish("qr-a-isole", 5, idB);
  const forgedNumber = await trackGooglePublish(String(idB), 4);
  assert.equal(published.ok, true);
  assert.equal(substituted.ok, false);
  assert.equal(forgedNumber.ok, false);
  const rowsA = await db.orm.public.Review.where({ restaurantId: idA }).all();
  const rowsB = await db.orm.public.Review.where({ restaurantId: idB }).all();
  assert.equal(rowsA.some((row) => row.rating === 4 && row.status === "GOOGLE_PUSHED"), true);
  assert.equal(rowsB.length, 0);
}));

test("un QR déjà distribué sans slug texte reste accessible par son numéro", () => serial(async () => {
  const result = await submitManagerFeedback(
    form({
      slug: String(idNumeric),
      rating: "3",
      comment: "QR numerique conserve",
    }),
  );
  const stolen = await submitManagerFeedback(
    form({
      slug: String(idA),
      rating: "3",
      comment: "Numero d un slug texte refuse",
    }),
  );
  assert.equal(result.ok, true);
  assert.equal(stolen.ok, false);
  const rows = await db.orm.public.Review.where({ restaurantId: idNumeric }).all();
  assert.equal(rows.some((row) => row.comment === "QR numerique conserve"), true);
  const rowsA = await db.orm.public.Review.where({ restaurantId: idA }).all();
  assert.equal(rowsA.some((row) => row.comment === "Numero d un slug texte refuse"), false);
}));
