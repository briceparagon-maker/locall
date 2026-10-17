import Link from "next/link";
import { connection } from "next/server";
import { verifyResetToken } from "@/lib/password-reset";
import { ResetForm } from "./reset-form";

export default async function ReinitialiserMotDePassePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; exp?: string; sig?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const email = (params.email ?? "").trim().toLowerCase();
  const exp = params.exp ?? "";
  const sig = params.sig ?? "";
  const checked = await verifyResetToken(email, exp, sig);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-locall-orange">
            LOCALL
          </p>
          <Link
            href="/connexion"
            className="text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline"
          >
            Connexion
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-12">
        <section className="card-locall p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">Nouveau mot de passe</h1>
          {checked.ok ? (
            <>
              <p className="mt-2 text-sm text-slate-500">
                Choisissez un mot de passe d’au moins 8 caractères.
              </p>
              <ResetForm email={email} exp={exp} sig={sig} />
            </>
          ) : (
            <p className="mt-4 text-sm text-slate-600">
              Ce lien a expiré ou n’est pas valide.{" "}
              <Link href="/mot-de-passe-oublie" className="link-locall">
                Demander un nouveau lien
              </Link>
              .
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
