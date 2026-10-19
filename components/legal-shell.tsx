import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
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
