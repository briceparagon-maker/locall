import Link from "next/link";
import { connection } from "next/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { verifyResetToken } from "@/lib/password-reset";
import { ResetForm } from "./reset-form";

export const instant = false;

export default async function ReinitialiserMotDePassePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; exp?: string; nonce?: string; sig?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const email = (params.email ?? "").trim().toLowerCase();
  const exp = params.exp ?? "";
  const nonce = params.nonce ?? "";
  const sig = params.sig ?? "";
  const checked = await verifyResetToken(email, exp, nonce, sig);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <section className="card-locall p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">Nouveau mot de passe</h1>
          {checked.ok ? (
            <>
              <p className="mt-2 text-sm text-slate-500">
                Choisissez un mot de passe d’au moins 8 caractères.
              </p>
              <ResetForm email={email} exp={exp} nonce={nonce} sig={sig} />
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
      <SiteFooter />
    </div>
  );
}
