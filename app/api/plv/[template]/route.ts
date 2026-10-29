import { appUrl } from "@/lib/app-url";
import { buildPlvPdf, isPlvTemplate, plvFilename } from "@/lib/plv-pdf";
import { requireOwnerSession } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ template: string }> },
) {
  const { template } = await params;
  if (!isPlvTemplate(template)) {
    return new Response("Modele introuvable.", { status: 404 });
  }

  const session = await requireOwnerSession();
  if (!session) {
    return new Response("Connexion requise.", { status: 401 });
  }

  const restaurant = session.restaurant;

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
