import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        meso: {
          night: '#FAFAF7',
          stone: '#FFFFFF',
          rock: '#E4E1DA',
          limestone: '#24271F',
          amber: '#6657E2',
          ember: '#5446C9',
          moss: '#2E8B62',
          mist: '#6E7269',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        amber: '0 0 0 1px rgba(102,87,226,0.30), 0 8px 40px -12px rgba(102,87,226,0.40)',
        'amber-lg': '0 0 0 1px rgba(102,87,226,0.45), 0 16px 60px -12px rgba(102,87,226,0.55)',
        card: '0 20px 60px -30px rgba(36,39,31,0.35)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.8' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-110%)' },
          '100%': { transform: 'translateY(110%)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'dig': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fossil-reveal': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'scan-line': 'scan-line 3.2s linear infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        dig: 'dig 2.4s linear infinite',
        shimmer: 'fossil-reveal 6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
