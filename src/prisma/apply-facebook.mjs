import "dotenv/config";
import pg from "pg";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const sql = `
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS facebook_review_url TEXT;
`;

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("facebook_review_url ready");
} finally {
  await client.end();
}
