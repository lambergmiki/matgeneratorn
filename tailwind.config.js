/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/views/**/*.ejs'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Abril Fatface"', 'cursive'],
        body: ['Poppins', 'sans-serif']
      }
    },
    plugins: []
  }
}
