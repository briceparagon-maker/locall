"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { loginOwner } from "./actions";

export function ConnexionForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await loginOwner(formData);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="label-locall">
        Email
        <input name="email" type="email" required className="input-locall" />
      </label>
      <label className="label-locall">
        Mot de passe
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input-locall"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <p className="text-right text-sm">
        <Link href="/mot-de-passe-oublie" className="link-locall">
          Mot de passe perdu
        </Link>
      </p>
      <button type="submit" disabled={pending} className="btn-locall-cta h-12 w-full uppercase tracking-wide">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="link-locall">
          Activer l’essai gratuit
        </Link>
      </p>
    </form>
  );
}
