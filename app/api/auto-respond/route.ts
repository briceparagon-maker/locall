import { autoRespondToReview } from "@/lib/auto-respond";

export async function POST(request: Request) {
  let reviewId = 0;
  try {
    const body = (await request.json()) as { reviewId?: number };
    reviewId = Number(body.reviewId);
  } catch {
    return Response.json(
      { ok: false, error: "Corps JSON invalide." },
      { status: 400 },
    );
  }

  const result = await autoRespondToReview(reviewId);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
