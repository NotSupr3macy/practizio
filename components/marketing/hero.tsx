import Link from 'next/link'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden flex flex-col justify-center items-center"
      style={{ background: 'var(--navy)', minHeight: '100vh' }}
    >
      {/* Floating ambient orbs */}
      <div
        className="ambient-orb ambient-orb-sage"
        style={{ width: 384, height: 384, top: '15%', left: '5%' }}
      />
      <div
        className="ambient-orb ambient-orb-blue animate-float-delayed"
        style={{ width: 384, height: 384, bottom: '10%', right: '-5%' }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-20">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-10">
          <span
            className="w-2 h-2 rounded-full animate-pulse-dot"
            style={{ background: 'var(--primary-accent)' }}
          />
          <span
            className="font-mono text-[10px] uppercase"
            style={{ letterSpacing: '0.3em', color: 'var(--white)' }}
          >
            NOW AI-BOOKABLE
          </span>
        </div>

        {/* Giant heading */}
        <h1 className="text-center">
          <span
            className="block font-display uppercase"
            style={{
              fontSize: 'clamp(48px, 12vw, 160px)',
              lineHeight: 0.85,
              color: 'var(--white)',
            }}
          >
            MAKE YOUR
          </span>
          <span
            className="block font-display uppercase"
            style={{
              fontSize: 'clamp(48px, 12vw, 160px)',
              lineHeight: 0.85,
              color: 'transparent',
              WebkitTextStroke: '1px var(--sage)',
            }}
          >
            BUSINESS
          </span>
          <span
            className="block font-display uppercase"
            style={{
              fontSize: 'clamp(48px, 12vw, 160px)',
              lineHeight: 0.85,
              color: 'var(--white)',
            }}
          >
            AI-READY
          </span>
        </h1>

        {/* Body text */}
        <p
          className="text-center mt-8"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: '18px',
            color: 'var(--taupe)',
            maxWidth: '480px',
            lineHeight: 1.6,
          }}
        >
          Make your business discoverable and actionable by every AI assistant. Appointments, orders, products — all bookable through AI.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link href="/get-setup" className="btn-primary">
            GET STARTED FREE
          </Link>
          <Link href="/directory" className="btn-ghost-light">
            VIEW DIRECTORY &gt;
          </Link>
        </div>

        {/* Bouncing down arrow */}
        <div
          className="mt-16 flex items-center justify-center animate-float"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          >
            <path d="M8 2v12M3 9l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  )
}
