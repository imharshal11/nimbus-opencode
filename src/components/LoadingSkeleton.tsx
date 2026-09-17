"use client";

export function LoadingSkeleton() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse" aria-busy="true" aria-label="Loading weather data">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="mt-2 h-4 w-32 bg-slate-200 rounded" />
        </div>
        <div className="h-8 w-28 bg-slate-200 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50">
            <div className="w-6 h-6 bg-slate-200 rounded mb-2" />
            <div className="h-8 w-16 bg-slate-200 rounded mb-1" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </article>
  );
}