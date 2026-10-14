import { Suspense } from "react";
import { ReviewPageContent } from "./review-page-content";
import { ReviewSkeleton } from "./review-skeleton";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ReviewSkeleton />}>
      <ReviewPageContent params={params} />
    </Suspense>
  );
}
