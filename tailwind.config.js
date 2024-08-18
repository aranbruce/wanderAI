/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
      black: "#201D23",
      gray: {
        100: "#F4F4F4",
        200: "#EAEAEA",
        300: "#D6D6D6",
        800: "#797979",
      },
      white: "#ffffff",
      green: {
        300: "#2EAD8C",
        400: "#35977D",
        500: "#347463",
      },
      red: "#FE9AA4",
    },
  },
  plugins: [],
};
