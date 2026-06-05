/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#C8A96E',
        'gold-light': '#E8C98E',
        'gold-dark': '#A87940',
        'teal': '#4ECDC4',
        'bg-primary': '#0A0A0F',
        'bg-secondary': '#0F0F1A',
        'surface': 'rgba(255,255,255,0.04)',
        'danger': '#E63946',
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'type': 'typing 2s steps(40, end)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scaleY(1) translateY(0px)' },
          '50%': { transform: 'scaleY(1.02) translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px rgba(200,169,110,0.3)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 20px rgba(200,169,110,0.6)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.97' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        }
      }
    },
  },
  plugins: [],
}
