/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#060913",
          card: "rgba(13, 20, 36, 0.65)",
          cardHover: "rgba(19, 29, 53, 0.8)",
          border: "rgba(56, 189, 248, 0.15)",
          borderBright: "rgba(56, 189, 248, 0.4)",
          cyan: "#00f0ff",
          cyanGlow: "#00f0ff80",
          purple: "#8b5cf6",
          purpleGlow: "#8b5cf680",
          emerald: "#10b981",
          emeraldGlow: "#10b98160",
          amber: "#f59e0b",
          rose: "#f43f5e",
          slate: "#94a3b8"
        }
      },
      fontFamily: {
        cyber: ['"Orbitron"', '"Rajdhani"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35), 0 0 8px -1px rgba(0, 240, 255, 0.2)',
        'neon-purple': '0 0 20px -3px rgba(139, 92, 246, 0.35), 0 0 8px -1px rgba(139, 92, 246, 0.2)',
        'neon-emerald': '0 0 15px -2px rgba(16, 185, 129, 0.35)',
        'glass-panel': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'orb-core': '0 0 60px 20px rgba(0, 240, 255, 0.4), inset 0 0 30px 10px rgba(255, 255, 255, 0.9)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse-slow': 'spinReverse 25s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'arc-pulse': 'arcPulse 2s ease-in-out infinite',
      },
      keyframes: {
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        arcPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.8)) brightness(1.2)' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.9)) brightness(1.6)' },
        }
      }
    },
  },
  plugins: [],
}
