import { connection } from "next/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { SiteFooter } from "@/components/site-footer";
import { backofficeAllowed } from "@/lib/backoffice-guard";
import { getOwnerEmail } from "@/lib/session";

export const instant = false;

export const metadata = {
  title: "Administration FILTRAVIS",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  if (!(await backofficeAllowed())) {
    redirect((await getOwnerEmail()) ? "/dashboard" : "/connexion");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <a href="/" className="inline-block no-underline hover:opacity-90" aria-label="FILTRAVIS — Accueil">
              <img
                src="/logo-filtravis.jpg"
                alt="FILTRAVIS"
                className="h-11 w-auto max-h-11 max-w-[240px] object-contain"
              />
            </a>
            <h1 className="mt-2 text-xl font-semibold">Administration FILTRAVIS</h1>
            <p className="text-sm text-white/70">Vue globale de tous les clients</p>
          </div>
          <LogoutButton className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10" />
        </div>
      </header>
      {children}
      <SiteFooter />
    </div>
  );
}
