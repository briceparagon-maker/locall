export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(/[,;\s]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isSuperAdmin(email: string | null | undefined, role?: string | null) {
  if ((role ?? "").toLowerCase() === "superadmin") return true;
  const normalized = email?.trim().toLowerCase() ?? "";
  if (!normalized) return false;
  return adminEmails().includes(normalized);
}
