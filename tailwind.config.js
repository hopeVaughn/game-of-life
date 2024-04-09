/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'ipad-pro': '1024px', // Custom breakpoint for iPad Pro
      'lg': '1280px',
    },
    extend: {
      gridTemplateColumns: {
        '48': 'repeat(48, minmax(0, 1fr))',
        '36': 'repeat(36, minmax(0, 1fr))',
        '96': 'repeat(96, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
