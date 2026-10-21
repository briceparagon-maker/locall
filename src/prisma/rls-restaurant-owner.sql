-- Lier l'accès Restaurant à l'utilisateur Auth (auth.uid()).
-- La table n'avait pas de user_id / ownerId : on ajoute "userId" UUID
-- et on le remplit depuis auth.users.email = "ownerEmail" quand c'est possible.

ALTER TABLE public."Restaurant" ADD COLUMN IF NOT EXISTS "userId" UUID;

UPDATE public."Restaurant" AS r
SET "userId" = u.id
FROM auth.users AS u
WHERE r."userId" IS NULL
  AND r."ownerEmail" IS NOT NULL
  AND lower(u.email) = lower(r."ownerEmail");

ALTER TABLE public."Restaurant" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Accès Établissement réservé aux propriétaires" ON public."Restaurant";
DROP POLICY IF EXISTS "Accès Établissement réservé au propriétaire" ON public."Restaurant";

CREATE POLICY "Accès Établissement réservé au propriétaire"
  ON public."Restaurant"
  FOR ALL
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");
