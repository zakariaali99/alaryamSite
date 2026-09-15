import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFEEFB',
          100: '#DCDAF5',
          600: '#0D07AD',
          700: '#0A0590',
          800: '#070470',
        },
        ink: '#0B0D17',
        body: '#2A2E3B',
        muted: '#5B6072',
        line: '#E3E5EC',
        surface: '#F6F7FA',
        white: '#FFFFFF',
      },
      fontFamily: {
        cairo: ['"Cairo Variable"', 'Cairo', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        btn: '12px',
        button: '12px',
        icon: '14px',
        cta: '24px',
        band: '24px',
      },
      ringWidth: {
        3: '3px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(11, 13, 23, 0.05)',
        card: '0 12px 32px rgba(11, 13, 23, 0.08)',
        header: '0 2px 8px rgba(11, 13, 23, 0.06)',
      },
      fontSize: {
        'body-sm': ['14px', { lineHeight: '1.6' }],
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
