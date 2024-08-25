/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
      boxShadow: {
        light: "0 2px 4px 0px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 12px 0px rgba(0, 0, 0, 0.08)",
        heavy: "0 4px 24px 0px rgba(0, 0, 0, 0.32)",
        top: "0 -4px 12px 0px rgba(0, 0, 0, 0.08)",
      },
    },
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
