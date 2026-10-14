export function ReviewSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f9fa] text-[#202124]">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-8">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-[#dadce0]" />
          <div className="mt-4 h-6 w-48 animate-pulse rounded bg-[#dadce0]" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-[#e8eaed]" />
          <div className="mt-5 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-[#e8f0fe]" />
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-[#dadce0]" />
              <div className="h-3 w-16 animate-pulse rounded bg-[#e8eaed]" />
            </div>
          </div>
          <div className="mt-6 h-5 w-64 animate-pulse rounded bg-[#e8eaed]" />
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-11 w-11 animate-pulse rounded-full bg-[#dadce0]"
              />
            ))}
          </div>
        </div>
        <div className="mt-6 h-32 w-full animate-pulse rounded-lg bg-white ring-1 ring-[#dadce0]" />
        <div className="mt-6 h-12 w-full animate-pulse rounded-full bg-[#dadce0]" />
      </main>
    </div>
  );
}
