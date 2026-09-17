export const PRESET_CITIES = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "London",
  "New York",
  "Tokyo",
  "Dubai",
  "Singapore",
  "Sydney",
  "San Francisco",
] as const;

export type PresetCity = (typeof PRESET_CITIES)[number];