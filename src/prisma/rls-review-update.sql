-- Retire les politiques d'avis trop ouvertes.
-- Ne recrée pas de politique fondée sur "userId".
-- Ne pas exécuter sur la production sans accord explicite.

DROP POLICY IF EXISTS "Modification des avis pour les utilisateurs connectés" ON public."Review";
DROP POLICY IF EXISTS "Modification des avis réservée au propriétaire" ON public."Review";
DROP POLICY IF EXISTS "Lecture des avis pour les utilisateurs connectés" ON public."Review";
DROP POLICY IF EXISTS "Lecture des avis réservée aux commerçants" ON public."Review";
DROP POLICY IF EXISTS "Autoriser l'insertion anonyme d'avis" ON public."Review";
DROP POLICY IF EXISTS "Autoriser la création d'avis avec restaurantId" ON public."Review";
