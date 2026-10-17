"use client";

import { useMemo, useState, useTransition } from "react";
import { submitManagerFeedback, trackGooglePublish } from "./actions";
import { reviewerInitials, showsDetailRatings } from "./reviewer";

type ReviewFormProps = {
  restaurant: {
    id: number;
    name: string;
    address: string | null;
    category: string;
    googleReviewUrl: string | null;
    googlePlaceId: string | null;
    facebookReviewUrl: string | null;
  };
  reviewerName: string;
  currentMonth: number;
  currentYear: number;
};

const STAR_LABELS = [
  "",
  "Loin d'être génial",
  "Pas génial",
  "Bien",
  "Très bien",
  "Exceptionnel",
];

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const CHARTER_MUTED = "text-[#5f6368]";
const CHARTER_HINT = "text-[#80868b]";

function googleListingUrl(restaurant: ReviewFormProps["restaurant"]) {
  if (restaurant.googlePlaceId) {
    return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(restaurant.googlePlaceId)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}`;
}

function googleWriteReviewUrl(restaurant: ReviewFormProps["restaurant"]) {
  if (restaurant.googleReviewUrl) {
    return restaurant.googleReviewUrl;
  }
  if (restaurant.googlePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(restaurant.googlePlaceId)}`;
  }
  return null;
}

function initialFromName(name: string) {
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

function StarRow({
  value,
  onChange,
  label,
  size = "lg",
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
  size?: "lg" | "sm";
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  const box = size === "lg" ? "h-11 w-11" : "h-7 w-7";

  return (
    <div
      className="flex items-center gap-0.5"
      role="radiogroup"
      aria-label={label}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = display >= star;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} étoile${star > 1 ? "s" : ""} — ${STAR_LABELS[star]}`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform active:scale-90"
          >
            <svg
              viewBox="0 0 24 24"
              className={`${box} ${filled ? "text-[#fbbc04]" : "text-[#dadce0]"}`}
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export function ReviewForm({
  restaurant,
  reviewerName,
  currentMonth,
  currentYear,
}: ReviewFormProps) {
  const years = useMemo(
    () => Array.from({ length: 9 }, (_, index) => currentYear - index),
    [currentYear],
  );

  const [rating, setRating] = useState(0);
  const [cuisineRating, setCuisineRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [ambianceRating, setAmbianceRating] = useState(0);
  const [visitMonth, setVisitMonth] = useState(currentMonth);
  const [visitYear, setVisitYear] = useState(currentYear);
  const [state, setState] = useState<{ ok: boolean; error?: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const isPositive = rating >= 4;
  const isNegative = rating >= 1 && rating <= 3;
  const listingUrl = googleListingUrl(restaurant);
  const googlePublishUrl = googleWriteReviewUrl(restaurant);
  const facebookPublishUrl = restaurant.facebookReviewUrl?.trim() || null;
  const hasGoogleDest = Boolean(googlePublishUrl);
  const hasFacebookDest = Boolean(facebookPublishUrl);
  const publishUrl = googlePublishUrl || facebookPublishUrl || listingUrl;
  const showDetails = showsDetailRatings(restaurant.category);
  const maxMonth = visitYear === currentYear ? currentMonth : 12;
  const safeVisitMonth = Math.min(visitMonth, maxMonth);
  const discreetLinkClass = "text-xs text-[#f8f9fa] no-underline";

  if (state?.ok) {
    return (
      <div className="flex min-h-dvh flex-col items-center bg-[#f8f9fa] px-5 py-10 text-[#202124]">
        <div className="w-full max-w-md rounded-3xl bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-4xl" aria-hidden>
            ✓
          </p>
          <h1 className="mt-4 text-xl font-medium">Merci pour votre retour</h1>
          <p className={`mt-2 text-sm ${CHARTER_MUTED}`}>
            Le gérant de {restaurant.name} a bien reçu votre message.
          </p>
          <a
            href={listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 inline-block ${discreetLinkClass}`}
          >
            Voir la fiche Google
          </a>
        </div>
      </div>
    );
  }

  const publishButtonClass =
    "mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-[#1a73e8] px-6 text-base font-medium text-white shadow-sm hover:bg-[#1558b0] disabled:opacity-60";

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f9fa] text-[#202124]">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-8">
        <header className="flex flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1a73e8] text-2xl font-medium text-white"
            aria-hidden
          >
            {initialFromName(restaurant.name)}
          </div>
          <h1 className="mt-4 text-[22px] font-normal leading-7">
            {restaurant.name}
          </h1>
          {restaurant.address ? (
            <p className={`mt-1 text-sm ${CHARTER_MUTED}`}>
              {restaurant.address}
            </p>
          ) : null}

          <div className="mt-5 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0fe] text-sm font-medium text-[#1a73e8]"
              aria-hidden
            >
              {reviewerInitials(reviewerName)}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium leading-5">{reviewerName}</p>
              <p className={`text-xs ${CHARTER_HINT}`}>Avis public</p>
            </div>
          </div>

          <p className="mt-6 text-base text-[#3c4043]">
            Comment s’est passée votre visite ?
          </p>
        </header>

        <div className="mt-3 flex justify-center">
          <StarRow
            value={rating}
            onChange={setRating}
            label="Note de 1 à 5 étoiles"
          />
        </div>

        {rating > 0 ? (
          <p className={`mt-1 text-center text-sm font-medium ${CHARTER_MUTED}`}>
            {STAR_LABELS[rating]}
          </p>
        ) : null}

        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await submitManagerFeedback(formData);
              setState(result);
            });
          }}
          className="mt-6 flex flex-1 flex-col"
        >
            <input type="hidden" name="restaurantId" value={restaurant.id} />
            <input type="hidden" name="rating" value={rating} />
            <input type="hidden" name="authorName" value={reviewerName} />
            <input type="hidden" name="cuisineRating" value={cuisineRating || ""} />
            <input type="hidden" name="serviceRating" value={serviceRating || ""} />
            <input type="hidden" name="ambianceRating" value={ambianceRating || ""} />

            <label className="block">
              <span className="sr-only">Votre commentaire</span>
              <textarea
                name="comment"
                rows={5}
                placeholder="Partagez votre expérience concernant cet endroit"
                className="w-full resize-none rounded-lg border border-[#dadce0] bg-white px-4 py-3 text-base outline-none placeholder:text-[#80868b] focus:border-[#1a73e8]"
              />
            </label>

            {isNegative ? (
              <label className="mt-3 block">
                <span className="mb-1.5 block text-sm text-[#3c4043]">
                  E-mail ou téléphone{" "}
                  <span className={CHARTER_HINT}>
                    (optionnel — pour recevoir un retour privilégié de la
                    direction sous 1h)
                  </span>
                </span>
                <input
                  type="text"
                  name="contact"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="ex. 06 12 34 56 78 ou vous@email.fr"
                  className="min-h-12 w-full rounded-lg border border-[#dadce0] bg-white px-4 text-base outline-none placeholder:text-[#80868b] focus:border-[#1a73e8]"
                />
              </label>
            ) : null}

            {showDetails ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm">Cuisine</span>
                  <StarRow
                    value={cuisineRating}
                    onChange={setCuisineRating}
                    label="Cuisine, 1 à 5 étoiles"
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm">Service</span>
                  <StarRow
                    value={serviceRating}
                    onChange={setServiceRating}
                    label="Service, 1 à 5 étoiles"
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm">Ambiance</span>
                  <StarRow
                    value={ambianceRating}
                    onChange={setAmbianceRating}
                    label="Ambiance, 1 à 5 étoiles"
                    size="sm"
                  />
                </div>
              </div>
            ) : null}

            <fieldset className="mt-6">
              <legend className="text-sm font-medium">Date de la visite</legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="sr-only">Mois</span>
                  <select
                    name="visitMonth"
                    value={safeVisitMonth}
                    onChange={(event) => setVisitMonth(Number(event.target.value))}
                    className="min-h-12 w-full rounded-lg border border-[#dadce0] bg-white px-3 text-sm outline-none focus:border-[#1a73e8]"
                  >
                    {MONTHS.map((month, index) => {
                      const monthNumber = index + 1;
                      const disabled = monthNumber > maxMonth;
                      return (
                        <option
                          key={month}
                          value={monthNumber}
                          disabled={disabled}
                        >
                          {month}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label className="block">
                  <span className="sr-only">Année</span>
                  <select
                    name="visitYear"
                    value={visitYear}
                    onChange={(event) => {
                      const year = Number(event.target.value);
                      setVisitYear(year);
                      const limit = year === currentYear ? currentMonth : 12;
                      setVisitMonth((month) => Math.min(month, limit));
                    }}
                    className="min-h-12 w-full rounded-lg border border-[#dadce0] bg-white px-3 text-sm outline-none focus:border-[#1a73e8]"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </fieldset>

            {state?.error ? (
              <p className="mt-3 text-sm text-[#d93025]">{state.error}</p>
            ) : null}

            {isPositive ? (
              hasGoogleDest && hasFacebookDest ? (
                <div className="mt-6 space-y-3">
                  <p className={`text-center text-sm ${CHARTER_MUTED}`}>
                    Laissez votre avis sur Google et sur Facebook.
                  </p>
                  <a
                    href={googlePublishUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={publishButtonClass.replace("mt-6 ", "")}
                    onClick={() => {
                      void trackGooglePublish(restaurant.id, rating);
                    }}
                  >
                    Publier sur Google
                  </a>
                  <a
                    href={facebookPublishUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#1877f2] px-6 text-base font-medium text-white shadow-sm hover:bg-[#166fe5] disabled:opacity-60"
                    onClick={() => {
                      void trackGooglePublish(restaurant.id, rating);
                    }}
                  >
                    Publier sur Facebook
                  </a>
                </div>
              ) : (
                <a
                  href={publishUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={publishButtonClass}
                  onClick={() => {
                    void trackGooglePublish(restaurant.id, rating);
                  }}
                >
                  {hasFacebookDest && !hasGoogleDest
                    ? "Publier sur Facebook"
                    : "Publier"}
                </a>
              )
            ) : (
              <button
                type={isNegative ? "submit" : "button"}
                disabled={pending}
                className={publishButtonClass}
              >
                {pending ? "Publication…" : "Publier"}
              </button>
            )}
          </form>

        <p className="mt-auto flex flex-col items-center gap-2 pt-10 text-center">
          <a
            href={listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={discreetLinkClass}
          >
            Voir la fiche Google
          </a>
          {facebookPublishUrl ? (
            <a
              href={facebookPublishUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={discreetLinkClass}
            >
              Voir la page Facebook
            </a>
          ) : null}
        </p>
      </main>
    </div>
  );
}
