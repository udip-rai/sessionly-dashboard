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
        'navy-hover': '#E6E8FF', // Very light blue for hover states
        'Sessionly-orange': '#FF7D6B',
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'kavoon': ['Kavoon', 'cursive'],
      },
      fontSize: {
        'logo': '32px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'slideInUp': 'slideInUp 0.3s ease-out',
        'progress': 'progress 1s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' }
        }
      }
    },
  },
  plugins: [],
}