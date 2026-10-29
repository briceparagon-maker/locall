-- Isolation Data API Supabase.
-- Refus par défaut pour anon et authenticated.
-- Ne pas activer FORCE ROW LEVEL SECURITY.
-- Ne pas changer le rôle utilisé par Prisma.
-- Ne pas exécuter sur la production sans accord explicite.
-- Le formulaire QR écrit via le serveur Next.js, pas via la clé anon.

ALTER TABLE public."Restaurant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Accès Établissement réservé aux propriétaires" ON public."Restaurant";
DROP POLICY IF EXISTS "Accès Établissement réservé au propriétaire" ON public."Restaurant";

DROP POLICY IF EXISTS "Autoriser l'insertion anonyme d'avis" ON public."Review";
DROP POLICY IF EXISTS "Autoriser la création d'avis avec restaurantId" ON public."Review";
DROP POLICY IF EXISTS "Lecture des avis pour les utilisateurs connectés" ON public."Review";
DROP POLICY IF EXISTS "Lecture des avis réservée aux commerçants" ON public."Review";
DROP POLICY IF EXISTS "Modification des avis pour les utilisateurs connectés" ON public."Review";
DROP POLICY IF EXISTS "Modification des avis réservée au propriétaire" ON public."Review";
