import "dotenv/config";
import pg from "pg";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const sql = `
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'trial';
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS trial_reminder_sent_at TIMESTAMPTZ;
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'Owner';
`;

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("billing columns ready");
} finally {
  await client.end();
}
