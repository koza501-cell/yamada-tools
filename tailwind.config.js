import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kon: "#223A70",
        sakura: "#F59E0B",  // Changed from #E63946 to Gold/Amber
        ai: "#1E3A5F",
      },
    },
  },
  plugins: [],
};
export default config;
