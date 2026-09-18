"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";

interface SearchInputProps {
  onSearch: (city: string) => void;
  onClear: () => void;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  value: string;
}

interface SearchInputRef {
  focus: () => void;
}

export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  ({ onSearch, onClear, onChange, disabled, placeholder = "Enter a city name", value }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim()) {
        onSearch(value.trim());
      }
    };

    const handleClear = () => {
      onChange("");
      onClear();
      inputRef.current?.focus();
    };

    return (
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="city-search" className="sr-only">
          Search for a city
        </label>
        <input
          ref={inputRef}
          id="city-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-20 text-base border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          autoComplete="off"
          spellCheck={false}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-11 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:text-slate-900 transition-colors disabled:opacity-50"
            aria-label="Clear search"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-accent focus:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M15 15l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";