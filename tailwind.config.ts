import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#FAF8F5',
          dark: '#1D1B17',
        },
        card: {
          DEFAULT: '#F5F3F0',
          dark: '#2A2724',
        },
        accent: {
          DEFAULT: '#C45D3E',
          light: '#D4745A',
          dark: '#A84D32',
        },
        donow: '#FEF3EC',
        text: {
          DEFAULT: '#1A1A1A',
          secondary: '#8A8A8A',
          dark: '#F0EDE8',
        },
        priority: {
          critical: '#DC2626',
          high: '#EA580C',
          medium: '#2563EB',
          low: '#D1D5DB',
        },
        category: {
          blue: '#BFDBFE',
          green: '#BBF7D0',
          purple: '#DDD6FE',
          orange: '#FED7AA',
          pink: '#FBCFE8',
          teal: '#A5F3FC',
          yellow: '#FEF08A',
          red: '#FECACA',
          indigo: '#C7D2FE',
          emerald: '#A7F3D0',
          amber: '#FDE68A',
          cyan: '#CFFAFE',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-in',
        'scale-check': 'scaleCheck 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out forwards',
        'slide-left': 'slideLeft 0.3s ease-out forwards',
        'pulse-mic': 'pulseMic 1.5s ease-in-out infinite',
        'reorder': 'reorder 0.2s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        scaleCheck: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        pulseMic: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.7' },
        },
        reorder: {
          '0%': { transform: 'translateY(-10px)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
