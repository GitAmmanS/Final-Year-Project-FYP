/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom-green': '#AFD0AE',
        'custom-purple': '#6E5DB9',
        'custom-light-green' : '5DB963',
        'custom-red':'E80F12'
      },
      fontFamily: {
        body: ['Roboto', 'Arial', 'sans-serif'], 
        headings: ['Poppins', 'sans-serif'],     
      }
    },
  },
  plugins: [],
}