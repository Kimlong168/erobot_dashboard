/** @type {import('tailwindcss').Config} */
// Import the plugin using ES6 import syntax
import typography from "@tailwindcss/typography";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    fontFamily: {
      khmer: ["Battambang", "system-ui"],
    },
  },
  plugins: [typography],
};
