/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen: "#B0D6FC",
        customPink: "#ffd3b0",
        customGrey: "#cccccc",
        customBlack: "#333333",
      },
    },
  },
  plugins: [],
};
