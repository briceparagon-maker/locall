import { isBackofficeOwner } from "@/lib/admin";
import {
  getOwnerEmail,
  getOwnerRestaurantId,
  getOwnerSignature,
  ownerSignatureMatches,
} from "@/lib/session";
import { db } from "@/src/prisma/db";

export async function backofficeAllowed() {
  const email = await getOwnerEmail();
  const restaurantId = await getOwnerRestaurantId();
  if (!isBackofficeOwner(email) || !restaurantId) return false;

  const account = await db.orm.public.Restaurant.where({ id: restaurantId }).first();
  if (!account?.passwordHash || !isBackofficeOwner(account.ownerEmail)) return false;

  return ownerSignatureMatches(
    restaurantId,
    email,
    account.passwordHash,
    await getOwnerSignature(),
  );
}
