-- Sécurisation universelle public."Restaurant" + public."Review"
-- Le rôle service_role contourne la RLS. Prisma via DIRECT_URL (owner)
-- aussi, tant que FORCE ROW LEVEL SECURITY n'est pas activé.

ALTER TABLE public."Restaurant" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Restaurant" ADD COLUMN IF NOT EXISTS "userId" UUID;

DROP POLICY IF EXISTS "Accès Établissement réservé aux propriétaires" ON public."Restaurant";
DROP POLICY IF EXISTS "Accès Établissement réservé au propriétaire" ON public."Restaurant";
CREATE POLICY "Accès Établissement réservé au propriétaire"
  ON public."Restaurant"
  FOR ALL
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autoriser l'insertion anonyme d'avis" ON public."Review";
DROP POLICY IF EXISTS "Autoriser la création d'avis avec restaurantId" ON public."Review";
CREATE POLICY "Autoriser la création d'avis avec restaurantId"
  ON public."Review"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK ("restaurantId" IS NOT NULL);

DROP POLICY IF EXISTS "Lecture des avis pour les utilisateurs connectés" ON public."Review";
DROP POLICY IF EXISTS "Lecture des avis réservée aux commerçants" ON public."Review";
CREATE POLICY "Lecture des avis réservée aux commerçants"
  ON public."Review"
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Modification des avis pour les utilisateurs connectés" ON public."Review";
DROP POLICY IF EXISTS "Modification des avis réservée au propriétaire" ON public."Review";
CREATE POLICY "Modification des avis réservée au propriétaire"
  ON public."Review"
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Restaurant" r
      WHERE r.id = "Review"."restaurantId"
        AND r."userId" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Restaurant" r
      WHERE r.id = "Review"."restaurantId"
        AND r."userId" = auth.uid()
    )
  );
