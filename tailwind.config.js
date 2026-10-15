/** @type {import('tailwindcss').Config} */
export default {
  // Card data (models) carries Tailwind class strings, so scan every source file.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
