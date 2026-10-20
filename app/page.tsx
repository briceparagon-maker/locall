import { LandingHero } from "@/components/landing-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrialStepsBanner } from "@/components/trial-steps-banner";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-locall-navy text-foreground">
      <SiteHeader />

      <main className="w-full bg-locall-navy leading-none">
        <LandingHero />
        <TrialStepsBanner />
        <div className="filtravis-shell">
          <img
            src="/bandeau-protection-filtravis.jpg?v=5"
            alt="Protection à 100 %. Les avis sensibles 1, 2 et 3 étoiles sont recueillis en interne quand le client scanne le QR Code dans votre établissement."
            className="block h-auto w-full"
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
