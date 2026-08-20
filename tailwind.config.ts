import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FBF6F2",
        ink: "#3A2A33",
        inksoft: "#7A6670",
        rose: { DEFAULT: "#C6707A", dark: "#A85764", tint: "#F4E4E4" },
        teal: { DEFAULT: "#2F6F62", dark: "#235349", tint: "#E1EEE9" },
        gold: "#D9A441",
        line: "#EAD9D3",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
      borderRadius: {
        xl2: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
