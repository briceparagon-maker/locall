import { Suspense } from "react";
import { SiteHeaderBar } from "@/components/site-header-bar";
import { getOwnerRestaurantId } from "@/lib/session";

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
