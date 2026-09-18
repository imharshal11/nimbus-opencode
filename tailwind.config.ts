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
          idle: "#7C8794",
          pleasant: "#5FD39A",
          hot: "#F0A35E",
          cold: "#6BAEE8",
          windy: "#9BB0C4",
          uncomfortable: "#E07A9F",
        },
        moodText: {
          idle: "#E8EAED",
          pleasant: "#E4F0E9",
          hot: "#F5E6D8",
          cold: "#DCE8F5",
          windy: "#DFE5EC",
          uncomfortable: "#F0DDE6",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.15)",
          subtle: "rgba(255, 255, 255, 0.12)",
          divider: "rgba(255, 255, 255, 0.10)",
        },
      },
      fontSize: {
        'temp-hero': ['96px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'temp-hero-mobile': ['88px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'city-name': ['28px', { lineHeight: '1.2', fontWeight: '500' }],
        'mood-label': ['14px', { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '500' }],
        'metric-value': ['24px', { lineHeight: '1.2', fontWeight: '400' }],
        'metric-label': ['11px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '400' }],
        'chip': ['11px', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'footer': ['11px', { lineHeight: '1', fontWeight: '400' }],
        'inspector-trigger': ['12px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '500' }],
        'inspector-code': ['12px', { lineHeight: '1.6' }],
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '40px',
        '5': '64px',
      },
      maxWidth: {
        'content': '640px',
      },
      borderRadius: {
        'input': '12px',
        'panel': '10px',
      },
      transitionDuration: {
        'mood': '600ms',
      },
      transitionTimingFunction: {
        'mood': 'ease',
      },
    },
  },
  plugins: [],
};

export default config;