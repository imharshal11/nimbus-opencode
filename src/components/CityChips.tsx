"use client";

import { type PresetCity } from "@/lib/constants";

interface CityChipsProps {
  cities: readonly PresetCity[];
  activeCity: string | null;
  onSelect: (city: string) => void;
  disabled?: boolean;
}

export function CityChips({ cities, activeCity, onSelect, disabled }: CityChipsProps) {
  return (
    <div role="group" aria-label="Preset cities" className="flex flex-wrap gap-2">
      {cities.map((city) => (
        <button
          key={city}
          type="button"
          onClick={() => onSelect(city)}
          disabled={disabled}
          className={`inline-flex items-center px-3 py-1.5 rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-current)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
            activeCity === city
              ? "border-[var(--accent-current)] text-[var(--accent-current)] bg-transparent"
              : "border-white/12 text-white/80 hover:border-white/30 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
          aria-pressed={activeCity === city}
        >
          <span className="text-chip">{city}</span>
        </button>
      ))}
    </div>
  );
}