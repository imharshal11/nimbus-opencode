"use client";

export function LoadingSkeleton() {
  return (
    <article className="space-y-6" aria-busy="true" aria-label="Loading weather data">
      <header className="text-center space-y-2">
        <div className="h-7 w-48 mx-auto bg-white/10 rounded animate-pulse" style={{ animationDuration: '1.4s' }} />
        <div className="h-4 w-32 mx-auto bg-white/10 rounded animate-pulse" style={{ animationDuration: '1.4s', animationDelay: '0.2s' }} />
      </header>

      <div className="text-center space-y-1">
        <div className="h-[96px] w-24 mx-auto bg-white/10 rounded animate-pulse" style={{ animationDuration: '1.4s', animationDelay: '0.4s' }} />
        <div className="h-4 w-20 mx-auto bg-white/10 rounded animate-pulse" style={{ animationDuration: '1.4s', animationDelay: '0.6s' }} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center text-center relative">
            <div className="h-10 w-20 mx-auto bg-white/10 rounded animate-pulse" style={{ animationDuration: '1.4s', animationDelay: `${0.8 + i * 0.1}s` }} />
            <div className="h-3 w-16 mx-auto mt-2 bg-white/10 rounded animate-pulse" style={{ animationDuration: '1.4s', animationDelay: `${1.0 + i * 0.1}s` }} />
            {i < 3 && (
              <div className="absolute right-0 top-1/3 bottom-1/3 w-px bg-white/10" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </article>
  );
}