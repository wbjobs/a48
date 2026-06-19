/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'dos-green': '#00FF00',
        'dos-green-dark': '#00AA00',
        'dos-amber': '#FFB000',
        'dos-red': '#FF3333',
        'dos-bg': '#000000',
        'dos-gray': '#333333',
      },
      fontFamily: {
        'dos': ['VT323', 'Courier New', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 6s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'shutdown': 'shutdown 1.5s ease-in forwards',
        'boot-up': 'bootUp 0.5s ease-out forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' },
        },
        shutdown: {
          '0%': { transform: 'scaleY(1)', opacity: '1' },
          '70%': { transform: 'scaleY(0.02)', opacity: '0.5' },
          '100%': { transform: 'scaleY(0)', opacity: '0' },
        },
        bootUp: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '70%': { transform: 'scaleY(0.02)', opacity: '0.5' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
