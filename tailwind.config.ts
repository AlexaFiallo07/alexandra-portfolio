import type { Config } from 'tailwindcss';

/**
 * Tema "El Multiverso Jurásico del Código" — Studio Light / Soft Brutalism:
 * Fondo #F4F4F7, superficies #FFFFFF / #E8E8EE, bordes #D8D8E2,
 * morado primario #7C3AED / #5B21B6, verde dino #10B981 / #059669.
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#F4F4F7',
          card: '#FFFFFF',
          pearl: '#E8E8EE',
          border: '#D8D8E2',
          purple: '#7C3AED',
          'purple-deep': '#5B21B6',
          green: '#10B981',
          'green-deep': '#059669',
          ink: '#18181B',
          slate: '#4B5563',
        },
      },
      fontFamily: {
        display: ['var(--font-sans)', 'Poppins', 'sans-serif'],
        sans: ['var(--font-sans)', 'Poppins', 'sans-serif'],
        mono: ['var(--font-mono)', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        studio: '0 10px 25px -5px rgba(124, 58, 237, 0.12)',
        'studio-lg': '0 18px 40px -10px rgba(124, 58, 237, 0.2)',
        brutal: '4px 4px 0px 0px #5B21B6',
        'brutal-green': '4px 4px 0px 0px #059669',
      },
      keyframes: {
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.08)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2.5deg)' },
          '50%': { transform: 'rotate(2.5deg)' },
        },
        steam: {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.8)' },
          '35%': { opacity: '0.85' },
          '100%': { opacity: '0', transform: 'translateY(-18px) scale(1.15)' },
        },
        'code-float': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '18%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-48px)' },
        },
        dance: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-7px) rotate(-7deg)' },
          '50%': { transform: 'translateY(0) rotate(0deg) scale(0.95)' },
          '75%': { transform: 'translateY(-7px) rotate(7deg)' },
        },
        'ptero-cross': {
          from: { transform: 'translateX(-22vw)' },
          to: { transform: 'translateX(122vw)' },
        },
        'leaf-drift': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(14px, -18px) rotate(18deg)' },
        },
        meteor: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(-18deg)' },
          '50%': { transform: 'translate(-12px, 14px) rotate(-12deg)' },
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
          '45%': { transform: 'translateY(-18px)' },
          '75%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'screen-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.78' },
        },
        'tail-wag': {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },
      animation: {
        'float-soft': 'float-soft 5.5s ease-in-out infinite',
        blink: 'blink 4.5s ease-in-out infinite',
        sway: 'sway 5s ease-in-out infinite',
        steam: 'steam 2.6s ease-out infinite',
        'code-float': 'code-float 2.6s ease-in infinite',
        dance: 'dance 0.52s ease-in-out infinite',
        'ptero-cross': 'ptero-cross linear infinite',
        'leaf-drift': 'leaf-drift 8s ease-in-out infinite',
        meteor: 'meteor 6.5s ease-in-out infinite',
        wave: 'wave 1.5s ease-in-out infinite',
        'leg-a': 'leg-a 0.28s steps(1) infinite',
        'leg-b': 'leg-b 0.28s steps(1) infinite',
        'raptor-jump': 'raptor-jump 0.6s ease-out',
        'screen-flicker': 'screen-flicker 2.2s ease-in-out infinite',
        'tail-wag': 'tail-wag 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
