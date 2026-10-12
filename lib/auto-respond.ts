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

function activityLabel(category: string) {
  if (category === "restaurant") return "restaurant";
  return category || "commerce";
}

function starsLine(rating: number) {
  return `${rating}/5 ★`;
}

function fallbackReply(input: {
  restaurantName: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
}) {
  const firstName = input.authorName?.split(" ")[0] ?? "bonjour";
  const comment = input.comment?.trim()
    ? ` Nous avons bien pris en compte votre message : « ${input.comment.trim()} ».`
    : "";
  return `Bonjour ${firstName},\n\nMerci d’avoir pris le temps de nous écrire après votre visite chez ${input.restaurantName} (${starsLine(input.rating)}).${comment}\n\nNous sommes sincèrement désolés que l’expérience n’ait pas été à la hauteur. La direction va regarder cela de très près et vous recontactera en priorité. En attendant, nous vous proposons un geste commercial dès votre prochaine visite — il vous suffit de vous présenter à l’accueil.\n\nAvec nos excuses,\nL’équipe ${input.restaurantName}`;
}

async function generateCalmingReply(input: {
  restaurantName: string;
  category: string;
  rating: number;
  comment: string | null;
  authorName: string | null;
  cuisineRating: number | null;
  serviceRating: number | null;
  ambianceRating: number | null;
}) {
  const details = [
    input.cuisineRating ? `Cuisine ${input.cuisineRating}/5` : null,
    input.serviceRating ? `Service ${input.serviceRating}/5` : null,
    input.ambianceRating ? `Ambiance ${input.ambianceRating}/5` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const fallback = fallbackReply(input);
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return fallback;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`Tu rédiges un e-mail d'apaisement, en français, au nom d'un établissement local.

Consignes :
- Ton bienveillant, sincère, jamais défensif.
- Pas de markdown, pas de sujet, uniquement le corps du mail (tutoiement ou vouvoiement selon le prénom s'il est formel : vouvoie par défaut).
- 120 à 180 mots.
- Reconnaître la note et le commentaire.
- Proposer un geste concret (recontact sous 1h / invitation à revenir).
- Signer au nom de l'équipe de l'établissement.

Établissement : ${input.restaurantName}
Type d'activité : ${activityLabel(input.category)}
Note globale : ${starsLine(input.rating)}
Détails : ${details || "non précisés"}
Prénom / nom du client : ${input.authorName || "non communiqué"}
Commentaire : ${input.comment || "(aucun commentaire)"}`);
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
    ? "L'avis N'A PAS été publié sur Google. Une réponse d'apaisement ultra-bienveillante a été rédigée par Gemini et envoyée automatiquement au client."
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
    restaurantName: restaurant.name,
    category: restaurant.category,
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
