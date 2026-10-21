import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
config({ path: path.join(root, ".env") });

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DIRECT_URL / DATABASE_URL manquant.");
  process.exit(1);
}

const sqlFile = path.join(
  root,
  "src",
  "prisma",
  process.argv[2] || "rls-securite.sql",
);
const sql = readFileSync(sqlFile, "utf8");

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  await client.query(sql);
  const rls = await client.query(`
    SELECT c.relname AS table, c.relrowsecurity AS rls
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname IN ('Restaurant', 'Review')
    ORDER BY c.relname
  `);
  const policies = await client.query(`
    SELECT tablename, policyname, cmd, roles, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('Restaurant', 'Review')
    ORDER BY tablename, policyname
  `);
  console.log(JSON.stringify({ rls: rls.rows, policies: policies.rows }, null, 2));
} finally {
  await client.end();
}
