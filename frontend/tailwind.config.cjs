/** @type {import('tailwindcss').Config} */
const colorVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: colorVar("--color-ink-900"),
          800: colorVar("--color-ink-800"),
          700: colorVar("--color-ink-700"),
          500: colorVar("--color-ink-500"),
          300: colorVar("--color-ink-300"),
        },
        sand: {
          50: colorVar("--color-sand-50"),
          100: colorVar("--color-sand-100"),
          200: colorVar("--color-sand-200"),
        },
        panel: {
          900: colorVar("--color-panel-900"),
        },
        accent: {
          purple: "#8B5CF6",
          cyan: "#22D3EE",
          pink: "#F472B6",
        },
        ember: {
          500: colorVar("--color-ember-500"),
          600: colorVar("--color-ember-600"),
        },
        moss: {
          500: colorVar("--color-moss-500"),
          600: colorVar("--color-moss-600"),
        },
        gold: {
          500: colorVar("--color-gold-500"),
        },
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(0, 0, 0, 0.45)",
        glow: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 60px -30px rgba(139, 92, 246, 0.35)",
      },
      borderRadius: {
        xl: "16px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
