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
        rose: { DEFAULT: "#E0157B", dark: "#B10F63", tint: "#FBDCE9" },
        teal: { DEFAULT: "#1E7FB0", dark: "#155E85", tint: "#DCEEF7" },
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
