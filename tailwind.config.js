/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use 'class' for dark mode, so you can manually toggle it.
  darkMode: 'class',
  
  // This is the correct content configuration for your file structure.
  // It tells Tailwind to scan all files within the 'src' and 'pages' directories
  // for class names to generate CSS for.
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  
  theme: {
    extend: {},
  },
  plugins: [],
};
