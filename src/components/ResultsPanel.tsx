"use client";

import { WeatherResponse } from "@/lib/types";
import { getWeatherMood, MOOD_LABELS } from "@/lib/weather-mood";

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
  const moodLabel = MOOD_LABELS[mood];

  const iconUrl = current.condition.icon.startsWith("//")
    ? `https:${current.condition.icon}`
    : current.condition.icon;

  return (
    <article className="space-y-6" aria-label="Current weather">
      <header className="text-center space-y-2">
        <h2 className="text-city-name">{location.name}, {location.country}</h2>
        <p className="text-[12px] opacity-45">
          Observed: {formatLocalTime(location.localtime)}
        </p>
      </header>

      <div className="text-center space-y-1">
        <p className="text-temp-hero sm:text-temp-hero-mobile" aria-label={`Temperature ${Math.round(current.temp_c)} degrees Celsius`}>
          {Math.round(current.temp_c)}<span style={{ fontSize: '0.5em', verticalAlign: 'super' }}>°</span>
        </p>
        <p className="text-mood-label" style={{ color: `var(--accent-${mood.toLowerCase()})` }} aria-label={`Weather mood: ${moodLabel}`}>
          {moodLabel}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4" role="list" aria-label="Weather metrics">
        <div className="flex flex-col items-center text-center relative" role="listitem">
          <p className="text-metric-value" aria-label={`Humidity ${current.humidity} percent`}>
            {current.humidity}%
          </p>
          <p className="text-metric-label opacity-55">Humidity</p>
          <div className="absolute right-0 top-1/3 bottom-1/3 w-px bg-white/10" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center text-center relative" role="listitem">
          <p className="text-metric-value" aria-label={`Wind ${current.wind_kph} kilometers per hour`}>
            {current.wind_kph} km/h
          </p>
          <p className="text-metric-label opacity-55">Wind</p>
          <div className="absolute right-0 top-1/3 bottom-1/3 w-px bg-white/10" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center text-center" role="listitem">
          <div className="flex items-center gap-2 mb-1" aria-hidden="true">
            <img src={iconUrl} alt="" width="24" height="24" />
          </div>
          <p className="text-metric-value" aria-label={`Condition ${current.condition.text}`}>
            {current.condition.text}
          </p>
          <p className="text-metric-label opacity-55">Condition</p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 380px) {
          .grid.grid-cols-3 {
            grid-template-columns: 1fr 1fr;
          }
          .grid.grid-cols-3 > div:nth-child(3) {
            grid-column: span 2;
          }
          .grid.grid-cols-3 > div:nth-child(1) .absolute,
          .grid.grid-cols-3 > div:nth-child(2) .absolute {
            display: none;
          }
        }
      `}</style>
    </article>
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