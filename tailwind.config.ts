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
        background: "#050505",
        secondaryBg: "#0B0B0D",
        panel: "#111214",
        elevated: "#17181B",
        primaryText: "#F5F5F7",
        secondaryText: "#A1A1A6",
        mutedText: "#6E6E73",
        status: {
          safe: "#30D158",
          warning: "#FFD60A",
          critical: "#FF453A",
          info: "#64D2FF"
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
