import { defineConfig } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}", "./src/**/*.css"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        accent: {
          50: "#ecfdf6",
          100: "#d1fae5",
          300: "#34d399",
          500: "#10b981",
        },
      },
    },
  },
  plugins: [],
});
