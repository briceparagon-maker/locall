"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export function ForgotForm() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if (!result.ok) setError(result.error);
      else setMessage(result.message);
    });
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="label-locall">
        Email
        <input name="email" type="email" required className="input-locall" />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <button type="submit" disabled={pending} className="btn-locall-cta h-12 w-full">
        {pending ? "Envoi…" : "Recevoir le lien"}
      </button>
      <p className="text-center text-sm text-slate-500">
        <Link href="/connexion" className="link-locall">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
