import { Suspense } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { getOwnerRestaurantId } from "@/lib/session";

const headerLinkClass =
  "text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline";

function SiteHeaderBar({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="bg-locall-navy text-white">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-3 px-4 py-5 sm:grid-cols-3">
        <Link
          href="/"
          className="justify-self-start no-underline hover:opacity-90"
          aria-label="LOCALL — Accueil"
        >
          <img
            src="/logo-locall.jpg"
            alt="LOCALL"
            className="h-10 w-auto max-h-10 max-w-[168px] object-contain object-left sm:h-11 sm:max-h-11 sm:max-w-[196px]"
          />
        </Link>
        <div className="justify-self-center text-center">
          <Link
            href="/inscription"
            className="inline-block leading-tight no-underline hover:opacity-90"
          >
            <span className="block text-sm font-semibold text-white">
              Essai gratuit
            </span>
            <span className="block text-xl font-extrabold tracking-tight text-locall-orange">
              14{" "}
              <span className="underline decoration-locall-orange decoration-[3px] underline-offset-4">
                jours
              </span>
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-start gap-4 sm:justify-self-end">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-locall-orange underline-offset-4 hover:underline"
              >
                Mon compte
              </Link>
              <LogoutButton className={headerLinkClass} />
            </>
          ) : (
            <Link href="/connexion" className={headerLinkClass}>
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

async function SiteHeaderSession() {
  const loggedIn = Boolean(await getOwnerRestaurantId());
  return <SiteHeaderBar loggedIn={loggedIn} />;
}

export function SiteHeader() {
  return (
    <Suspense fallback={<SiteHeaderBar loggedIn={false} />}>
      <SiteHeaderSession />
    </Suspense>
  );
}
