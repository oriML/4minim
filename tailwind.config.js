/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      olive: '#708238',
      white: '#FFFFFF',
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
