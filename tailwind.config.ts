import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#ededf0",
          200: "#d9dade",
          300: "#b8babf",
          400: "#8e9097",
          500: "#6b6d75",
          600: "#52545b",
          700: "#3f4046",
          800: "#27282c",
          900: "#1b1c1f",
          950: "#111113",
        },
        accent: {
          DEFAULT: "#0f766e",
          50: "#eefcf7",
          100: "#d4f7ec",
          400: "#34c79c",
          500: "#10a37f",
          600: "#0f766e",
          700: "#115e56",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,17,19,0.04), 0 8px 24px -12px rgba(17,17,19,0.10)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "fade-up": "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
