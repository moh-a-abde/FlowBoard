/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Changed from 'media' to 'class' for manual dark mode control
    theme: {
      extend: {
        colors: {
          // Blue primary color palette
          primary: {
            50: '#e6f1ff',
            100: '#c0d9ff',
            200: '#99c0ff',
            300: '#66a3ff',
            400: '#3385ff',
            500: '#0066ff',
            600: '#0052cc',
            700: '#003d99',
            800: '#002966',
            900: '#001433',
          },
          // Status colors
          status: {
            // Error/danger
            error: {
              50: '#fff2f2',
              100: '#ffdfdf',
              500: '#f44336',
              600: '#d32f2f',
              700: '#b71c1c',
            },
            // Success
            success: {
              50: '#e8f5e9',
              100: '#c8e6c9',
              500: '#4caf50',
              600: '#388e3c',
              700: '#2e7d32',
            },
            // Warning
            warning: {
              50: '#fffde7',
              100: '#fff9c4',
              500: '#ffeb3b',
              600: '#fdd835',
              700: '#f9a825',
            },
          },
        },
        boxShadow: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          'dark': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
          'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
          'width': 'width',
          'transform': 'transform',
          'opacity': 'opacity',
        },
        transitionDuration: {
          '0': '0ms',
          '250': '250ms',
          '350': '350ms',
        },
        transitionTimingFunction: {
          'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-in-out',
          'slide-in-right': 'slideInRight 0.3s ease-out',
          'slide-in-left': 'slideInLeft 0.3s ease-out',
          'slide-in-bottom': 'slideInBottom 0.3s ease-out',
          'scale-in': 'scaleIn 0.2s ease-out-back',
          'pulse-gentle': 'pulseGentle 2s infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideInRight: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideInLeft: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideInBottom: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          scaleIn: {
            '0%': { transform: 'scale(0.9)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
          pulseGentle: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.7' },
          },
        },
      },
    },
    plugins: [],
  } 