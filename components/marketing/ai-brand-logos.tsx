// Simplified brand mark SVGs matching official logos

export function ChatGPTLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* OpenAI flower knot */}
      <path d="M254.8 131.9c5.8-17.2 2.5-36.3-8.8-50.2-17-20.9-46.2-28.4-71.6-18.4-12.6-14-31.2-21.3-50.3-19.7-24.2 2-44.7 17.5-52.6 39.8-18.4 3-34.2 14.3-42.6 30.7-12.7 24.8-7.5 55 12.4 73.6-5.8 17.2-2.5 36.3 8.8 50.2 17 20.9 46.2 28.4 71.6 18.4 12.6 14 31.2 21.3 50.3 19.7 24.2-2 44.7-17.5 52.6-39.8 18.4-3 34.2-14.3 42.6-30.7 12.7-24.8 7.5-55-12.4-73.6z" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M168 80v72l62.4-36" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M168 152l-62.4-36" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M105.6 188v-72" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M152 240v-72l-62.4 36" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M152 168l62.4 36" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M214.4 132v72" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Claude starburst */}
      <g transform="translate(160, 140)">
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * 360) / 14 - 90
          const rad = (angle * Math.PI) / 180
          const length = i % 2 === 0 ? 80 : 55
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos(rad) * length}
              y2={Math.sin(rad) * length}
              stroke="#D4956A"
              strokeWidth="12"
              strokeLinecap="round"
            />
          )
        })}
      </g>
    </svg>
  )
}

export function PerplexityLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Perplexity compass/arrow */}
      <circle cx="160" cy="160" r="80" stroke="currentColor" strokeWidth="16"/>
      <circle cx="160" cy="160" r="30" stroke="currentColor" strokeWidth="16"/>
      <path d="M160 50L185 130L160 80L135 130Z" fill="currentColor"/>
      <path d="M160 270L135 190L160 240L185 190Z" fill="currentColor"/>
      <path d="M50 160L130 135L80 160L130 185Z" fill="currentColor"/>
      <path d="M270 160L190 185L240 160L190 135Z" fill="currentColor"/>
    </svg>
  )
}

export function CopilotLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Copilot ribbon wave */}
      <defs>
        <linearGradient id="copilot-grad" x1="0" y1="0" x2="320" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2BC4F3"/>
          <stop offset="30%" stopColor="#6F5FE7"/>
          <stop offset="60%" stopColor="#E44DA0"/>
          <stop offset="100%" stopColor="#F5A623"/>
        </linearGradient>
      </defs>
      <path d="M80 200C80 145 110 100 160 80C210 100 240 145 240 200" stroke="url(#copilot-grad)" strokeWidth="28" strokeLinecap="round" fill="none"/>
      <path d="M60 180C60 125 100 70 160 50C220 70 260 125 260 180" stroke="url(#copilot-grad)" strokeWidth="28" strokeLinecap="round" fill="none" opacity="0.5"/>
      <circle cx="120" cy="180" r="20" fill="url(#copilot-grad)"/>
      <circle cx="200" cy="180" r="20" fill="url(#copilot-grad)"/>
    </svg>
  )
}

export function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Gemini 4-point star */}
      <defs>
        <linearGradient id="gemini-grad" x1="60" y1="60" x2="260" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4285F4"/>
          <stop offset="25%" stopColor="#EA4335"/>
          <stop offset="50%" stopColor="#4285F4"/>
          <stop offset="75%" stopColor="#34A853"/>
          <stop offset="100%" stopColor="#FBBC05"/>
        </linearGradient>
      </defs>
      <path d="M160 40C160 40 200 120 280 160C200 200 160 280 160 280C160 280 120 200 40 160C120 120 160 40 160 40Z" fill="url(#gemini-grad)"/>
    </svg>
  )
}

export function GrokLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Grok/xAI geometric mark */}
      <g transform="translate(160, 160)">
        <path d="M0 -90L25 -30L90 -30L35 10L55 70L0 35L-55 70L-35 10L-90 -30L-25 -30Z" fill="currentColor" transform="rotate(0)"/>
        <rect x="-12" y="-90" width="24" height="180" fill="currentColor" rx="4"/>
        <rect x="-90" y="-12" width="180" height="24" fill="currentColor" rx="4"/>
        <rect x="-12" y="-90" width="24" height="180" fill="currentColor" rx="4" transform="rotate(45)"/>
        <rect x="-12" y="-90" width="24" height="180" fill="currentColor" rx="4" transform="rotate(-45)"/>
      </g>
    </svg>
  )
}
