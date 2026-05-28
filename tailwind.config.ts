import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts}",
  ],
  theme: {
    fontFamily: {
      sans: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Meiryo', 'sans-serif'],
    },
    extend: {
      colors: {
        kon: '#223A70',
        ai: '#264348',
        sakura: '#FEDFE1',
      },
      fontSize: {
        'jp-h1': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.4' }],
        'jp-h2': ['clamp(1.375rem, 2.6vw, 1.75rem)', { lineHeight: '1.5' }],
        'jp-h3': ['1.125rem', { lineHeight: '1.6' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
