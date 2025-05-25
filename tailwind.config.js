/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/views/**/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Abril Fatface"', 'cursive'],
        body: ['Poppins', 'sans-serif']
      },
      colors: {
        primary: '#1E293B', // slate-800 hex (#1E293B) approx
        hover: '#CA8A04', // yellow-600 hex (#CA8A04)
        headerFooterBg: '#D6D3D1' // stone-300 hex (#D6D3D1)
      }
    },
    plugins: []
  }
}
