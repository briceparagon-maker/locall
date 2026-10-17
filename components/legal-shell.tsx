import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5">
          <Link href="/" className="text-xs font-semibold tracking-[0.22em] text-locall-orange">
            LOCALL
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline"
          >
            Accueil
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <article className="card-locall space-y-4 p-6 text-sm leading-6 text-slate-700 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">{title}</h1>
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
