import "dotenv/config";
import pg from "pg";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const sql = `
ALTER TABLE "Restaurant"
  ALTER COLUMN subscription_status SET DEFAULT 'pending_activation';
`;

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("subscription_status default = pending_activation");
} finally {
  await client.end();
}
