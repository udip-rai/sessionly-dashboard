/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-light': '#FFFFFF', // Pure white for start
        'navy': '#2834B3', // Softer version of the logo's blue
        'navy-dark': '#1E1B3C', // Darker blue for depth
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