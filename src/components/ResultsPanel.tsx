"use client";

import { WeatherResponse } from "@/lib/types";
import { getWeatherMood, MOOD_COLORS, MOOD_LABELS } from "@/lib/weather-mood";

interface ResultsPanelProps {
  data: WeatherResponse;
}

export function ResultsPanel({ data }: ResultsPanelProps) {
  const { location, current } = data;
  const mood = getWeatherMood({
    temp_c: current.temp_c,
    humidity: current.humidity,
    wind_kph: current.wind_kph,
  });
  const moodColor = MOOD_COLORS[mood];
  const moodLabel = MOOD_LABELS[mood];

  const iconUrl = current.condition.icon.startsWith("//")
    ? `https:${current.condition.icon}`
    : current.condition.icon;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {location.name}, {location.country}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Observed: {formatLocalTime(location.localtime)}
          </p>
        </div>
        <span
          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full text-white"
          style={{ backgroundColor: moodColor }}
          aria-label={`Weather mood: ${moodLabel}`}
        >
          {moodLabel}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <WeatherCard
          label="Temperature"
          value={`${Math.round(current.temp_c)}°C`}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10c0-5.5-4.5-10-10-10z" />
              <path d="M12 16v-8" />
            </svg>
          }
        />
        <WeatherCard
          label="Humidity"
          value={`${current.humidity}%`}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          }
        />
        <WeatherCard
          label="Wind"
          value={`${current.wind_kph} km/h`}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 14 13H2" />
            </svg>
          }
        />
        <WeatherCard
          label="Condition"
          value={current.condition.text}
          icon={
            <img
              src={iconUrl}
              alt=""
              width="24"
              height="24"
              className="text-slate-500"
              aria-hidden="true"
            />
          }
        />
      </div>
    </article>
  );
}

function WeatherCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50">
      <div className="text-slate-500 mb-2" aria-hidden="true">{icon}</div>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function formatLocalTime(localtime: string): string {
  try {
    const [datePart, timePart] = localtime.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return localtime;
  }
}