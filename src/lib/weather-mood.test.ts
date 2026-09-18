import { describe, it, expect } from "vitest";
import { getWeatherMood, MOOD_THRESHOLDS } from "./weather-mood";

describe("getWeatherMood", () => {
  const baseInput = { temp_c: 20, humidity: 50, wind_kph: 10 };

  describe("Windy (priority 1)", () => {
    it("returns Windy at wind_kph >= 25", () => {
      expect(getWeatherMood({ ...baseInput, wind_kph: 25 })).toBe("Windy");
      expect(getWeatherMood({ ...baseInput, wind_kph: 35 })).toBe("Windy");
      expect(getWeatherMood({ ...baseInput, wind_kph: 50 })).toBe("Windy");
    });

    it("returns Windy even when other conditions match", () => {
      expect(getWeatherMood({ temp_c: 35, humidity: 80, wind_kph: 25 })).toBe(
        "Windy"
      );
      expect(getWeatherMood({ temp_c: 5, humidity: 90, wind_kph: 25 })).toBe(
        "Windy"
      );
    });

    it("does not return Windy at wind_kph 24.9", () => {
      expect(getWeatherMood({ ...baseInput, wind_kph: 24.9 })).not.toBe(
        "Windy"
      );
    });
  });

  describe("Uncomfortable (priority 2)", () => {
    it("returns Uncomfortable at temp_c >= 26 AND humidity >= 65", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 26, humidity: 65 })).toBe(
        "Uncomfortable"
      );
      expect(getWeatherMood({ ...baseInput, temp_c: 30, humidity: 80 })).toBe(
        "Uncomfortable"
      );
      expect(getWeatherMood({ ...baseInput, temp_c: 34, humidity: 90 })).toBe(
        "Uncomfortable"
      );
    });

    it("does not return Uncomfortable at temp_c 25.9", () => {
      expect(
        getWeatherMood({ ...baseInput, temp_c: 25.9, humidity: 65 })
      ).not.toBe("Uncomfortable");
    });

    it("does not return Uncomfortable at humidity 64.9", () => {
      expect(
        getWeatherMood({ ...baseInput, temp_c: 26, humidity: 64.9 })
      ).not.toBe("Uncomfortable");
    });

    it("Windy takes precedence over Uncomfortable", () => {
      expect(getWeatherMood({ temp_c: 30, humidity: 80, wind_kph: 25 })).toBe(
        "Windy"
      );
    });
  });

  describe("Hot (priority 3)", () => {
    it("returns Hot at temp_c >= 30 when humidity is below 65", () => {
      expect(
        getWeatherMood({ temp_c: 30, humidity: 50, wind_kph: 10 })
      ).toBe("Hot");
      expect(
        getWeatherMood({ temp_c: 40, humidity: 30, wind_kph: 10 })
      ).toBe("Hot");
    });

    it("does not return Hot at temp_c 29.9", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 29.9 })).not.toBe("Hot");
    });

    it("Uncomfortable takes precedence over Hot", () => {
      expect(getWeatherMood({ temp_c: 35, humidity: 70, wind_kph: 10 })).toBe(
        "Uncomfortable"
      );
    });

    it("Windy takes precedence over Hot", () => {
      expect(getWeatherMood({ temp_c: 40, humidity: 50, wind_kph: 25 })).toBe(
        "Windy"
      );
    });
  });

  describe("Cold (priority 4)", () => {
    it("returns Cold at temp_c <= 15", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 15 })).toBe("Cold");
      expect(getWeatherMood({ ...baseInput, temp_c: 5 })).toBe("Cold");
      expect(getWeatherMood({ ...baseInput, temp_c: 0 })).toBe("Cold");
      expect(getWeatherMood({ ...baseInput, temp_c: -10 })).toBe("Cold");
    });

    it("does not return Cold at temp_c 15.1", () => {
      expect(getWeatherMood({ ...baseInput, temp_c: 15.1 })).not.toBe("Cold");
    });

    it("Windy takes precedence over Cold", () => {
      expect(getWeatherMood({ temp_c: 5, humidity: 50, wind_kph: 25 })).toBe(
        "Windy"
      );
    });
  });

  describe("Pleasant (default, priority 5)", () => {
    it("returns Pleasant for moderate conditions", () => {
      expect(getWeatherMood({ temp_c: 22, humidity: 50, wind_kph: 10 })).toBe(
        "Pleasant"
      );
      expect(getWeatherMood({ temp_c: 18, humidity: 60, wind_kph: 15 })).toBe(
        "Pleasant"
      );
      expect(getWeatherMood({ temp_c: 25, humidity: 64, wind_kph: 20 })).toBe(
        "Pleasant"
      );
    });

    it("returns Pleasant at boundary temp_c 15.1", () => {
      expect(getWeatherMood({ temp_c: 15.1, humidity: 50, wind_kph: 10 })).toBe(
        "Pleasant"
      );
    });

    it("returns Pleasant at boundary temp_c 25.9, humidity 64", () => {
      expect(getWeatherMood({ temp_c: 25.9, humidity: 64, wind_kph: 10 })).toBe(
        "Pleasant"
      );
    });

    it("returns Pleasant at boundary temp_c 29.9, humidity 64", () => {
      expect(getWeatherMood({ temp_c: 29.9, humidity: 64, wind_kph: 10 })).toBe(
        "Pleasant"
      );
    });
  });

  describe("real-world cases that drove threshold recalibration", () => {
    it("classifies a cold London day as Cold", () => {
      expect(getWeatherMood({ temp_c: 14, humidity: 72, wind_kph: 12.2 })).toBe(
        "Cold"
      );
    });

    it("classifies humid Mumbai as Uncomfortable", () => {
      expect(getWeatherMood({ temp_c: 28, humidity: 81, wind_kph: 19.1 })).toBe(
        "Uncomfortable"
      );
    });

    it("classifies mild San Francisco as Pleasant", () => {
      expect(getWeatherMood({ temp_c: 18, humidity: 72, wind_kph: 16.9 })).toBe(
        "Pleasant"
      );
    });

    it("classifies Bengaluru as Pleasant despite high humidity", () => {
      expect(getWeatherMood({ temp_c: 22, humidity: 89, wind_kph: 7.2 })).toBe(
        "Pleasant"
      );
    });
  });

  describe("threshold constants are exported", () => {
    it("MOOD_THRESHOLDS.windy.wind_kph equals 25", () => {
      expect(MOOD_THRESHOLDS.windy.wind_kph).toBe(25);
    });

    it("MOOD_THRESHOLDS.uncomfortable.temp_c equals 26", () => {
      expect(MOOD_THRESHOLDS.uncomfortable.temp_c).toBe(26);
    });

    it("MOOD_THRESHOLDS.uncomfortable.humidity equals 65", () => {
      expect(MOOD_THRESHOLDS.uncomfortable.humidity).toBe(65);
    });

    it("MOOD_THRESHOLDS.hot.temp_c equals 30", () => {
      expect(MOOD_THRESHOLDS.hot.temp_c).toBe(30);
    });

    it("MOOD_THRESHOLDS.cold.temp_c equals 15", () => {
      expect(MOOD_THRESHOLDS.cold.temp_c).toBe(15);
    });
  });
});