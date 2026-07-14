import type { Config } from "tailwindcss";

/**
 * Laboratory Minimal — the exact design system shared with the Eureka mobile app.
 * Colors resolve to CSS variables so warm dark mode swaps under `.dark`
 * (see globals.css). The accent is a warm sage green.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surfaceAlt: "var(--surface-alt)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        accentText: "var(--accent-text)",
        accentSoft: "var(--accent-soft)",
        accentInk: "var(--accent-ink)",
        heart: "var(--heart)",
        green: {
          50: "var(--green-50)",
          100: "var(--green-100)",
          300: "var(--green-300)",
          400: "var(--green-400)",
          500: "var(--green-500)",
          700: "var(--green-700)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      maxWidth: {
        feed: "680px",
      },
      transitionDuration: {
        DEFAULT: "130ms",
        fast: "130ms",
        medium: "180ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.16, 1, 0.3, 1)",
        precise: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "depth-next": {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "depth-prev": {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        scan: "scan 2.2s linear infinite",
        "fade-up": "fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "depth-next": "depth-next 150ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "depth-prev": "depth-prev 150ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
