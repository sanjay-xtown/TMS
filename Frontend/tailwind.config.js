/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FACC15",
          foreground: "#000000",
        },
        background: "#000000",
        foreground: "#FFFFFF",
        card: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1F1F1F",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#FACC15",
          foreground: "#000000",
        },
        border: "#262626",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
