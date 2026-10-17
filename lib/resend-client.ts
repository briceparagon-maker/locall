import { Resend } from "resend";

export function resendFrom() {
  return process.env.RESEND_FROM?.trim() || "LOCALL <onboarding@resend.dev>";
}

export function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}
