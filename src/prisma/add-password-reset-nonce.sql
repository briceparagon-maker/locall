-- Ajoute le jeton à usage unique de réinitialisation.
-- À exécuter sur la base cible avant le code qui lit password_reset_nonce.
-- Ne pas exécuter sur la production sans accord explicite.

ALTER TABLE public."Restaurant"
  ADD COLUMN IF NOT EXISTS password_reset_nonce TEXT;
