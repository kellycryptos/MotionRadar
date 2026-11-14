import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090a0f",
        surface: {
          DEFAULT: "#12141c",
          hover: "#181b26",
          border: "#1e2230",
          accent: "#262b3d"
        },
        radar: {
          green: "#10b981",
          emerald: "#059669",
          red: "#ef4444",
          rose: "#e11d48",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          gold: "#f59e0b"
        }
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ]
      },
      keyframes: {
        pulseRadar: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.05)" }
        }
      },
      animation: {
        radar: "pulseRadar 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }
    },
  },
  plugins: [],
};

export default config;
