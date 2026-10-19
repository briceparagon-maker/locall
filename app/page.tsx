import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrialStepsBanner } from "@/components/trial-steps-banner";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-locall-navy text-foreground">
      <SiteHeader />

      <main className="w-full bg-white pb-10 sm:pb-14">
        <TrialStepsBanner />
      </main>

      <SiteFooter />
    </div>
  );
}
