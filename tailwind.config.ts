import type { Config } from 'tailwindcss';

/**
 * Paleta de Alexandra: fondo #F6F3FB, morados #1F1433 / #3A2370 /
 * #6A4DAB / #A98FD6, oro #C4A35A y detalles verdes. Los dinosaurios son
 * solo acentos; el tema comunica un portafolio full-stack.
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#F6F3FB',
          card: '#FFFFFF',
          pearl: '#EFEAF7',
          border: '#E4DCF1',
          purple: '#6A4DAB',
          'purple-deep': '#3A2370',
          lilac: '#A98FD6',
          gold: '#C4A35A',
          green: '#3E9D7B',
          'green-deep': '#2B775D',
          ink: '#1F1433',
          slate: '#5B5570',
        },
      },
      fontFamily: {
        display: ['var(--font-sans)', 'Poppins', 'sans-serif'],
        sans: ['var(--font-sans)', 'Poppins', 'sans-serif'],
        mono: ['var(--font-mono)', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        studio: '0 10px 25px -5px rgba(106, 77, 171, 0.14)',
        'studio-lg': '0 18px 40px -10px rgba(58, 35, 112, 0.2)',
        brutal: '4px 4px 0px 0px #3A2370',
        'brutal-green': '4px 4px 0px 0px #2B775D',
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
        'dino-spin': {
          from: { transform: 'rotateY(0deg)' },
          to: { transform: 'rotateY(360deg)' },
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
        'dino-spin': 'dino-spin 1.05s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
