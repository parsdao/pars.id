/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pars: {
          gold: '#E6B800',
          dark: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}
