/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05070D",
        surface: "#0B0F1A",
        "surface-2": "#0F1420",
        edge: "rgba(255,255,255,0.08)",
        "edge-soft": "rgba(255,255,255,0.05)",
        ink: "#E9EDF7",
        "ink-muted": "#8891A8",
        "ink-dim": "#7B84A3",
        signal: "#4C8DFF",
        "signal-soft": "#7FA9FF",
        cyan: "#7CE7E1",
        // Purple accent — a real third color in the theme (not a one-off),
        // used for the blog's category badges and select accent moments.
        violet: "#8B7CF6",
        "violet-soft": "#A78BFA",
        amber: "#F2B559",
        emerald: "#5FD9A0",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, #05070D 85%), radial-gradient(ellipse at 50% 0%, rgba(76,141,255,0.14), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 60px rgba(76,141,255,0.25)",
        "glow-sm": "0 0 24px rgba(76,141,255,0.18)",
        "glow-violet": "0 0 40px rgba(139,124,246,0.22)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: 0.35 },
          "50%": { opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "pulse-line": "pulseLine 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
