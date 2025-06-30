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
        border: "hsl(var(--border))", // Existing, will adjust if needed
        input: "hsl(var(--input))", // Existing, will adjust if needed
        ring: "hsl(var(--ring))", // Existing, will adjust if needed
        background: "hsl(var(--background))", // #F9FAFB or similar
        foreground: "hsl(var(--foreground))", // #0A0E27 (Deep Navy)

        primary: {
          DEFAULT: "hsl(var(--primary))", // #0A0E27 (Deep Navy for elements if needed)
          foreground: "hsl(var(--primary-foreground))", // Light text for on-navy elements
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Lighter grey
          foreground: "hsl(var(--secondary-foreground))", // Navy text on lighter grey
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Very light grey for subtle backgrounds/borders
          foreground: "hsl(var(--muted-foreground))", // Grey text
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // #10B981 (Emerald)
          foreground: "hsl(var(--accent-foreground))", // White/Dark text for on-emerald elements
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // White or very light grey
          foreground: "hsl(var(--card-foreground))", // #0A0E27 (Deep Navy)
        },
        // Custom palette additions
        "deep-navy": "#0A0E27",
        "emerald-accent": "#10B981",
        "emerald-accent-hover": "#0F9A6D", // Slightly darker for hover
        "light-bg": "#F9FAFB", // Main light background
        "subtle-lines": "#E5E7EB", // Tailwind gray-200 for borders
        "card-shadow": "rgba(10, 14, 39, 0.05)", // Subtle shadow for deep-navy base
        "card-shadow-hover": "rgba(10, 14, 39, 0.1)",
      },
      borderRadius: {
        lg: "var(--radius)", // 1rem / 16px
        md: "calc(var(--radius) - 4px)", // 12px
        sm: "calc(var(--radius) - 8px)", // 8px
        xl: "calc(var(--radius) + 8px)", // 24px
        "2xl": "calc(var(--radius) + 16px)", // 32px
        button: "12px", // Specific for buttons
        pill: "20px", // For percentage pills
        "card-lg": "24px", // For main cards
      },
      boxShadow: {
        "premium-subtle": "0px 4px 12px rgba(10, 14, 39, 0.03), 0px 1px 4px rgba(10, 14, 39, 0.02)",
        "premium-medium": "0px 8px 24px rgba(10, 14, 39, 0.05), 0px 4px 8px rgba(10, 14, 39, 0.03)",
        "premium-cta": "0px 6px 16px rgba(16, 185, 129, 0.2)", // Emerald accent shadow
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: ".5" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
