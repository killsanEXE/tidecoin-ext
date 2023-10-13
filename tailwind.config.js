/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f8f7ff",
        "input-bg": "#a8d0db",
        text: "black",
        secondary: "#a8d0db",
        primary: "#ffbc42",
        panel: "#669bbc",
        hovered: "#a8d0db",
        "hovered-btn": "#fd9343",
      },
    },
  },
  plugins: [],
};
