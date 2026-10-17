import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0A192F] text-foreground">
      <SiteHeader />

      <main className="w-full bg-gradient-to-b from-[#0D1B2A] to-[#0A192F] pb-10 sm:pb-14">
        <div className="relative mx-auto w-fit max-w-full leading-none">
          <img
            src="/stop-aux-mauvais-avis-locall.jpg?v=fluo4"
            alt="Stop aux mauvais avis — Activez votre essai LOCALL"
            className="mx-auto block h-auto w-auto max-w-full"
          />
          <Link
            href="/inscription"
            aria-label="Essayez LOCALL gratuitement"
            className="absolute z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-locall-orange focus-visible:ring-offset-2"
            style={{
              left: "30.0%",
              top: "70.2%",
              width: "40.0%",
              height: "7.2%",
            }}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
