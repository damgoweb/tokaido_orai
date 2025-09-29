/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tokaido': {
          primary: '#8B4513',
          secondary: '#D2691E',
          background: '#FAFAFA'
        }
      },
      fontFamily: {
        'mincho': ['Noto Serif JP', 'serif'],
        'gothic': ['Noto Sans JP', 'sans-serif']
      }
    },
  },
  plugins: [],
}