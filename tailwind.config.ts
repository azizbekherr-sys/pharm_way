import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Logo blue — the only blue used site-wide */
        primary: {
          50: "#EEF2FF",
          100: "#DCE5FA",
          200: "#B9CBF2",
          300: "#8FACE8",
          400: "#5A7FD0",
          500: "#2F56B0",
          600: "#1B3A6B",
          700: "#162F58",
          800: "#112447",
          900: "#0C1A35",
        },
        /* Bright accent blue — links and active/accent states only */
        accent: {
          50: "#EEF2FF",
          100: "#D7E1FB",
          500: "#3D6EE0",
          600: "#1B4FD8",
          700: "#1640B0",
        },
        /* Logo green — the only secondary color used site-wide */
        secondary: {
          50: "#EFF8E9",
          100: "#D7EFC7",
          200: "#B0E091",
          300: "#88CE5E",
          400: "#69BC3C",
          500: "#50A923",
          600: "#3F8A1B",
          700: "#316B15",
          800: "#244F10",
          900: "#18350A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(6, 86, 155, 0.14)",
        premium: "0 20px 48px -12px rgba(6, 86, 155, 0.20)",
        glass: "0 8px 32px -8px rgba(6, 86, 155, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
