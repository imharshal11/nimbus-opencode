"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PRESET_CITIES } from "@/lib/constants";
import { SearchInput } from "@/components/SearchInput";
import { CityChips } from "@/components/CityChips";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ResponseInspector } from "@/components/ResponseInspector";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import type { WeatherResponse, WeatherState } from "@/lib/types";

export default function Home() {
  const [state, setState] = useState<WeatherState>("idle");
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeather = useCallback(async (city: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState("loading");
    setError(null);
    setActiveCity(city);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
        signal: abortControllerRef.current.signal,
      });

      if (response.status === 404) {
        setState("empty");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error ?? "Failed to fetch weather");
      }

      const weatherData: WeatherResponse = await response.json();
      setData(weatherData);
      setState("success");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setState("error");
    }
  }, []);

  const handleSearch = useCallback((city: string) => {
    const trimmed = city.trim();
    if (trimmed) {
      fetchWeather(trimmed);
    }
  }, [fetchWeather]);

  const handleRetry = useCallback(() => {
    if (activeCity) {
      fetchWeather(activeCity);
    }
  }, [activeCity, fetchWeather]);

  const handleChipSelect = useCallback((city: string) => {
    setQuery(city);
    fetchWeather(city);
  }, [fetchWeather]);

  const handleClear = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setQuery("");
    setState("idle");
    setData(null);
    setError(null);
    setActiveCity(null);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Nimbus
          </h1>
          <p className="mt-1 text-slate-600 text-sm sm:text-base">
            Current conditions, read at a glance.
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl w-full space-y-6">
          <SearchInput
            onSearch={handleSearch}
            onClear={handleClear}
            onChange={setQuery}
            disabled={state === "loading"}
            placeholder="Enter a city name"
            value={query}
          />

          <CityChips
            cities={PRESET_CITIES}
            activeCity={activeCity}
            onSelect={handleChipSelect}
            disabled={state === "loading"}
          />

          <section aria-live="polite" aria-atomic="true" className="space-y-4">
            {state === "loading" && <LoadingSkeleton />}

            {state === "success" && data && (
              <>
                <ResultsPanel data={data} />
                <ResponseInspector
                  data={data}
                  isOpen={inspectorOpen}
                  onToggle={() => setInspectorOpen((v) => !v)}
                />
              </>
            )}

            {state === "idle" && (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg">Enter a city or tap a chip to begin.</p>
              </div>
            )}

            {state === "empty" && (
              <ErrorState
                message="We couldn't find that city."
                actionLabel="Try another city"
                onAction={handleClear}
              />
            )}

            {state === "error" && error && (
              <ErrorState
                message={error}
                actionLabel="Retry"
                onAction={handleRetry}
              />
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center text-xs text-slate-400">
          Built by Harshal S
        </div>
      </footer>
    </div>
  );
}