"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { FiltravisLogoLink, TrialCtaLink } from "@/components/site-brand";
import { useStickyLogoScale } from "@/components/use-sticky-logo-scale";

const headerLinkClass =
  "text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline";

export function SiteHeaderBar({ loggedIn }: { loggedIn: boolean }) {
  const { scale, scrolled } = useStickyLogoScale();

  return (
    <header
      className={`sticky top-0 z-50 bg-locall-navy text-white transition-shadow ${
        scrolled ? "shadow-lg shadow-black/30" : ""
      }`}
    >
      <div className="filtravis-shell grid grid-cols-1 items-center gap-3 overflow-visible py-4 sm:grid-cols-3">
        <div className="justify-self-start">
          <TrialCtaLink />
        </div>
        <div className="justify-self-center">
          <FiltravisLogoLink scale={scale} />
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
      <div className="filtravis-gold-rule" aria-hidden="true" />
    </header>
  );
}
