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
        background: 'var(--cream)',
        foreground: 'var(--foreground)',
        accent: {
          DEFAULT: 'var(--primary-accent)',
          hover: '#4a857b',
          muted: 'rgba(61, 112, 104, 0.1)',
        },
        navy: 'var(--navy)',
        sage: 'var(--sage)',
        taupe: 'var(--taupe)',
        charcoal: 'var(--charcoal)',
        cream: 'var(--cream)',
        'cyan-glow': 'var(--cyan-glow)',
        'soft-blue': 'var(--soft-blue)',
        beige: 'var(--beige)',
        neon: {
          pink: 'var(--taupe)',
          cyan: 'var(--cyan-glow)',
          blue: 'var(--primary-accent)',
        },
        chrome: {
          light: '#E8E8E8',
          mid: 'var(--muted-text)',
          dark: '#404040',
        },
        muted: {
          DEFAULT: 'var(--border-light)',
          foreground: 'var(--muted-text)',
        },
        card: {
          DEFAULT: 'var(--white)',
          hover: 'var(--cream)',
        },
        border: 'var(--border-light)',
        success: 'var(--primary-accent)',
        warning: '#d4956a',
        destructive: '#c0392b',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Space Mono"', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(48px, 12vw, 160px)',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'widest-mono': '0.4em',
        'wide-mono': '0.2em',
        'mono-label': '0.3em',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
        full: '9999px',
      },
      borderWidth: {
        'hairline': '1px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'marquee': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.5)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
