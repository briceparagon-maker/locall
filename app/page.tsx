import { LandingHero } from "@/components/landing-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-locall-navy text-foreground">
      <SiteHeader />

      <main className="w-full bg-locall-navy leading-none">
        <LandingHero />
      </main>

      <SiteFooter />
    </div>
  );
}
