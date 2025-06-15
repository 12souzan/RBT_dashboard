/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '2px 0px 10px #a4a2a2',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),

  ],
}

