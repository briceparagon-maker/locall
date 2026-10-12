import "dotenv/config";
import fs from "node:fs";
import pg from "pg";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const sql = fs.readFileSync(new URL("./init.sql", import.meta.url), "utf8");
const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
await client.query(sql);
const tables = await client.query(
  "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('Restaurant', 'Review') ORDER BY tablename",
);
const sample = await client.query(
  'SELECT slug FROM "Restaurant" WHERE slug IS NOT NULL ORDER BY id LIMIT 1',
);
await client.end();

console.log("Applied init.sql");
console.log("Tables:", tables.rows.map((row) => row.tablename).join(", "));
if (sample.rows[0]?.slug) {
  console.log("Sample slug:", sample.rows[0].slug);
}
