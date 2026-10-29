import fs from "node:fs";

const path = new URL("../.env", import.meta.url);
let text = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
const add = [
  ["GEMINI_API_KEY", ""],
  ["RESEND_API_KEY", ""],
  ["RESEND_FROM", "LOCALL <onboarding@resend.dev>"],
  ["NEXT_PUBLIC_APP_URL", "http://localhost:3000"],
  ["OWNER_EMAIL", ""],
  ["ADMIN_EMAILS", ""],
  ["CRON_SECRET", ""],
  ["STRIPE_SECRET_KEY", ""],
  ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", ""],
  ["STRIPE_WEBHOOK_SECRET", ""],
  ["STRIPE_PRICE_ID", ""],
  ["PASSWORD_RESET_SECRET", ""],
  ["SESSION_SECRET", ""],
];

for (const [key, value] of add) {
  const hasKey = text.split(/\r?\n/).some((line) => line.startsWith(`${key}=`));
  if (!hasKey) {
    if (text.length > 0 && !text.endsWith("\n")) text += "\n";
    text += `${key}=${value}\n`;
  }
}

fs.writeFileSync(path, text);
console.log("env keys present");
