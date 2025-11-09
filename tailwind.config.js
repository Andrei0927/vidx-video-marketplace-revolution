/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./js/**/*.js",
    "./components/**/*.js",
    "!./node_modules/**"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark': {
          '50': '#1a1a1a',
          '100': '#2d2d2d',
          '200': '#3d3d3d',
          '300': '#4d4d4d',
          '400': '#6d6d6d',
          '500': '#8d8d8d',
          '600': '#e5e5e5',
        }
      },
      boxShadow: {
        'dark-200': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
