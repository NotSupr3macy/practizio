import Link from 'next/link'

const plans = [
  {
    name: 'FREE',
    price: '0',
    features: [
      'Live AI booking link',
      'Up to 10 AI bookings/month',
      'Full dashboard',
      'Listed in directory',
      'Public profile page',
    ],
    cta: 'GET SET UP FREE',
    href: '/get-setup',
    recommended: true,
  },
  {
    name: 'STARTER',
    price: '49',
    features: [
      'Up to 50 AI bookings/month',
      'Advanced analytics',
      'Email notifications',
      'Priority support',
    ],
    cta: 'COMING SOON',
    href: '#',
    disabled: true,
  },
  {
    name: 'GROWTH',
    price: '149',
    features: [
      'Unlimited AI bookings',
      'Featured in directory',
      'Custom business rules',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'COMING SOON',
    href: '#',
    disabled: true,
  },
]

export function Pricing() {
  return (
    <section
      id="pricing"
      className="section-light py-24 px-6 md:px-10"
      style={{ borderTop: '1px solid var(--border-light)' }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <span
            className="font-mono text-[10px] uppercase block mb-4"
            style={{ letterSpacing: '0.3em', color: 'var(--taupe)' }}
          >
            SIMPLE PRICING
          </span>
          <h2
            className="editorial-heading text-4xl md:text-6xl"
            style={{ color: 'var(--foreground)' }}
          >
            Free to{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--taupe)' }}>start.</span>
          </h2>
          <p
            className="mt-6 max-w-lg"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 300,
              fontSize: '16px',
              color: 'var(--muted-text)',
              lineHeight: 1.6,
            }}
          >
            Get your first 10 AI bookings every month for free. No credit card, no trial period, no feature gates. Upgrade only when you&apos;re getting real value.
          </p>
        </div>

        {/* Pricing columns — separated by vertical dividers, no card boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className="relative flex flex-col py-10 md:px-10 first:md:pl-0 last:md:pr-0"
              style={{
                borderLeft: idx > 0 ? '1px solid var(--border-light)' : 'none',
              }}
            >
              {plan.recommended && (
                <span
                  className="font-mono text-[8px] uppercase mb-6"
                  style={{
                    letterSpacing: '0.3em',
                    color: 'var(--primary-accent)',
                  }}
                >
                  RECOMMENDED
                </span>
              )}

              <span
                className="mono-label block mb-6"
                style={{ color: 'var(--muted-text)' }}
              >
                {plan.name}
              </span>

              <div className="mb-8">
                <span
                  className="text-4xl"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    color: 'var(--foreground)',
                  }}
                >
                  ${plan.price}
                </span>
                <span
                  className="font-mono text-[8px] uppercase ml-2"
                  style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
                >
                  /MO
                </span>
              </div>

              <div style={{ height: 1, background: 'var(--border-light)' }} className="mb-6" />

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: 'var(--primary-accent)' }}
                    />
                    <span
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 300,
                        color: 'var(--muted-text)',
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.name === 'FREE' ? (
                <div className="flex flex-col gap-3">
                  <Link href="/signup" className="btn-primary text-center">
                    SET UP MYSELF — FREE
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="flex-1" style={{ height: 1, background: 'var(--border-light)' }} />
                    <span className="font-mono text-[8px] uppercase" style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}>
                      or
                    </span>
                    <div className="flex-1" style={{ height: 1, background: 'var(--border-light)' }} />
                  </div>
                  <Link href="/get-setup" className="btn-ghost text-center">
                    HAVE US DO IT — FREE
                  </Link>
                </div>
              ) : (
                <Link
                  href={plan.href}
                  className={`btn-ghost text-center ${plan.disabled ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
