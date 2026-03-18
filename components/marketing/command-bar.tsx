import Link from 'next/link'

export function CommandBar() {
  return (
    <section
      className="py-24 px-6 md:px-10"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <span
          className="font-mono text-[10px] uppercase block mb-6"
          style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}
        >
          LAUNCH YOUR AI PRESENCE
        </span>

        <h2
          className="editorial-heading text-3xl md:text-5xl mb-4"
          style={{ color: 'var(--white)' }}
        >
          Start free{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.4)' }}>
            today.
          </span>
        </h2>

        <p
          className="max-w-md mx-auto mb-10"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 300,
            fontSize: '18px',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.6,
          }}
        >
          We&apos;ll set up your AI booking page for free — no technical skills needed. Just tell us about your business.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/get-setup"
            className="font-mono text-[10px] uppercase transition-all duration-300"
            style={{
              letterSpacing: '0.25em',
              padding: '14px 32px',
              borderRadius: '2px',
              background: 'var(--white)',
              color: 'var(--navy)',
              fontWeight: 700,
            }}
          >
            GET SET UP FREE — WE&apos;LL DO IT FOR YOU
          </Link>
          <Link
            href="/signup"
            className="font-mono text-[10px] uppercase transition-all duration-300"
            style={{
              letterSpacing: '0.25em',
              padding: '14px 32px',
              borderRadius: '2px',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--white)',
            }}
          >
            SET IT UP YOURSELF
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10">
          <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>
            FREE TIER
          </span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>
            ANY BUSINESS
          </span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>
            NO CARD REQ
          </span>
        </div>
      </div>
    </section>
  )
}
