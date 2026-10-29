import { autoRespondToReview } from "@/lib/auto-respond";
import { isSameOriginPost } from "@/lib/same-origin";
import { requireOwnerSession } from "@/lib/session";

export async function POST(request: Request) {
  if (!isSameOriginPost(request)) {
    return Response.json({ ok: false, error: "Requête refusée." }, { status: 403 });
  }

  const session = await requireOwnerSession();
  if (!session) {
    return Response.json({ ok: false, error: "Connexion requise." }, { status: 401 });
  }

  let reviewId = 0;
  try {
    const body = (await request.json()) as { reviewId?: unknown };
    if (typeof body.reviewId !== "number" || !Number.isInteger(body.reviewId)) {
      return Response.json({ ok: false, error: "Paramètre refusé." }, { status: 400 });
    }
    reviewId = body.reviewId;
  } catch {
    return Response.json(
      { ok: false, error: "Corps JSON invalide." },
      { status: 400 },
    );
  }

  const result = await autoRespondToReview(reviewId, session.restaurantId);
  return Response.json(
    {
      ok: result.ok,
      error: result.error,
      clientEmailed: result.clientEmailed,
      ownerNotified: result.ownerNotified,
      autoReplyText: result.ok ? result.autoReplyText : null,
    },
    { status: result.ok ? 200 : 404 },
  );
}
