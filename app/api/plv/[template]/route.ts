import { appUrl } from "@/lib/app-url";
import { buildPlvPdf, isPlvTemplate, plvFilename } from "@/lib/plv-pdf";
import { getOwnerRestaurantId } from "@/lib/session";
import { db } from "@/src/prisma/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ template: string }> },
) {
  const { template } = await params;
  if (!isPlvTemplate(template)) {
    return new Response("Modele introuvable.", { status: 404 });
  }

  const restaurantId = await getOwnerRestaurantId();
  if (!restaurantId) {
    return new Response("Connexion requise.", { status: 401 });
  }

  const restaurant = await db.orm.public.Restaurant.where({
    id: restaurantId,
  }).first();

  if (!restaurant) {
    return new Response("Aucun etablissement.", { status: 404 });
  }

  const slug = restaurant.slug ?? String(restaurant.id);
  const bytes = await buildPlvPdf({
    template,
    restaurantName: restaurant.name,
    reviewUrl: `${appUrl()}/r/${slug}`,
  });

  return new Response(new Uint8Array(bytes).buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${plvFilename(template, slug)}"`,
      "Cache-Control": "no-store",
    },
  });
}
