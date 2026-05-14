/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          primary: '#4F46E5', // Indigo
          special: '#8B5CF6', // Violet para os futuros poderes
        }
      }
    }
  },
  plugins: [],
}
