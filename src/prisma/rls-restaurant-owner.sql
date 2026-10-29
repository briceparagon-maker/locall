-- L'application n'utilise pas Supabase Auth ni la colonne "userId".
-- Les politiques qui comparaient auth.uid() à "userId" sont retirées.
-- Ne pas exécuter sur la production sans accord explicite.
-- Ne pas activer FORCE ROW LEVEL SECURITY.

ALTER TABLE public."Restaurant" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Accès Établissement réservé aux propriétaires" ON public."Restaurant";
DROP POLICY IF EXISTS "Accès Établissement réservé au propriétaire" ON public."Restaurant";
