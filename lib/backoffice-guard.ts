import { isBackofficeOwner } from "@/lib/admin";
import { requireOwnerSession } from "@/lib/session";

export async function backofficeAllowed() {
  const session = await requireOwnerSession();
  if (!session) return false;
  return (
    isBackofficeOwner(session.email) &&
    isBackofficeOwner(session.restaurant.ownerEmail)
  );
}
