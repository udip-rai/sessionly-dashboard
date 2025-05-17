/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1E1B3C',
        'Sessionly-orange': '#FF7D6B',
      },
      fontFamily: {
        'kavoon': ['Kavoon', 'cursive'],
      },
      fontSize: {
        'logo': '32px',
      }
    },
  },
  plugins: [],
}