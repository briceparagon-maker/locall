import Link from "next/link";

const ENGAGEMENTS = [
  "Protégez votre image",
  "Augmentez votre visibilité",
  "Gagnez de nouveaux clients",
  "Gagnez du temps au quotidien",
  "Une solution efficace et puissante",
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="bg-locall-navy text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-locall-orange">
              LOCALL
            </p>
            <p className="mt-1 text-sm text-white/80">
              Votre réputation entre de bonnes mains.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-white underline-offset-4 hover:text-locall-orange hover:underline"
          >
            Espace commerçant
          </Link>
        </div>
      </header>

      <main className="w-full">
        <Link href="/inscription" className="block leading-none">
          <img
            src="/stop-aux-mauvais-avis-locall.jpg"
            alt="Stop aux mauvais avis — Activez votre essai LOCALL"
            className="block h-auto w-full"
          />
        </Link>
      </main>

      <footer className="bg-locall-navy text-white">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-5">
          {ENGAGEMENTS.map((item) => (
            <p
              key={item}
              className="text-center text-sm font-medium leading-5 text-white/90"
            >
              {item}
            </p>
          ))}
        </div>
      </footer>
    </div>
  );
}
