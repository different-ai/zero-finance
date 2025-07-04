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
          100: "#d0d8ff",
          200: "#99afff",
          300: "#668fff",
          400: "#3370ff",
          500: "#4d8dff",
          600: "#2f6bff",
          700: "#0050ff",
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
        // Premium design tokens
        "zero-blue": {
          50: "#e8edff",
          100: "#d0d8ff",
          200: "#99afff",
          300: "#668fff",
          400: "#3370ff",
          500: "#4d8dff",
          600: "#2f6bff",
          700: "#0050ff",
          800: "#002ba3",
          900: "#00225b",
        },
        "text-primary": "#1a1a1a",
        "text-secondary": "#6b7280",
        "text-tertiary": "#9ca3af",
        "surface": "#ffffff",
        "surface-hover": "rgba(77, 141, 255, 0.06)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)", // 16px
        "2xl": "calc(var(--radius) + 8px)", // 20px
      },
      boxShadow: {
        "premium": "0 6px 24px rgba(0, 0, 0, 0.07), inset 0 1px 2px rgba(255, 255, 255, 0.6)",
        "primary": "0 2px 4px rgba(0, 0, 0, 0.12)",
        "primary-hover": "0 4px 12px rgba(0, 0, 0, 0.15)",
        "button": "0 2px 4px rgba(0, 0, 0, 0.12)",
        "button-hover": "0 4px 12px rgba(0, 0, 0, 0.15)",
      },
      spacing: {
        "18": "4.5rem", // 72px
        "22": "5.5rem", // 88px
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "scale-in": { 
          from: { transform: "scale(0.8)", opacity: "0" }, 
          to: { transform: "scale(1)", opacity: "1" } 
        },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: ".5" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scale-in": "scale-in 120ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
