import type { Config } from 'tailwindcss';

/**
 * Tema "Multiverso Jurásico del Código":
 * museo nocturno / espacio digital, morado vibrante y dorado fósil.
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        meso: {
          night: '#120D1D',
          stone: '#1F1433',
          rock: '#2E2148',
          limestone: '#F2EFF7',
          amber: '#A98FD6',
          ember: '#6A4DAB',
          moss: '#C4A35A',
          mist: '#A79FB8',
        },
      },
      fontFamily: {
        display: ['var(--font-sans)', 'Poppins', 'sans-serif'],
        sans: ['var(--font-sans)', 'Poppins', 'sans-serif'],
        mono: ['var(--font-mono)', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        amber:
          '0 0 0 1px rgba(169,143,214,0.35), 0 10px 40px -12px rgba(106,77,171,0.55)',
        'amber-lg':
          '0 0 0 1px rgba(169,143,214,0.5), 0 18px 60px -12px rgba(106,77,171,0.7)',
        gold: '0 0 0 1px rgba(196,163,90,0.4), 0 10px 34px -12px rgba(196,163,90,0.5)',
        card: '0 24px 60px -30px rgba(0,0,0,0.75)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.85' },
        },
        dig: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.08)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        steam: {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.8)' },
          '30%': { opacity: '0.7' },
          '100%': { opacity: '0', transform: 'translateY(-18px) scale(1.15)' },
        },
        'code-float': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '15%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-54px)' },
        },
        dance: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-7px) rotate(-7deg)' },
          '50%': { transform: 'translateY(0) rotate(0deg) scale(0.94)' },
          '75%': { transform: 'translateY(-7px) rotate(7deg)' },
        },
        'ptero-cross': {
          from: { transform: 'translateX(-25vw)' },
          to: { transform: 'translateX(125vw)' },
        },
        meteor: {
          '0%, 100%': { transform: 'translate(0,0) rotate(-18deg)' },
          '50%': { transform: 'translate(-10px,16px) rotate(-13deg)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(24deg)' },
        },
        'leg-a': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'leg-b': {
          '0%, 49%': { opacity: '0' },
          '50%, 100%': { opacity: '1' },
        },
        'raptor-jump': {
          '0%': { transform: 'translateY(0)' },
          '45%': { transform: 'translateY(-16px)' },
          '75%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'screen-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.72' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
        'tail-wag': {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        dig: 'dig 2.4s linear infinite',
        'float-soft': 'float-soft 6s ease-in-out infinite',
        blink: 'blink 4.5s ease-in-out infinite',
        sway: 'sway 5s ease-in-out infinite',
        steam: 'steam 2.8s ease-out infinite',
        'code-float': 'code-float 2.6s ease-in infinite',
        dance: 'dance 0.55s ease-in-out infinite',
        'ptero-cross': 'ptero-cross linear infinite',
        meteor: 'meteor 7s ease-in-out infinite',
        wave: 'wave 1.6s ease-in-out infinite',
        'leg-a': 'leg-a 0.3s steps(1) infinite',
        'leg-b': 'leg-b 0.3s steps(1) infinite',
        'raptor-jump': 'raptor-jump 0.6s ease-out',
        'screen-flicker': 'screen-flicker 2.2s ease-in-out infinite',
        shake: 'shake 0.35s ease-in-out 3',
        'tail-wag': 'tail-wag 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
