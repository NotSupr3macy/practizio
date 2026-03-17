import Link from 'next/link'

export function CommandBar() {
  return (
    <section
      className="section-light py-24 px-6 md:px-10"
      style={{ borderTop: '1px solid var(--border-light)' }}
    >
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <span
          className="font-mono text-[10px] uppercase block mb-6"
          style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
        >
          LAUNCH YOUR AI PRESENCE
        </span>

        <h2
          className="editorial-heading text-3xl md:text-5xl mb-4"
          style={{ color: 'var(--foreground)' }}
        >
          Start free{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--taupe)' }}>
            today.
          </span>
        </h2>

        <p
          className="max-w-md mx-auto mb-10"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 300,
            fontSize: '16px',
            color: 'var(--muted-text)',
            lineHeight: 1.6,
          }}
        >
          We&apos;ll set up your AI booking page for free — no technical skills needed. Just tell us about your business.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/get-setup" className="btn-primary">
            GET SET UP FREE — WE&apos;LL DO IT FOR YOU
          </Link>
          <Link href="/signup" className="btn-ghost">
            SET IT UP YOURSELF
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10">
          <span className="font-mono text-[8px] uppercase" style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}>
            FREE TIER
          </span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-light)' }} />
          <span className="font-mono text-[8px] uppercase" style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}>
            ANY BUSINESS
          </span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-light)' }} />
          <span className="font-mono text-[8px] uppercase" style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}>
            NO CARD REQ
          </span>
        </div>
      </div>
    </section>
  )
}
