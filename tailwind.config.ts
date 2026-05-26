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
        primary: {
          100: '#DBEAFE',
          700: '#1E40AF',
          900: '#1E3A8A',
        },
        neutral: {
          50:  '#F9FAFB',
          200: '#E5E7EB',
          400: '#9CA3AF',
          600: '#4B5563',
          900: '#111827',
        },
        // Aliases — remove at end of Phase 2 once all usages migrated
        kon:    '#1E3A8A', // remapped from #223A70 → primary-900
        ai:     '#264348',
        sakura: '#FEDFE1',
      },
      fontSize: {
        // Existing clamp-based scale — keep until Phase 4 hero migration
        'jp-h1': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.4' }],
        'jp-h2': ['clamp(1.375rem, 2.6vw, 1.75rem)', { lineHeight: '1.5' }],
        'jp-h3': ['1.125rem', { lineHeight: '1.6' }],
        // Design token scale
        body:    ['14px', { lineHeight: '1.6' }],
        lead:    ['16px', { lineHeight: '1.6' }],
        h3:      ['18px', { lineHeight: '1.4' }],
        h2:      ['30px', { lineHeight: '1.3' }],
        display: ['48px', { lineHeight: '1.1' }],
      },
      borderRadius: {
        btn:  '8px',
        card: '12px',
        pill: '9999px',
      },
      spacing: {
        section:   '80px',
        sectionLg: '120px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
