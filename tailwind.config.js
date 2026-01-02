/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Lycsa Suite Design System - Colores institucionales
        lycsa: {
          verde: {
            50: '#f0f9f4',
            100: '#dbf0e3',
            200: '#b9e1cb',
            300: '#8ccaab',
            400: '#5bac86',
            500: '#3a916b',
            600: '#2a7455',
            700: '#235d46',
            800: '#1e4a38',
            900: '#1a3d2f',
          },
          beige: {
            50: '#faf9f7',
            100: '#f5f2ed',
            200: '#e9e3d8',
            300: '#ddd1bf',
            400: '#c9b89f',
            500: '#b5a088',
            600: '#9d8670',
            700: '#7f6d5b',
            800: '#69594c',
            900: '#594b40',
          },
        },
        // Estados
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#b45309',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#b91c1c',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
          dark: '#1e40af',
        },
      },
      fontFamily: {
        // Tipografía Aller
        aller: ['Aller', 'system-ui', 'sans-serif'],
        'aller-light': ['Aller Light', 'system-ui', 'sans-serif'],
        'aller-bold': ['Aller Bold', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'lycsa': '0.5rem',
      },
      boxShadow: {
        'lycsa-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'lycsa': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lycsa-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
