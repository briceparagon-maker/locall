import { cookies } from "next/headers";

const ID_COOKIE = "locall_restaurant_id";
const EMAIL_COOKIE = "locall_owner_email";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function setOwnerSession(restaurantId: number, email: string) {
  const store = await cookies();
  store.set(ID_COOKIE, String(restaurantId), cookieOptions);
  store.set(EMAIL_COOKIE, email, cookieOptions);
}

export async function getOwnerRestaurantId() {
  const store = await cookies();
  const id = Number(store.get(ID_COOKIE)?.value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function clearOwnerSession() {
  const store = await cookies();
  store.delete(ID_COOKIE);
  store.delete(EMAIL_COOKIE);
}
