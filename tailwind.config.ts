import type { Config } from "tailwindcss";

const config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15110C",
        paper: "#F6F3ED",
        warm: "#E8E0D2",
        clay: "#B84032",
        gold: "#C6A24A",
        moss: "#425143",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans SC", "Microsoft YaHei", "system-ui", "sans-serif"],
        serif: ["Noto Serif SC", "Songti SC", "SimSun", "serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(21,17,12,0.10)",
        lift: "0 18px 48px rgba(21,17,12,0.16)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
