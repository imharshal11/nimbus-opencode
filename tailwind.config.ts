import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#0ea5e9",
          foreground: "#ffffff",
        },
        mood: {
          windy: "#f59e0b",
          uncomfortable: "#ef4444",
          hot: "#f97316",
          cold: "#3b82f6",
          pleasant: "#22c55e",
        },
      },
    },
  },
  plugins: [],
};

export default config;