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
        background: '#050505',
        foreground: '#F0F0F0',
        accent: {
          DEFAULT: '#2869A9',
          hover: '#3A7FBF',
          muted: '#2869A910',
        },
        neon: {
          pink: '#FF2D87',
          cyan: '#00F0FF',
          blue: '#2869A9',
        },
        chrome: {
          light: '#E8E8E8',
          mid: '#A0A0A0',
          dark: '#404040',
        },
        muted: {
          DEFAULT: '#0A0A0A',
          foreground: '#888888',
        },
        card: {
          DEFAULT: '#0C0C0C',
          hover: '#141414',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        success: '#2869A9',
        warning: '#FF2D87',
        destructive: '#FF3366',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-space-grotesk)', 'monospace'],
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(4rem, 16vw, 20vw)',
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
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'spin-slow': 'spin 20s linear infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'blob': 'blob 10s ease-in-out infinite',
        'blob-2': 'blob2 12s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'chrome-shift': 'chromeShift 8s ease-in-out infinite',
        'morph': 'morph 15s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        blob: {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
          '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
        },
        blob2: {
          '0%, 100%': { borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%' },
          '33%': { borderRadius: '70% 30% 50% 50% / 30% 50% 50% 70%' },
          '66%': { borderRadius: '30% 70% 40% 60% / 60% 40% 60% 40%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        chromeShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 40% 70% 40% 60%' },
          '75%': { borderRadius: '60% 40% 60% 40% / 70% 40% 50% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
