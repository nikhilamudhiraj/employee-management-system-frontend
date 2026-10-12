/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d9fe',
          300: '#a3c0fd',
          400: '#759cfb',
          500: '#4c73f5',
          600: '#3252ea',
          700: '#253ecc',
          800: '#2234a5',
          900: '#202f83',
          950: '#141c52',
        }
      }
    },
  },
  plugins: [],
}
