"use server";

import { redirect } from "next/navigation";
import { clearOwnerSession } from "@/lib/session";

export async function logoutOwner() {
  await clearOwnerSession();
  redirect("/");
}
