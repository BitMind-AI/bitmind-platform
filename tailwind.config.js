/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    "prettier-plugin-tailwindcss",
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
  darkMode: "class",
};
