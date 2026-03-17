/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#fef3c7",
          dark: "#f59e0b",
          light: "#fef9c3",
        },
        secondary: {
          DEFAULT: "#f3f4f6",
          soft: "#e5e7eb",
        },
        accent: "#f59e0b",
        govgray: "#F5F5F4",
        surface: "#FFFFFF",
        // Make a custom brown/amber palette
        amberBrown: {
          700: "#B45309", // dark brown
          800: "#92400E",
          900: "#78350F",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
  safelist: [
    "text-amberBrown-700",
    "text-amberBrown-800",
    "text-amberBrown-900"
  ],
};