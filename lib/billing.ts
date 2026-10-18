export const SUBSCRIPTION_STATUSES = [
  "pending_activation",
  "trialing",
  "active",
  "cancelled",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export function normalizeSubscriptionStatus(
  value: string | null | undefined,
): SubscriptionStatus {
  const normalized = (value ?? "pending_activation").trim().toLowerCase();
  if (normalized === "active") return "active";
  if (normalized === "cancelled" || normalized === "canceled") return "cancelled";
  if (normalized === "pending_activation" || normalized === "pending") {
    return "pending_activation";
  }
  if (normalized === "trialing" || normalized === "trial") return "trialing";
  return "pending_activation";
}

export function statusLabel(status: SubscriptionStatus) {
  if (status === "active") return "Active";
  if (status === "cancelled") return "Cancelled";
  if (status === "pending_activation") return "En attente";
  return "Essai";
}

export function trialDaysLeft(trialEndsAt: string | null | undefined) {
  if (!trialEndsAt) return null;
  const end = new Date(trialEndsAt).getTime();
  if (Number.isNaN(end)) return null;
  return Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000));
}

export function trialEndsInFourteenDays() {
  return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
}
