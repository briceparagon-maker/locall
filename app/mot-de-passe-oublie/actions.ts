"use server";

import { sendPasswordResetEmail } from "@/lib/password-reset";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  return sendPasswordResetEmail(email);
}
