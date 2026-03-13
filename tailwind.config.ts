import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#FFFFFF',
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          muted: '#6366f115',
        },
        muted: {
          DEFAULT: '#111111',
          foreground: '#666666',
        },
        card: {
          DEFAULT: '#0A0A0A',
          hover: '#111111',
        },
        border: 'rgba(255, 255, 255, 0.15)',
        success: '#22c55e',
        warning: '#eab308',
        destructive: '#ef4444',
      },
      fontFamily: {
        display: ['var(--font-inter-tight)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(5rem, 18vw, 24vw)',
      },
      letterSpacing: {
        'tightest': '-0.06em',
        'widest-mono': '0.4em',
        'wide-mono': '0.2em',
        'mono-label': '0.3em',
      },
      borderWidth: {
        'hairline': '0.5px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'spin-slow': 'spin 20s linear infinite',
        'rotate-in': 'rotateIn 700ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(45deg)' },
          '100%': { transform: 'rotate(90deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
