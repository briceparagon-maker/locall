import { io } from "next/cache";
import { notFound } from "next/navigation";
import { normalizeSubscriptionStatus } from "@/lib/billing";
import { db } from "@/src/prisma/db";
import { ComingSoonPage } from "./coming-soon";
import { ReviewForm } from "./review-form";

export async function ReviewPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await io();
  const restaurant = await db.orm.public.Restaurant.where({ slug }).first();

  if (!restaurant) {
    notFound();
  }

  if (
    normalizeSubscriptionStatus(restaurant.subscriptionStatus) ===
    "pending_activation"
  ) {
    return <ComingSoonPage restaurantName={restaurant.name} />;
  }

  const now = new Date();

  return (
    <ReviewForm
      restaurant={{
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        category: restaurant.category,
        googleReviewUrl: restaurant.googleReviewUrl,
        googlePlaceId: restaurant.googlePlaceId,
        facebookReviewUrl: restaurant.facebookReviewUrl,
      }}
      reviewerName="Client"
      currentMonth={now.getMonth() + 1}
      currentYear={now.getFullYear()}
    />
  );
}
