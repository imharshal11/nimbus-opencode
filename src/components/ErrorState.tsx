"use client";

interface ErrorStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export function ErrorState({ message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="text-center py-12" role="alert">
      <p className="text-body opacity-70 mb-4">{message}</p>
      <button
        onClick={onAction}
        className="inline-flex items-center text-body text-[var(--accent-current)] underline underline-offset-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-current)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded transition-opacity"
        style={{ textUnderlineOffset: '2px' }}
      >
        {actionLabel}
      </button>
    </div>
  );
}