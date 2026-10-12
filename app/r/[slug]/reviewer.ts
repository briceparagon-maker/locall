const REVIEWER_NAMES = [
  "Camille Martin",
  "Thomas Bernard",
  "Léa Dubois",
  "Nicolas Petit",
  "Emma Lefevre",
];

export function reviewerNameFor(restaurantId: number) {
  return REVIEWER_NAMES[Math.abs(restaurantId) % REVIEWER_NAMES.length];
}

export function reviewerInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function showsDetailRatings(category: string | null | undefined) {
  const value = (category ?? "restaurant").trim().toLowerCase();
  return ["restaurant", "boulangerie", "bakery", "cafe", "café"].includes(
    value,
  );
}
