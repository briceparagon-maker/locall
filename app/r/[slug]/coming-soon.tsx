export function ComingSoonPage({ restaurantName }: { restaurantName: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-locall-navy px-6 py-16 text-center text-white">
      <p className="text-xs font-semibold tracking-[0.22em] text-locall-orange">
        LOCALL
      </p>
      <h1 className="mt-6 max-w-md text-3xl font-extrabold leading-tight">
        Établissement bientôt configuré
      </h1>
      <p className="mt-4 max-w-md text-base text-white/80">
        <strong className="text-white">{restaurantName}</strong> prépare encore
        ses supports Smart QR. Revenez dans un instant pour laisser votre avis.
      </p>
    </div>
  );
}
