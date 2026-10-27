const BACKOFFICE_OWNER_EMAIL = "briceparagon@gmail.com";

export function isBackofficeOwner(email: string | null | undefined) {
  return email?.trim().toLowerCase() === BACKOFFICE_OWNER_EMAIL;
}

export function isSuperAdmin(email: string | null | undefined, _role?: string | null) {
  return isBackofficeOwner(email);
}
