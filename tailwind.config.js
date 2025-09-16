/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: '#708238',
      },
    },
    colors: {
      white: '#FFFFFF',
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
