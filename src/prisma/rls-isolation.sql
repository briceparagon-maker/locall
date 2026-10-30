-- Isolation Data API Supabase.
-- État constaté en lecture seule, sans modification :
--   Restaurant : RLS actif, politique ALL authenticated sur auth.uid() = "userId".
--   Review : insertion anon et authenticated si restaurantId n'est pas vide.
--   Review : lecture authenticated avec USING true.
--   Review : mise à jour authenticated liée à Restaurant.userId = auth.uid().
--   FORCE ROW LEVEL SECURITY est désactivé. Prisma, propriétaire des tables, contourne le RLS.
-- L'application Next.js n'utilise pas Supabase Auth, la colonne userId, ni un client Supabase.
-- Le formulaire QR, le tableau de bord, Stripe et la tâche planifiée écrivent via Prisma.
-- Ce script retire les politiques ouvertes. anon et authenticated se retrouvent sans politique.
-- Ne pas activer FORCE ROW LEVEL SECURITY : le propriétaire Prisma serait alors soumis au refus par défaut.
-- Ne pas changer le rôle utilisé par Prisma.
-- Ne pas exécuter sur la production sans accord explicite.
-- Deux protections distinctes :
--   1. Accès direct Supabase (rôles anon et authenticated). Ce script retire leurs politiques ouvertes.
--      Après exécution, ces rôles n'ont plus de politique : le refus par défaut s'applique à la Data API.
--   2. Isolation applicative Prisma. Le rôle propriétaire contourne le RLS tant que FORCE est désactivé.
--      Les sessions, le slug QR et les filtres du code restent la protection des requêtes Next.js.
--      Fermer les politiques Supabase ne remplace pas ces contrôles et ne les restreint pas.

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
