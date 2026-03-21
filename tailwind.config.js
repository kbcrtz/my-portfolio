/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#3b82f6",
          soft: "#60a5fa"
        }
      },
      maxWidth: {
        content: "68rem"
      },
      boxShadow: {
        glow:
          "0 0 0 1px rgba(255,255,255,0.18), 0 0 18px rgba(255,255,255,0.10), 0 10px 30px rgba(2,6,23,0.35)"
      }
    },
  },
  plugins: [],
};
