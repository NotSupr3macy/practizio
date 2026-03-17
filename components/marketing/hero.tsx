import Link from 'next/link'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden flex flex-col justify-center items-center bg-editorial-grid"
      style={{ background: 'var(--cream)', minHeight: '100vh' }}
    >
      {/* Vertical grid lines overlay — SuperDesign style */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, var(--border-light) 1px, transparent 1px)
          `,
          backgroundSize: '25% 100%',
          backgroundPosition: 'center',
          opacity: 0.6,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-20 max-w-5xl mx-auto">
        {/* Status pill */}
        <div
          className="flex items-center gap-2.5 mb-14 px-5 py-2.5"
          style={{
            border: '1px solid var(--border-light)',
            borderRadius: '2px',
            background: 'rgba(255,255,255,0.6)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse-dot"
            style={{ background: 'var(--primary-accent)' }}
          />
          <span
            className="font-mono text-[10px] uppercase"
            style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
          >
            NOW AI-BOOKABLE
          </span>
        </div>

        {/* Giant heading */}
        <h1 className="text-center">
          <span
            className="block font-display uppercase"
            style={{
              fontSize: 'clamp(56px, 13vw, 180px)',
              lineHeight: 0.9,
              color: 'var(--foreground)',
              letterSpacing: '-0.02em',
            }}
          >
            MAKE YOUR
          </span>
          <span
            className="block"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(56px, 13vw, 180px)',
              lineHeight: 0.9,
              color: 'var(--muted-text)',
              letterSpacing: '-0.02em',
            }}
          >
            Business
          </span>
          <span
            className="block font-display uppercase"
            style={{
              fontSize: 'clamp(56px, 13vw, 180px)',
              lineHeight: 0.9,
              color: 'var(--foreground)',
              letterSpacing: '-0.02em',
            }}
          >
            AI-READY
          </span>
        </h1>

        {/* Body text */}
        <p
          className="text-center mt-10"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: '18px',
            color: 'var(--muted-text)',
            maxWidth: '520px',
            lineHeight: 1.7,
          }}
        >
          Make your business discoverable and actionable by every AI assistant. Appointments, orders, products — all bookable through AI.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
          <Link href="/get-setup" className="btn-primary">
            GET STARTED FREE
          </Link>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase transition-all duration-300"
            style={{
              letterSpacing: '0.25em',
              padding: '16px 32px',
              color: 'var(--foreground)',
            }}
          >
            VIEW DIRECTORY
            <span style={{ fontSize: '14px' }}>&rsaquo;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
