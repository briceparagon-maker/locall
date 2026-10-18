"use client";

export function InterceptInfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intercept-info-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          id="intercept-info-title"
          className="text-lg font-semibold leading-snug text-locall-navy"
        >
          💡 Important à savoir :
        </h3>
        <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
          <p>
            <strong>Protection à 100 % :</strong> Notre application gère les
            avis sensibles (1/5, 2/5 et 3/5) directement en interne. Tant que
            le client scanne votre QR code en établissement, son avis négatif
            est intercepté à 100 % avant d&apos;atteindre votre fiche Google.
          </p>
          <p>
            <strong>Maximisez vos résultats :</strong> Plus vous disposez de
            présentoirs et de stickers QR codes (sur vos tables, au comptoir ou
            en vitrine), plus vos clients seront incités à vous donner leur
            avis dans votre établissement.
          </p>
          <p>
            <strong>Un cercle vertueux :</strong> Vous récoltez un maximum
            d’avis positifs sur Google et/ou Facebook, tout en protégeant votre
            note et votre réputation des mauvaises surprises.
          </p>
          <p className="font-semibold text-locall-navy">
            Votre note peut progresser ? Faisons-la monter.
          </p>
          <p className="font-semibold text-locall-navy">
            Elle est déjà excellente ? Préservons-la.
          </p>
          <p>
            Dans les deux cas, l’objectif reste le même : renforcer durablement
            votre réputation et la confiance de vos futurs clients.
          </p>
        </div>
        <button type="button" onClick={onClose} className="btn-locall-ghost mt-6">
          Fermer
        </button>
      </div>
    </div>
  );
}
