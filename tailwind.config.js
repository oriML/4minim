/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: '#708238',
        'brand-cream': '#F5F5DC',
        'brand-brown': '#8B4513',
        'brand-dark': '#36454F',
        'brand-gold': '#FFD700',
        'brand-leaf': '#6B8E23',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      }
    },
    colors: {
      white: '#FFFFFF',
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
