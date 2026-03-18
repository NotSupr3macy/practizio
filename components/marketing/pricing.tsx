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
      className="py-32 px-6 md:px-10"
      style={{ background: 'var(--navy)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <span
            className="font-mono text-[10px] uppercase block mb-6"
            style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}
          >
            SIMPLE PRICING
          </span>
          <h2
            className="editorial-heading"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--white)', lineHeight: 1.05 }}
          >
            Free to{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>start.</span>
          </h2>
          <p
            className="mt-6 max-w-lg"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 300,
              fontSize: '18px',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.7,
            }}
          >
            Get your first 10 AI bookings every month for free. No credit card, no trial period, no feature gates. Upgrade only when you&apos;re getting real value.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col p-8 md:p-10"
              style={{
                background: 'var(--white)',
                borderRadius: '4px',
              }}
            >
              {/* Recommended badge */}
              {plan.recommended && (
                <span
                  className="font-mono text-[8px] uppercase mb-4"
                  style={{
                    letterSpacing: '0.3em',
                    color: 'var(--navy)',
                    fontWeight: 700,
                  }}
                >
                  RECOMMENDED
                </span>
              )}

              {/* Plan name */}
              <span
                className="font-mono text-[10px] uppercase block mb-6"
                style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}
              >
                {plan.name}
              </span>

              {/* Price */}
              <div className="mb-8">
                <span
                  className="font-display"
                  style={{
                    fontSize: 'clamp(40px, 4vw, 56px)',
                    lineHeight: 1,
                    color: 'var(--navy)',
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

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--border-light)' }} className="mb-8" />

              {/* Features */}
              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: 'var(--navy)' }}
                    />
                    <span
                      className="leading-relaxed"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 300,
                        fontSize: '16px',
                        color: 'var(--muted-text)',
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA buttons */}
              {plan.name === 'FREE' ? (
                <div className="flex flex-col gap-3 mt-auto">
                  <Link
                    href="/signup"
                    className="font-mono text-[10px] uppercase text-center transition-all duration-300 hover:tracking-[0.4em]"
                    style={{
                      letterSpacing: '0.25em',
                      padding: '14px 24px',
                      borderRadius: '2px',
                      background: 'var(--navy)',
                      color: 'var(--white)',
                      fontWeight: 700,
                    }}
                  >
                    SET UP MYSELF — FREE
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="flex-1" style={{ height: 1, background: 'var(--border-light)' }} />
                    <span className="font-mono text-[10px] uppercase" style={{ letterSpacing: '0.3em', color: 'var(--muted-text)' }}>
                      or
                    </span>
                    <div className="flex-1" style={{ height: 1, background: 'var(--border-light)' }} />
                  </div>
                  <Link
                    href="/get-setup"
                    className="font-mono text-[10px] uppercase text-center transition-all duration-300 hover:tracking-[0.4em]"
                    style={{
                      letterSpacing: '0.25em',
                      padding: '14px 24px',
                      borderRadius: '2px',
                      border: '1px solid var(--navy)',
                      color: 'var(--navy)',
                    }}
                  >
                    HAVE US DO IT — FREE
                  </Link>
                </div>
              ) : (
                <Link
                  href={plan.href}
                  className={`font-mono text-[10px] uppercase text-center transition-all duration-300 mt-auto ${plan.disabled ? 'pointer-events-none' : ''}`}
                  style={{
                    letterSpacing: '0.25em',
                    padding: '14px 24px',
                    borderRadius: '2px',
                    border: '1px solid var(--border-light)',
                    color: 'var(--muted-text)',
                  }}
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
