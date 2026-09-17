export const MOOD_THRESHOLDS = {
  windy: { wind_kph: 30 },
  uncomfortable: { temp_c: 28, humidity: 70 },
  hot: { temp_c: 35 },
  cold: { temp_c: 10 },
} as const;

export type MoodLabel =
  | "Windy"
  | "Uncomfortable"
  | "Hot"
  | "Cold"
  | "Pleasant";

export interface WeatherMoodInput {
  temp_c: number;
  humidity: number;
  wind_kph: number;
}

export function getWeatherMood(input: WeatherMoodInput): MoodLabel {
  const { temp_c, humidity, wind_kph } = input;

  if (wind_kph >= MOOD_THRESHOLDS.windy.wind_kph) {
    return "Windy";
  }

  if (
    temp_c >= MOOD_THRESHOLDS.uncomfortable.temp_c &&
    humidity >= MOOD_THRESHOLDS.uncomfortable.humidity
  ) {
    return "Uncomfortable";
  }

  if (temp_c >= MOOD_THRESHOLDS.hot.temp_c) {
    return "Hot";
  }

  if (temp_c <= MOOD_THRESHOLDS.cold.temp_c) {
    return "Cold";
  }

  return "Pleasant";
}

export const MOOD_COLORS: Record<MoodLabel, string> = {
  Windy: "#f59e0b",
  Uncomfortable: "#ef4444",
  Hot: "#f97316",
  Cold: "#3b82f6",
  Pleasant: "#22c55e",
};

export const MOOD_LABELS: Record<MoodLabel, string> = {
  Windy: "Windy",
  Uncomfortable: "Uncomfortable",
  Hot: "Hot",
  Cold: "Cold",
  Pleasant: "Pleasant",
};