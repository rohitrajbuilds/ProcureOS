/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        mist: "#f4f7fb",
        signal: "#0f766e",
        ember: "#c2410c",
        steel: "#334155"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        display: ["Georgia", "serif"]
      },
      boxShadow: {
        panel: "0 24px 60px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
