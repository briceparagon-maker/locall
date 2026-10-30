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

export const AUTO_SENDING_STATUS = "AUTO_SENDING";

export function channelsToSend(input: {
  clientRequired: boolean;
  ownerRequired: boolean;
  clientEmailed: boolean;
  ownerNotified: boolean;
}) {
  return {
    sendClient: input.clientRequired && !input.clientEmailed,
    sendOwner: input.ownerRequired && !input.ownerNotified,
  };
}

export function deliveryComplete(input: {
  status: string;
  clientRequired: boolean;
  ownerRequired: boolean;
  clientEmailed: boolean;
  ownerNotified: boolean;
}) {
  const pending = channelsToSend(input);
  if (pending.sendClient || pending.sendOwner) return false;
  return input.status === "RESOLVED_AUTO";
}

export function statusAfterDelivery(input: {
  clientRequired: boolean;
  ownerRequired: boolean;
  clientEmailed: boolean;
  ownerNotified: boolean;
}) {
  const pending = channelsToSend(input);
  const complete = !pending.sendClient && !pending.sendOwner;
  return {
    complete,
    status: complete ? ("RESOLVED_AUTO" as const) : ("INTERCEPTED" as const),
  };
}
