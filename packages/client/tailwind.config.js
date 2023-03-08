/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#1F40A9",
        secondary: "#FF6035",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        pragati: ["Pragati Narrow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
