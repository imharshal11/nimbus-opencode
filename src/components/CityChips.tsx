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
          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
            activeCity === city
              ? "bg-accent text-accent-foreground border-accent shadow-sm"
              : "bg-white text-slate-700 border-slate-300 hover:border-accent hover:text-accent focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
          aria-pressed={activeCity === city}
        >
          {city}
        </button>
      ))}
    </div>
  );
}