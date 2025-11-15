/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0a0e27',
        'neon-blue': '#00d4ff',
        'neon-blue-dark': '#0099cc',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(0, 212, 255, 0.5)',
        'glow-lg': '0 0 20px rgba(0, 212, 255, 0.7)',
      },
    },
  },
  plugins: [],
}

