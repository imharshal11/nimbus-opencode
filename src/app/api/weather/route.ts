import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_URL = "https://api.weatherapi.com/v1/current.json";
const REQUEST_TIMEOUT_MS = 5000;
const CITY_REGEX = /^[A-Za-z\s\-',]{1,60}$/;

const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (!record || now > record.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function validateCity(city: string): boolean {
  return CITY_REGEX.test(city.trim());
}

function narrowResponse(data: WeatherApiResponse): NarrowedResponse {
  return {
    location: {
      name: data.location.name,
      country: data.location.country,
      localtime: data.location.localtime,
    },
    current: {
      temp_c: data.current.temp_c,
      humidity: data.current.humidity,
      wind_kph: data.current.wind_kph,
      condition: {
        text: data.current.condition.text,
        icon: data.current.condition.icon,
      },
    },
  };
}

interface WeatherApiResponse {
  location: {
    name: string;
    country: string;
    localtime: string;
    [key: string]: unknown;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
      icon: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface NarrowedResponse {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  const trimmedCity = city.trim();

  if (!validateCity(trimmedCity)) {
    return NextResponse.json(
      { error: "Invalid city name. Use letters, spaces, hyphens, apostrophes, or commas only." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again soon." },
      { status: 429 }
    );
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey || apiKey === "REPLACE_ME") {
    console.error("[weather] WEATHER_API_KEY not configured");
    return NextResponse.json(
      { error: "Weather service unavailable." },
      { status: 502 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${UPSTREAM_URL}?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(trimmedCity)}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error?.code === 1006) {
          return NextResponse.json(
            { error: "We couldn't find that city." },
            { status: 404 }
          );
        }
      }

      if (response.status === 401 || response.status === 403) {
        console.error("[weather] Invalid or expired API key");
        return NextResponse.json(
          { error: "Weather service unavailable." },
          { status: 502 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Try again soon." },
          { status: 429 }
        );
      }

      console.error(`[weather] Upstream error: ${response.status}`);
      return NextResponse.json(
        { error: "Weather service unavailable." },
        { status: 502 }
      );
    }

    const data: WeatherApiResponse = await response.json();
    const narrowed = narrowResponse(data);

    return NextResponse.json(narrowed);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out." },
        { status: 504 }
      );
    }

    console.error("[weather] Network error:", error);
    return NextResponse.json(
      { error: "Request timed out." },
      { status: 504 }
    );
  }
}