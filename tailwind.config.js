/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/js/**/*.js",
    "./static/components/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#18191A',
          100: '#242526',
          200: '#3A3B3C',
          300: '#4E4F50',
          400: '#6B6C6D',
          500: '#B0B3B8',
          600: '#E4E6EB',
          700: '#F5F6F7'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
