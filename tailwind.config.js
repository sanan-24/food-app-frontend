/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C42',
        secondary: '#FF6B35',
        dark: '#1a1a1a',
        darkBg: '#0f0f0f',
        darkCard: '#1f1f1f',
        accent: '#FFD700',
      }
    },
  },
  plugins: [],
}
