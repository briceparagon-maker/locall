export function reviewBelongsToRestaurant(
  reviewRestaurantId: number,
  callerRestaurantId: number,
) {
  return (
    Number.isInteger(reviewRestaurantId) &&
    reviewRestaurantId > 0 &&
    reviewRestaurantId === callerRestaurantId
  );
}

export function isInterceptedRating(rating: number) {
  return rating === 1 || rating === 2 || rating === 3;
}

export function autoRespondAlreadySent(review: {
  status: string;
  clientEmailed: boolean;
  ownerNotified: boolean;
}) {
  return review.status === "RESOLVED_AUTO" && (review.clientEmailed || review.ownerNotified);
}
