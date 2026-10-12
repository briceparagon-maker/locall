import { connection } from "next/server";
import { notFound } from "next/navigation";
import { db } from "@/src/prisma/db";
import { ReviewForm } from "./review-form";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connection();
  const restaurant = await db.orm.public.Restaurant.where({ slug }).first();

  if (!restaurant) {
    notFound();
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
      }}
      reviewerName="Visiteur"
      currentMonth={now.getMonth() + 1}
      currentYear={now.getFullYear()}
    />
  );
}
