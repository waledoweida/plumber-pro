import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // أزرق ملكي — اللون الأساسي
        brand: {
          50: "#eff5ff", 100: "#dbe8fe", 200: "#bfd5fe", 300: "#93b8fd",
          400: "#6090fa", 500: "#3b6cf6", 600: "#2552eb", 700: "#1d44d8",
          800: "#1e38af", 900: "#1e338a", 950: "#131f4f",
        },
        // ذهبي — لون الأزرار واللمسات
        accent: {
          50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d",
          400: "#fbbf24", 500: "#f5a70b", 600: "#a35d06", 700: "#8a4a07",
        },
      },
      fontFamily: { sans: ["var(--font-plex)", "Tahoma", "Arial", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
