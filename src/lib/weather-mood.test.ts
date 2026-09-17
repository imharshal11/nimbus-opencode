import { describe, it, expect } from "vitest";
import { getWeatherMood, MOOD_THRESHOLDS } from "./weather-mood";

describe("getWeatherMood", () => {
  const baseInput = { temp_c: 20, humidity: 50, wind_kph: 10 };

  describe("Windy (priority 1)", () => {
    it("returns Windy at wind_kph >= 30", () => {
      expect(getWeatherMood({ ...baseInput, wind_kph: 30 })).toBe("Windy");
      expect(getWeatherMood({ ...baseInput, wind_kph: 35 })).toBe("Windy");
      expect(getWeatherMood({ ...baseInput, wind_kph: 50 })).toBe("Windy");
    });

    it("returns Windy even when other conditions match", () => {
      expect(
        getWeatherMood({ temp_c: 35, humidity: 80, wind_kph: 30 })
      ).toBe("Windy");
      expect(
        getWeatherMood({ temp_c: 5, humidity: 90, wind_kph: 30 })
      ).toBe("Windy");
    });

    it("does not return Windy at wind_kph 29.9", () => {
      expect(getWeatherMood({ ...baseInput, wind_kph: 29.9 })).not.toBe(
        "Windy"
      );
    });
  });

  describe("Uncomfortable (priority 2)", () => {
    it("returns Uncomfortable at temp_c >= 28 AND humidity >= 70", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 28, humidity: 70 })).toBe(
        "Uncomfortable"
      );
      expect(getWeatherMood({ ...baseInput, temp_c: 30, humidity: 80 })).toBe(
        "Uncomfortable"
      );
      expect(getWeatherMood({ ...baseInput, temp_c: 34, humidity: 90 })).toBe(
        "Uncomfortable"
      );
    });

    it("does not return Uncomfortable at temp_c 27.9", () => {
      expect(
        getWeatherMood({ ...baseInput, temp_c: 27.9, humidity: 70 })
      ).not.toBe("Uncomfortable");
    });

    it("does not return Uncomfortable at humidity 69.9", () => {
      expect(
        getWeatherMood({ ...baseInput, temp_c: 28, humidity: 69.9 })
      ).not.toBe("Uncomfortable");
    });

    it("Windy takes precedence over Uncomfortable", () => {
      expect(
        getWeatherMood({ temp_c: 30, humidity: 80, wind_kph: 30 })
      ).toBe("Windy");
    });
  });

  describe("Hot (priority 3)", () => {
    it("returns Hot at temp_c >= 35", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 35 })).toBe("Hot");
      expect(getWeatherMood({ ...baseInput, temp_c: 40 })).toBe("Hot");
    });

    it("does not return Hot at temp_c 34.9", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 34.9 })).not.toBe("Hot");
    });

    it("Uncomfortable takes precedence over Hot", () => {
      expect(getWeatherMood({ temp_c: 35, humidity: 70, wind_kph: 10 })).toBe(
        "Uncomfortable"
      );
    });

    it("Windy takes precedence over Hot", () => {
      expect(getWeatherMood({ temp_c: 40, humidity: 50, wind_kph: 30 })).toBe(
        "Windy"
      );
    });
  });

  describe("Cold (priority 4)", () => {
    it("returns Cold at temp_c <= 10", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 10 })).toBe("Cold");
      expect(getWeatherMood({ ...baseInput, temp_c: 5 })).toBe("Cold");
      expect(getWeatherMood({ ...baseInput, temp_c: 0 })).toBe("Cold");
      expect(getWeatherMood({ ...baseInput, temp_c: -10 })).toBe("Cold");
    });

    it("does not return Cold at temp_c 10.1", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 10.1 })).not.toBe("Cold");
    });

    it("Windy takes precedence over Cold", () => {
      expect(getWeatherMood({ temp_c: 5, humidity: 50, wind_kph: 30 })).toBe(
        "Windy"
      );
    });

    it("Uncomfortable takes precedence over Cold (when temp >= 28)", () => {
      expect(
        getWeatherMood({ temp_c: 28, humidity: 70, wind_kph: 10 })
      ).toBe("Uncomfortable");
    });
  });

  describe("Pleasant (default, priority 5)", () => {
    it("returns Pleasant for moderate conditions", () => {
      expect(getWeatherMood({ temp_c: 22, humidity: 50, wind_kph: 10 })).toBe(
        "Pleasant"
      );
      expect(getWeatherMood({ temp_c: 15, humidity: 60, wind_kph: 15 })).toBe(
        "Pleasant"
      );
      expect(getWeatherMood({ temp_c: 25, humidity: 65, wind_kph: 20 })).toBe(
        "Pleasant"
      );
    });

    it("returns Pleasant at boundary temp_c 10.1", () => {
      expect(getWeatherMood({ temp_c: 10.1, humidity: 50, wind_kph: 10 })).toBe(
        "Pleasant"
      );
    });

    it("returns Pleasant at boundary temp_c 27.9, humidity 69", () => {
      expect(
        getWeatherMood({ temp_c: 27.9, humidity: 69, wind_kph: 10 })
      ).toBe("Pleasant");
    });

    it("returns Pleasant at boundary temp_c 34.9, humidity 69", () => {
      expect(
        getWeatherMood({ temp_c: 34.9, humidity: 69, wind_kph: 10 })
      ).toBe("Pleasant");
    });
  });

  describe("threshold constants are exported", () => {
    it("MOOD_THRESHOLDS.windy.wind_kph equals 30", () => {
      expect(MOOD_THRESHOLDS.windy.wind_kph).toBe(30);
    });

    it("MOOD_THRESHOLDS.uncomfortable.temp_c equals 28", () => {
      expect(MOOD_THRESHOLDS.uncomfortable.temp_c).toBe(28);
    });

    it("MOOD_THRESHOLDS.uncomfortable.humidity equals 70", () => {
      expect(MOOD_THRESHOLDS.uncomfortable.humidity).toBe(70);
    });

    it("MOOD_THRESHOLDS.hot.temp_c equals 35", () => {
      expect(MOOD_THRESHOLDS.hot.temp_c).toBe(35);
    });

    it("MOOD_THRESHOLDS.cold.temp_c equals 10", () => {
      expect(MOOD_THRESHOLDS.cold.temp_c).toBe(10);
    });
  });
});