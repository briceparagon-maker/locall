import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0A192F] text-foreground">
      <SiteHeader />

      <main className="w-full bg-gradient-to-b from-[#0D1B2A] to-[#0A192F]">
        <Link
          href="/inscription"
          className="mx-auto block w-fit max-w-full leading-none"
        >
          <img
            src="/stop-aux-mauvais-avis-locall.jpg?v=fluo3"
            alt="Stop aux mauvais avis — Activez votre essai LOCALL"
            className="mx-auto block h-auto w-auto max-w-full"
          />
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
