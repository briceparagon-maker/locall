"use client";

import { useState, useTransition, type FormEvent } from "react";
import { resetPassword } from "./actions";

export function ResetForm({
  email,
  exp,
  sig,
}: {
  email: string;
  exp: string;
  sig: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="exp" value={exp} />
      <input type="hidden" name="sig" value={sig} />
      <label className="label-locall">
        Nouveau mot de passe
        <span className="mt-1 flex gap-2">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            className="input-locall mt-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="btn-locall-ghost shrink-0"
          >
            {showPassword ? "Masquer" : "Afficher"}
          </button>
        </span>
      </label>
      <label className="label-locall">
        Confirmer le mot de passe
        <input
          name="passwordConfirm"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          className="input-locall"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={pending} className="btn-locall-cta h-12 w-full">
        {pending ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </button>
    </form>
  );
}
