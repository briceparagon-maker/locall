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

function isHospitalityActivity(activity: string) {
  const value = activity.toLowerCase();
  return [
    "restaurant",
    "brasserie",
    "café",
    "cafe",
    "bar",
    "boulangerie",
    "pâtisserie",
    "patisserie",
    "hôtel",
    "hotel",
  ].some((token) => value.includes(token));
}

function fallbackReply(input: {
  establishmentName: string;
  activity: string;
  city: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
}) {
  const firstName = input.authorName?.split(" ")[0] ?? "bonjour";
  const location = input.city ? ` à ${input.city}` : "";
  const comment = input.comment?.trim()
    ? ` Nous avons bien pris en compte votre message : « ${input.comment.trim()} ».`
    : "";
  const hospitality = isHospitalityActivity(input.activity);
  const place = input.city || "votre quartier";
  const opening = hospitality
    ? `Toute l’équipe de ${input.establishmentName}, votre ${input.activity}${location}, prend votre remarque très au sérieux.`
    : `La direction de ${input.establishmentName}, votre ${input.activity} basé à ${place}, vous remercie pour votre retour.`;
  const nextStep = hospitality
    ? "Nous vous proposons un geste commercial dès votre prochaine visite — il vous suffit de vous présenter à l’accueil."
    : "Nous vous recontacterons en priorité pour trouver une solution concrète, adaptée à votre situation.";

  return `Bonjour ${firstName},\n\n${opening} (${starsLine(input.rating)}).${comment}\n\nNous sommes sincèrement désolés que l’expérience n’ait pas été à la hauteur. ${nextStep}\n\nAvec nos excuses,\nL’équipe ${input.establishmentName}${location}`;
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

  return `Tu rédiges un e-mail d'apaisement, en français, au nom d'un établissement local. Il doit s'appliquer à TOUT type de commerce ou de service (restaurant, commerce de détail, artisan, garage, salon, profession libérale, santé, etc.) — jamais un ton uniquement « restaurant ».

Variables à exploiter (obligatoires, à insérer naturellement dans le corps du texte, sans crochets) :
- Nom de l'établissement : ${input.establishmentName}
- Type d'activité / métier : ${input.activity}
- Ville ou quartier : ${location}

SEO local :
- Rédige une réponse ultra-bienveillante, empathique et professionnelle, adaptée au secteur « ${input.activity} ».
- Glisse naturellement le nom, le métier et la localisation (ex. « ${input.establishmentName}, votre ${input.activity} à ${location} ») pour renforcer le référencement local, sans stuffing ni liste de mots-clés.

Ton selon le secteur (choisis le plus proche, sans copier mot pour mot) :
- Commerce / artisanat / hospitalité : « Toute l'équipe de ${input.establishmentName}, votre ${input.activity} à ${location}, prend votre remarque très au sérieux... »
- Service / santé / automobile / profession libérale : « La direction de ${input.establishmentName}, votre ${input.activity} basé à ${location}, vous remercie pour votre retour... »

Consignes :
- Ton sincère, jamais défensif, jamais infantilisant.
- Pas de markdown, pas de sujet, uniquement le corps du mail. Vouvoie par défaut.
- 120 à 180 mots.
- Reconnaître la note et le commentaire (s'il y en a un) avec le vocabulaire du métier, pas celui d'un restaurant si ce n'en est pas un (évite « plat », « cuisine », « visite à table » hors restauration).
- Proposer un geste concret adapté au secteur (rappel sous 1h, nouveau rendez-vous, geste commercial, reprise du dossier, etc.).
- Signer au nom de l'équipe de ${input.establishmentName}.

Note globale : ${starsLine(input.rating)}
Détails de notation : ${details || "non précisés"}
Prénom / nom du client : ${input.authorName || "non communiqué"}
Commentaire : ${input.comment || "(aucun commentaire)"}`;
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
  rating: number;
  comment: string | null;
  cuisineRating: number | null;
  serviceRating: number | null;
  ambianceRating: number | null;
  clientEmailed: boolean;
  dashboardUrl: string;
}) {
  const details = [
    input.cuisineRating ? `Cuisine : ${input.cuisineRating}/5` : null,
    input.serviceRating ? `Service : ${input.serviceRating}/5` : null,
    input.ambianceRating ? `Ambiance : ${input.ambianceRating}/5` : null,
  ]
    .filter(Boolean)
    .join(", ");
  const excerpt = (input.comment ?? "").trim() || "Aucun commentaire.";
  const action = input.clientEmailed
    ? "L'avis N'A PAS été publié sur Google. Une réponse d'apaisement ultra-bienveillante a été générée et sera envoyée automatiquement au client dans 40 à 55 minutes."
    : "L'avis N'A PAS été publié sur Google. Le client n'a pas laissé d'e-mail : la réponse d'apaisement est prête dans votre dashboard.";

  return `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;max-width:560px">
<p style="font-size:18px;font-weight:700;margin:0 0 12px">Excellente nouvelle : Votre réputation sur Google reste intacte !</p>
<p>Un client mécontent vient de déposer un avis de ${escapeHtml(starsLine(input.rating))} sur votre Smart QR Code.</p>
<ul>
<li><strong>Note interceptée :</strong> ${escapeHtml(starsLine(input.rating))}${details ? ` (${escapeHtml(details)})` : ""}</li>
<li><strong>Commentaire client :</strong> "${escapeHtml(excerpt)}"</li>
<li><strong>Action LOCALL :</strong> ${escapeHtml(action)}</li>
</ul>
<p><a href="${escapeHtml(input.dashboardUrl)}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600">👉 Consulter les détails sur votre Dashboard LOCALL</a></p>
<p style="color:#555">Votre réputation est entre de bonnes mains.</p>
</div>`;
}

function clientMailHtml(body: string) {
  return `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.6;white-space:pre-wrap;max-width:560px">${escapeHtml(body)}</div>`;
}

function clientEmailScheduledAt() {
  const delayInMinutes = 40 + Math.floor(Math.random() * 16);
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
