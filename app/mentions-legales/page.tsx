import { LegalShell } from "@/components/legal-shell";

const details = [
  ["Raison sociale", "LVEB GROUP"],
  ["Forme", "Société par actions simplifiée unipersonnelle (SASU)"],
  ["Capital social", "100 €"],
  ["Siège social", "50 avenue des Champs-Elysées, 75008 Paris, France"],
  ["SIREN", "108 641 051"],
  ["SIRET", "108 641 051 00017"],
  ["RCS", "Paris — 108 641 051"],
  ["TVA intracommunautaire", "FR61 108 641 051"],
  ["E-mail", "contact@filtravis.fr"],
] as const;

export default function MentionsLegalesPage() {
  return (
    <LegalShell title="Mentions légales">
      <h2 className="text-base font-semibold text-locall-navy">
        Éditeur du site
      </h2>
      <p>Le site FILTRAVIS.FR est édité par :</p>
      <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200">
        {details.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4"
          >
            <dt className="font-semibold text-locall-navy">{label}</dt>
            <dd>
              {label === "E-mail" ? (
                <a href="mailto:contact@filtravis.fr" className="link-locall">
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="pt-2 text-base font-semibold text-locall-navy">
        Directeur de la publication
      </h2>
      <p>Brice HAISE, Président de LVEB GROUP.</p>

      <h2 className="pt-2 text-base font-semibold text-locall-navy">
        Hébergement et nom de domaine
      </h2>
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-locall-navy">
            Gestionnaire du nom de domaine
          </p>
          <p>LWS (Ligne Web Services)</p>
          <p>Adresse : 10 rue Penthièvre, 75008 Paris, France</p>
          <p>
            Site web :{" "}
            <a
              href="https://www.lws.fr"
              className="link-locall"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.lws.fr
            </a>
          </p>
        </div>
        <div>
          <p className="font-semibold text-locall-navy">
            Hébergeur web (frontend et API)
          </p>
          <p>Vercel Inc.</p>
          <p>Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
          <p>
            Site web :{" "}
            <a
              href="https://vercel.com"
              className="link-locall"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://vercel.com
            </a>
          </p>
        </div>
        <div>
          <p className="font-semibold text-locall-navy">
            Hébergeur base de données (backend)
          </p>
          <p>Supabase Inc.</p>
          <p>
            Adresse : 970 Toa Payoh North #07-04, Singapour 318992 (serveurs
            situés en Union européenne — Francfort)
          </p>
          <p>
            Site web :{" "}
            <a
              href="https://supabase.com"
              className="link-locall"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://supabase.com
            </a>
          </p>
        </div>
      </div>

      <h2 className="pt-2 text-base font-semibold text-locall-navy">Contact</h2>
      <p>
        Pour toute demande relative au site :{" "}
        <a href="mailto:contact@filtravis.fr" className="link-locall">
          contact@filtravis.fr
        </a>
      </p>

      <h2 className="pt-2 text-base font-semibold text-locall-navy">
        Protection des données personnelles (RGPD)
      </h2>
      <p>
        Les informations et données personnelles collectées dans le cadre du
        fonctionnement du service Filtravis.fr (notamment lors du dépôt d’avis
        clients ou de la gestion des établissements) font l’objet d’un
        traitement informatique conforme au Règlement général sur la protection
        des données (RGPD) et à la loi Informatique et Libertés.
      </p>
      <p>
        Conformément à la réglementation en vigueur, vous disposez d’un droit
        d’accès, de rectification, de suppression et d’opposition aux données
        personnelles vous concernant. Pour exercer ce droit, vous pouvez nous
        contacter à l’adresse e-mail de contact indiquée ci-dessus.
      </p>
    </LegalShell>
  );
}
