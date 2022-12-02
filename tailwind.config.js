/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'popup': '384px'
      },
      fontFamily: {
        'title': ['Open Sans', 'sans-serif']  // Open Sans
      },
      keyframes: {
        appear: {
          '0%' : { opacity: 0, transform: 'scale(.8)'},
          '100%' : { opacity: '1' },
        }
      },
      animation: {
        "appear": "appear 0.3s ease-in-out"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
