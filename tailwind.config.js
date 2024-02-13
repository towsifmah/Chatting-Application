/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Nunito': ['Nunito', 'sans-serif;'],
        'OpenSans': ['Open Sans', 'sans-serif'],
        'Poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'overlay': 'rgba(0, 0, 0, 0.41)',
      },
    },
  },
  plugins: [],
}