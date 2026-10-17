import Link from "next/link";
import { connection } from "next/server";
import { LogoutButton } from "@/components/logout-button";
import { SiteFooter } from "@/components/site-footer";
import { getOwnerRestaurantId } from "@/lib/session";

const headerLinkClass =
  "text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline";

export default async function Home() {
  await connection();
  const loggedIn = Boolean(await getOwnerRestaurantId());

  return (
    <div className="flex min-h-dvh flex-col bg-[#0A192F] text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-3 px-4 py-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-locall-orange">
              LOCALL
            </p>
            <p className="mt-1 text-sm text-white/80">
              Votre réputation entre de bonnes mains.
            </p>
          </div>
          <div className="justify-self-center text-center">
            {loggedIn ? null : (
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
            )}
          </div>
          <div className="justify-self-start sm:justify-self-end">
            {loggedIn ? (
              <LogoutButton className={headerLinkClass} />
            ) : (
              <Link href="/connexion" className={headerLinkClass}>
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="w-full bg-gradient-to-b from-[#0D1B2A] to-[#0A192F]">
        <Link
          href="/inscription"
          className="mx-auto block w-fit max-w-full leading-none"
        >
          <img
            src="/stop-aux-mauvais-avis-locall.jpg?v=fluo2"
            alt="Stop aux mauvais avis — Activez votre essai LOCALL"
            className="mx-auto block h-auto w-auto max-w-full"
          />
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
