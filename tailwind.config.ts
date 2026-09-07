import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#FFF8F9",
        foreground: "#1F1D24",
        universe: {
          950: "#FFFFFF",
          900: "#FFF2F4",
          850: "#FDE6E9",
          800: "#FAD5DC",
          750: "#F3BDC7",
          700: "#E093A2",
          600: "#C86F82",
        },
        cream: {
          50: "#1A181F",
          100: "#2B2732",
          200: "#443F4D",
          300: "#60596B",
          400: "#7F778A",
          500: "#A29AA9",
          600: "#C4BAC7",
        },
        gold: {
          300: "#F5D7B2",
          400: "#D4A359",
          500: "#BA873C",
          600: "#9C6E2B",
          700: "#7E551B",
        },
        rose: {
          300: "#F8BAC7",
          400: "#E093A2",
          500: "#C86F82",
          600: "#AB5367",
          700: "#8B3A4D",
        },
        peach: {
          300: "#FFEAE0",
          400: "#FEDEC8",
          500: "#F5BE9B",
          600: "#DE9A70",
        },
        sage: {
          300: "#E2ECE6",
          400: "#C7D7CE",
          500: "#8FA799",
          600: "#647F70",
          700: "#4E685B",
        },
        mauve: {
          300: "#EBDFF2",
          400: "#D7BEDF",
          500: "#B5838D",
          600: "#935F6B",
          700: "#764552",
        },
        charcoal: {
          50: "#F7F6F8",
          100: "#E6E4E9",
          200: "#C4BAC7",
          300: "#7F778A",
          400: "#60596B",
          500: "#443F4D",
          600: "#2B2732",
          700: "#1F1D24",
          800: "#16141A",
          900: "#0E0D11",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-shimmer": "linear-gradient(135deg, #D4A359 0%, #BA873C 50%, #F5D7B2 100%)",
        "rose-shimmer": "linear-gradient(135deg, #E093A2 0%, #C86F82 50%, #F8BAC7 100%)",
        "blush-shimmer": "linear-gradient(135deg, #FFF2F4 0%, #FDE6E9 50%, #FEDEC8 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 242, 244, 0.8) 100%)",
        "dark-vignette": "radial-gradient(circle at 50% 30%, rgba(253, 230, 233, 0.5) 0%, rgba(255, 248, 249, 0.98) 100%)",
      },
      boxShadow: {
        glass: "0 8px 30px 0 rgba(200, 111, 130, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.02)",
        "glass-hover": "0 14px 40px 0 rgba(200, 111, 130, 0.16), 0 0 20px -5px rgba(224, 147, 162, 0.3)",
        "glow-gold": "0 0 30px -5px rgba(186, 135, 60, 0.25)",
        "glow-rose": "0 0 30px -5px rgba(200, 111, 130, 0.3)",
        "glow-sm": "0 0 15px -3px rgba(200, 111, 130, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
          "100%": { opacity: "0.4" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
