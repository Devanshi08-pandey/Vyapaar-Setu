/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vs-dark': '#0B0F0D',
        'vs-card': '#121815',
        'vs-green': '#3BEA7A',
        'vs-green-light': '#7BFFB2',
        'vs-orange': '#FF8A3D',
        'vs-text': '#F4FFF6',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'growth-gradient': 'linear-gradient(135deg, #3BEA7A, #7BFFB2)',
      }
    },
  },
  plugins: [],
}
