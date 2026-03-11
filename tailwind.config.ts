import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#FDFCF8",
          100: "#FAF7F0",
          200: "#F5EFE0",
          300: "#EDE1C8",
        },
        forest: {
          50: "#EEF5F1",
          100: "#D0E8DA",
          200: "#9DCAB0",
          300: "#5EA882",
          400: "#2D7D58",
          500: "#1B5E43",
          600: "#154D37",
          700: "#0F3A29",
          800: "#0A2A1E",
          900: "#051A12",
          950: "#020D09",
        },
        gold: {
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
        },
        ember: {
          100: "#FDEBD8",
          200: "#F9C9A0",
          300: "#F4A261",
          400: "#E07B3B",
          500: "#C4633F",
          600: "#A04E30",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(15,58,41,0.08), 0 1px 6px -1px rgba(15,58,41,0.04)",
        "card-hover": "0 16px 48px -8px rgba(15,58,41,0.16), 0 4px 16px -4px rgba(15,58,41,0.08)",
        glow: "0 0 40px rgba(27,94,67,0.15)",
        "glow-gold": "0 0 40px rgba(245,158,11,0.2)",
        luxury: "0 32px 64px -16px rgba(5,26,18,0.24)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
