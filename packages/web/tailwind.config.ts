import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        heading: ['Archivo', ...fontFamily.sans],
      },
      colors: {
        'primary-text': '#111827',
        'secondary-text': '#4B5563',
        'surface-bg': '#F9FAFB',
        'card-surface': '#FFFFFF',
        'border-divider': '#E5E7EB',
        'success-accent': '#10B981',
        'error-accent': '#EF4444',
        'gradient-yellow': '#FEF3C7',
        'gradient-lavender': '#EDE9FE',
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#111827',
        background: '#F9FAFB',
        foreground: '#111827',
        primary: {
          DEFAULT: '#111827',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F3F4F6',
          foreground: '#111827',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#4B5563',
        },
        accent: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
        pill: '9999px',
      },
      boxShadow: {
        light: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        medium: '0px 4px 8px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'divider-slide': {
          '0%': { left: '-50%', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { left: '100%', opacity: '0' },
        },
        'input-scan': {
          '0%': { right: '100%' },
          '100%': { right: '-30px' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'divider-slide': 'divider-slide 3s ease-in-out infinite',
        'input-scan': 'input-scan 2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms')],
} satisfies Config;

export default config;
