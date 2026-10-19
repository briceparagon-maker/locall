import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ForgotForm } from "./forgot-form";

export default function MotDePasseOubliePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <section className="card-locall p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-locall-navy">Mot de passe perdu</h1>
          <p className="mt-2 text-sm text-slate-500">
            Entrez l’e-mail de votre compte. Nous vous enverrons un lien pour
            choisir un nouveau mot de passe.
          </p>
          <ForgotForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
