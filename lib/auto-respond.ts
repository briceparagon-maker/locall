import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";
import { db } from "@/src/prisma/db";
import { appUrl, escapeHtml, isEmail } from "@/lib/app-url";

export type AutoRespondResult = {
  ok: boolean;
  error?: string;
  clientEmailed: boolean;
  ownerNotified: boolean;
  autoReplyText: string | null;
};

function starsLine(rating: number) {
  return `${rating}/5 ★`;
}

function scoreLine(rating: number) {
  return `${rating}/5`;
}

function isPresentRating(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

function isFoodAndBeverage(activity: string | null | undefined, category: string | null | undefined) {
  const haystack = `${activity ?? ""} ${category ?? ""}`.toLowerCase();
  if (haystack.includes("fast food") || haystack.includes("métier de bouche") || haystack.includes("metier de bouche")) {
    return true;
  }
  const tokens = haystack.split(/[^a-zàâäéèêëïîôùûüçœ-]+/).filter(Boolean);
  const foodTokens = new Set([
    "restaurant",
    "restauration",
    "brasserie",
    "bistro",
    "bistrot",
    "café",
    "cafe",
    "bar",
    "boulangerie",
    "pâtisserie",
    "patisserie",
    "traiteur",
    "pizzeria",
    "pizza",
    "fast-food",
    "fastfood",
    "snack",
    "kebab",
    "burger",
    "glacier",
    "chocolaterie",
    "crêperie",
    "creperie",
    "bakery",
  ]);
  return tokens.some((token) => foodTokens.has(token));
}

function activityLabel(activity: string | null | undefined, category: string | null | undefined) {
  const act = activity?.trim();
  if (act && act.toLowerCase() !== "commerce") return act;
  return category?.trim() || act || "commerce";
}

function cityLabel(city: string | null | undefined, address: string | null | undefined) {
  if (city?.trim()) return city.trim();
  const parts = (address ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.at(-1) || "";
}

function fallbackReply(input: {
  establishmentName: string;
  activity: string;
  city: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
}) {
  const location = input.city ? ` à ${input.city}` : "";
  const commentLine = input.comment?.trim()
    ? `Nous avons bien pris en compte votre message : « ${input.comment.trim()} ».\n`
    : "";

  return `Toute l’équipe de ${input.establishmentName}, votre ${input.activity}${location}, prend votre remarque très au sérieux. (${starsLine(input.rating)}).
${commentLine}Nous sommes sincèrement désolés que votre expérience n’ait pas été à la hauteur de vos attentes.
La satisfaction de nos clients est essentielle pour nous. Vos remarques nous permettent de continuer à nous améliorer et à offrir à chacun la qualité d’accueil et de service que nous souhaitons.
Nous espérons avoir le plaisir de vous accueillir à nouveau dans de meilleures conditions.
Avec toutes nos excuses,
L’équipe ${input.establishmentName}${location}`;
}

function buildGeminiPrompt(input: {
  establishmentName: string;
  activity: string;
  city: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
  cuisineRating: number | null;
  serviceRating: number | null;
  ambianceRating: number | null;
}) {
  const location = input.city || "non précisée";
  const details = [
    input.cuisineRating ? `Cuisine ${input.cuisineRating}/5` : null,
    input.serviceRating ? `Prestation / service ${input.serviceRating}/5` : null,
    input.ambianceRating ? `Accueil / cadre ${input.ambianceRating}/5` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return `Tu rédiges un e-mail d'apaisement, en français, au nom d'un établissement local.
Conserve impérativement la trame et le ton ci-dessous : chaleureux, humble, axé sur l'amélioration continue.
Tu peux adapter légèrement les tournures selon l'activité « ${input.activity} » et le commentaire, tout en respectant strictement ce modèle (mêmes paragraphes, même ordre, même signature).
Ne propose AUCUN geste commercial, avantage, remboursement, réduction, cadeau ou rendez-vous de rattrapage — ni systématique, ni automatique, ni « si besoin ».
Pas de markdown, pas de sujet, uniquement le corps du mail. Vouvoie. Pas d'ajout hors modèle (pas de « Bonjour », pas de post-scriptum).

Variables (à insérer telles quelles, sans crochets) :
- Nom : ${input.establishmentName}
- Activité : ${input.activity}
- Ville : ${location}
- Note : ${starsLine(input.rating)}
- Commentaire : ${input.comment?.trim() || ""}

Modèle à suivre exactement :

Toute l’équipe de ${input.establishmentName}, votre ${input.activity} à ${location}, prend votre remarque très au sérieux. (${starsLine(input.rating)}).
Nous avons bien pris en compte votre message : « ${input.comment?.trim() || "votre retour"} ».
Nous sommes sincèrement désolés que votre expérience n’ait pas été à la hauteur de vos attentes.
La satisfaction de nos clients est essentielle pour nous. Vos remarques nous permettent de continuer à nous améliorer et à offrir à chacun la qualité d’accueil et de service que nous souhaitons.
Nous espérons avoir le plaisir de vous accueillir à nouveau dans de meilleures conditions.
Avec toutes nos excuses,
L’équipe ${input.establishmentName} à ${location}

Si le client n'a laissé aucun commentaire, omets uniquement la phrase « Nous avons bien pris en compte votre message… ».
Si un commentaire est présent, cite-le fidèlement entre « ».

Détails de notation (contexte, ne pas les lister dans le mail) : ${details || "non précisés"}
Prénom / nom du client (ne pas saluer par le prénom) : ${input.authorName || "non communiqué"}`;
}

async function generateCalmingReply(input: {
  establishmentName: string;
  activity: string;
  city: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
  cuisineRating: number | null;
  serviceRating: number | null;
  ambianceRating: number | null;
}) {
  const fallback = fallbackReply(input);
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return fallback;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(buildGeminiPrompt(input));
    const text = result.response.text().trim();
    return text || fallback;
  } catch {
    return fallback;
  }
}

function ownerAlertHtml(input: {
  restaurantName: string;
  activity: string;
  category: string | null;
  rating: number;
  comment: string | null;
  cuisineRating: number | null;
  serviceRating: number | null;
  ambianceRating: number | null;
  clientEmailed: boolean;
  dashboardUrl: string;
}) {
  const detailRows = isFoodAndBeverage(input.activity, input.category)
    ? [
        isPresentRating(input.cuisineRating)
          ? `• Cuisine : ${scoreLine(input.cuisineRating)}`
          : null,
        isPresentRating(input.serviceRating)
          ? `• Service : ${scoreLine(input.serviceRating)}`
          : null,
        isPresentRating(input.ambianceRating)
          ? `• Ambiance : ${scoreLine(input.ambianceRating)}`
          : null,
      ].filter((row): row is string => Boolean(row))
    : [];
  const detailsBlock = detailRows.length
    ? `<li><strong>Notes détaillées :</strong><br>${detailRows.map((row) => escapeHtml(row)).join("<br>")}</li>`
    : "";
  const excerpt = (input.comment ?? "").trim() || "Aucun commentaire.";
  const action = input.clientEmailed
    ? "L'avis N'A PAS été publié sur Google. Une réponse d'apaisement ultra-bienveillante a été générée et sera envoyée automatiquement au client dans 17 à 23 minutes."
    : "L'avis N'A PAS été publié sur Google. Le client n'a pas laissé d'e-mail : la réponse d'apaisement est prête dans votre dashboard.";

  return `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;max-width:560px">
<p style="font-size:18px;font-weight:700;margin:0 0 12px">Excellente nouvelle : Votre réputation sur Google reste intacte !</p>
<p>Un client mécontent vient de déposer un avis de ${escapeHtml(starsLine(input.rating))} sur votre Smart QR Code.</p>
<ul>
<li><strong>Note interceptée :</strong> ${escapeHtml(starsLine(input.rating))}</li>
${detailsBlock}
<li><strong>Commentaire client :</strong> "${escapeHtml(excerpt)}"</li>
<li><strong>Action LOCALL :</strong> ${escapeHtml(action)}</li>
</ul>
<p><a href="${escapeHtml(input.dashboardUrl)}" style="display:inline-block;background:linear-gradient(90deg,#FF5500,#FF2200);color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700">👉 Consulter les détails sur votre Dashboard LOCALL</a></p>
<p style="color:#555">Votre réputation est entre de bonnes mains.</p>
</div>`;
}

function clientMailHtml(body: string) {
  return `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.6;white-space:pre-wrap;max-width:560px">${escapeHtml(body)}</div>`;
}

function clientEmailScheduledAt() {
  const delayInMinutes = 17 + Math.floor(Math.random() * 7);
  return new Date(Date.now() + delayInMinutes * 60 * 1000).toISOString();
}

export async function autoRespondToReview(
  reviewId: number,
): Promise<AutoRespondResult> {
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    return {
      ok: false,
      error: "Avis introuvable.",
      clientEmailed: false,
      ownerNotified: false,
      autoReplyText: null,
    };
  }

  const review = await db.orm.public.Review.where({ id: reviewId }).first();

  if (!review) {
    return {
      ok: false,
      error: "Avis introuvable.",
      clientEmailed: false,
      ownerNotified: false,
      autoReplyText: null,
    };
  }

  if (![1, 2, 3].includes(review.rating)) {
    return {
      ok: true,
      clientEmailed: false,
      ownerNotified: false,
      autoReplyText: null,
    };
  }

  const restaurant = await db.orm.public.Restaurant.where({
    id: review.restaurantId,
  }).first();

  if (!restaurant) {
    return {
      ok: false,
      error: "Établissement introuvable.",
      clientEmailed: false,
      ownerNotified: false,
      autoReplyText: null,
    };
  }
  const autoReplyText = await generateCalmingReply({
    establishmentName: restaurant.name,
    activity: activityLabel(restaurant.activity, restaurant.category),
    city: cityLabel(restaurant.city, restaurant.address),
    rating: review.rating,
    comment: review.comment,
    authorName: review.authorName,
    cuisineRating: review.cuisineRating,
    serviceRating: review.serviceRating,
    ambianceRating: review.ambianceRating,
  });

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESEND_FROM?.trim() || "LOCALL <onboarding@resend.dev>";
  const dashboardUrl = `${appUrl()}/dashboard`;
  const ownerEmail =
    restaurant.ownerEmail?.trim() || process.env.OWNER_EMAIL?.trim() || "";
  const contact = review.contact?.trim() || "";
  const clientEmail = isEmail(contact) ? contact : "";

  let clientEmailed = false;
  let ownerNotified = false;

  if (resendKey) {
    const resend = new Resend(resendKey);

    if (clientEmail) {
      const sent = await resend.emails.send({
        from,
        to: clientEmail,
        replyTo: ownerEmail || undefined,
        subject: `Un mot de ${restaurant.name}`,
        html: clientMailHtml(autoReplyText),
        scheduledAt: clientEmailScheduledAt(),
      });
      clientEmailed = !sent.error;
    }

    if (ownerEmail && isEmail(ownerEmail)) {
      const sent = await resend.emails.send({
        from,
        to: ownerEmail,
        subject: `🛡️ [LOCALL Protection] Mauvais avis intercepté pour ${restaurant.name} !`,
        html: ownerAlertHtml({
          restaurantName: restaurant.name,
          activity: activityLabel(restaurant.activity, restaurant.category),
          category: restaurant.category,
          rating: review.rating,
          comment: review.comment,
          cuisineRating: review.cuisineRating,
          serviceRating: review.serviceRating,
          ambianceRating: review.ambianceRating,
          clientEmailed,
          dashboardUrl,
        }),
      });
      ownerNotified = !sent.error;
    }
  }

  await db.orm.public.Review.where({ id: reviewId }).update({
    autoReplyText,
    status: "RESOLVED_AUTO",
    clientEmailed,
    ownerNotified,
  });

  return { ok: true, clientEmailed, ownerNotified, autoReplyText };
}
