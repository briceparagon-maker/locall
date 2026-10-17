export const SUBSCRIPTION_STATUSES = ["trial", "active", "cancelled"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export function normalizeSubscriptionStatus(value: string | null | undefined): SubscriptionStatus {
  const normalized = (value ?? "trial").trim().toLowerCase();
  if (normalized === "active") return "active";
  if (normalized === "cancelled" || normalized === "canceled") return "cancelled";
  return "trial";
}

export function statusLabel(status: SubscriptionStatus) {
  if (status === "active") return "Active";
  if (status === "cancelled") return "Cancelled";
  return "Trial";
}

export function trialDaysLeft(trialEndsAt: string | null | undefined) {
  if (!trialEndsAt) return null;
  const end = new Date(trialEndsAt).getTime();
  if (Number.isNaN(end)) return null;
  return Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000));
}
