"use client";

interface ErrorStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export function ErrorState({ message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center" role="alert">
      <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-slate-700 mb-4">{message}</p>
      <button
        onClick={onAction}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-sky-600 focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}