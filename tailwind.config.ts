import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        mist: "#F8FAFC",
        cloud: "#EEF2FF",
        brand: {
          blue: "#2563EB",
          violet: "#7C3AED",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(120deg, #2563EB 0%, #7C3AED 55%, #F43F5E 100%)",
        "brand-gradient-soft": "linear-gradient(120deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.10) 55%, rgba(244,63,94,0.12) 100%)",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(15, 23, 42, 0.15)",
        card: "0 10px 30px -12px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
