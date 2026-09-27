import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // كحلي — اللون الأساسي
        brand: {
          50: "#eef4fb", 100: "#d9e6f5", 200: "#b6cdea", 300: "#86aad9",
          400: "#5584c3", 500: "#3565a8", 600: "#264f8b", 700: "#1e3f70",
          800: "#17315a", 900: "#112544", 950: "#0a172c",
        },
        // نحاسي — لون الأزرار والتنبيه
        accent: {
          50: "#fff5ec", 100: "#ffe6d1", 200: "#fecaa0", 300: "#fca66b",
          400: "#f7843b", 500: "#ea6a1c", 600: "#cc5412", 700: "#a84213",
        },
      },
      fontFamily: { sans: ["var(--font-plex)", "Tahoma", "Arial", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
