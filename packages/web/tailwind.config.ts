/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: ["class"],
  
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  // content: [
  //   "./pages/**/*.{ts,tsx}",
  //   "./components/**/*.{ts,tsx}",
  //   "./app/**/*.{ts,tsx}",
  //   "./src/**/*.{ts,tsx}",
  //   "*.{js,ts,jsx,tsx,mdx}",
  // ],
  // prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        inter: ["var(--font-inter)", ...fontFamily.sans],
        "clash-display": ["var(--font-clash-display)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#e8edff",
          100: "#d1ddff",
          200: "#99afff",
          300: "#668fff",
          400: "#3370ff",
          500: "#0050ff",
          600: "#0045e6",
          700: "#0038cc",
          800: "#002ba3",
          900: "#00225b",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom palette additions
        "zero-blue": {
          50: "#e8edff",
          100: "#d1ddff",
          200: "#99afff",
          300: "#668fff",
          400: "#3370ff",
          500: "#0050ff",
          600: "#0045e6",
          700: "#0038cc",
          800: "#002ba3",
          900: "#00225b",
        },
        "zero-slate": {
          200: "#e2e8f0",
          500: "#5a6b91",
          700: "#37466a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "primary": "0 10px 25px -5px rgba(0, 80, 255, 0.25)",
        "primary-hover": "0 20px 35px -5px rgba(0, 80, 255, 0.3)",
        "secondary": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "secondary-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: ".5" } },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
