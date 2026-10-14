-- Sécurisation public."Review" (Supabase RLS)
-- Le rôle service_role contourne la RLS. Prisma via DIRECT_URL (owner)
-- aussi, tant que FORCE ROW LEVEL SECURITY n'est pas activé.

ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autoriser l'insertion anonyme d'avis" ON public."Review";
CREATE POLICY "Autoriser l'insertion anonyme d'avis"
  ON public."Review"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Lecture des avis pour les utilisateurs connectés" ON public."Review";
CREATE POLICY "Lecture des avis pour les utilisateurs connectés"
  ON public."Review"
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Modification des avis pour les utilisateurs connectés" ON public."Review";
CREATE POLICY "Modification des avis pour les utilisateurs connectés"
  ON public."Review"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
