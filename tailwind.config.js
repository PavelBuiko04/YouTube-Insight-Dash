/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        youtube: {
          red: '#ff0000',
          dark: '#0f0f0f',
          light: '#f1f1f1'
        }
      }
    },
  },
  plugins: [],
}
