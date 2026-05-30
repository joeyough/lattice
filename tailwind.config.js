/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    // dynamic col-span classes used in panel components
    { pattern: /^col-span-/ },
    { pattern: /^lg:col-span-/ }
  ]
};
