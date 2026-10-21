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
