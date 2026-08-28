import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#0d9488",
          600: "#0f766e",
          700: "#0f5c56",
          800: "#134e4a",
          900: "#0e3b39",
        },
        accent: { 400: "#d4a574", 500: "#c97c3d", 600: "#a8632f" },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "Tahoma", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
