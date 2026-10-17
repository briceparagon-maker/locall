"use client";

import { logoutOwner } from "@/app/connexion/logout-action";

export function LogoutButton({ className }: { className: string }) {
  return (
    <form action={logoutOwner}>
      <button type="submit" className={className}>
        Déconnexion
      </button>
    </form>
  );
}
