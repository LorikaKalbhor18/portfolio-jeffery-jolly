import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        'bg-light': '#F7FAFF',
        'bg-alt-light': '#EEF4FF',
        'surface-light': '#FFFFFF',
        'heading-light': '#0B1220',
        'body-light': '#4B5565',
        'border-light': '#E2E8F5',
        'pale-blue': '#E6F0FF',
        // Dark mode
        'bg-dark': '#0B1220',
        'bg-alt-dark': '#0F1A2E',
        'surface-dark': '#131F36',
        'heading-dark': '#F1F5FF',
        'body-dark': '#A9B4C8',
        'border-dark': '#24324D',
        // Brand
        primary: '#2563EB',
        'primary-hover': '#1D4ED8',
        'primary-dark': '#5B9BFF',
        'btn-dark': '#0B0F1A',
        // Accents
        accent: {
          purple: '#7C3AED',
          red: '#E5484D',
          amber: '#F59E0B',
          green: '#16A34A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(37,99,235,0.07)',
        'card-hover': '0 8px 32px 0 rgba(37,99,235,0.13)',
        'card-dark': '0 2px 16px 0 rgba(0,0,0,0.32)',
        'card-dark-hover': '0 8px 32px 0 rgba(91,155,255,0.13)',
      },
      transitionDuration: {
        theme: '300ms',
      },
    },
  },
  plugins: [],
} satisfies Config
