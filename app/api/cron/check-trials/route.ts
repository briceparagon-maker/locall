import { connection } from "next/server";
import { sendTrialReminders } from "@/lib/trial-reminder";

export const instant = false;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization") ?? "";
  if (secret) return auth === `Bearer ${secret}`;
  return process.env.NODE_ENV !== "production";
}

export async function GET(request: Request) {
  await connection();
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  const result = await sendTrialReminders();
  return Response.json({ ok: true, ...result });
}
