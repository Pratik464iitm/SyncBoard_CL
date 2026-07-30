/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12141C",
        paper: "#F7F8FB",
        surface: "#FFFFFF",
        "surface-dark": "#181B24",
        "bg-dark": "#0D0F16",
        sync: {
          DEFAULT: "#4C6FFF",
          light: "#7C93FF",
          dark: "#3450DB",
        },
        signal: {
          DEFAULT: "#16C2A3",
          light: "#4DDCC2",
        },
        amber: "#F5A623",
        coral: "#FF5D5D",
        slate: {
          DEFAULT: "#6B7280",
          light: "#9CA3AF",
          faint: "#E5E7EB",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,20,28,0.04), 0 4px 16px rgba(18,20,28,0.06)",
        pop: "0 8px 30px rgba(18,20,28,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(76,111,255,0.5)" },
          "70%": { boxShadow: "0 0 0 10px rgba(76,111,255,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(76,111,255,0)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        pulseRing: "pulseRing 2s infinite",
        floatSlow: "floatSlow 5s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
