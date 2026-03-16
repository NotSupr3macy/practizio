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
    style: 'btn-solid',
    highlight: true,
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
    style: 'btn-pill opacity-50 pointer-events-none',
    highlight: false,
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
    style: 'btn-pill opacity-50 pointer-events-none',
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 md:px-10 relative overflow-hidden">
      <div className="glow-orb glow-orb-cyan w-[500px] h-[500px] top-[10%] left-[-15%] opacity-15" />
      <div className="glow-orb glow-orb-green w-[400px] h-[400px] bottom-[-10%] right-[-10%] opacity-15" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <span className="mono-label-sm text-accent/40 mb-4 block">SIMPLE PRICING</span>
          <h2 className="font-display font-extrabold uppercase text-5xl md:text-7xl tracking-tightest text-chrome-3d">
            FREE TO
            <br />
            START
          </h2>
          <p className="font-sans text-base font-light text-white/30 mt-6 max-w-lg">
            Get your first 10 AI bookings every month for free. No credit card, no trial period, no feature gates. Upgrade only when you&apos;re getting real value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col h-full rounded-2xl p-8 md:p-10 card-interactive overflow-hidden ${
                plan.highlight
                  ? 'card-chrome'
                  : 'card-metal'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #2869A9, transparent)' }} />
                </div>
              )}

              {plan.recommended && (
                <span className="glass-panel inline-block px-3 py-1 rounded-full mono-label-sm text-accent mb-6 self-start">
                  RECOMMENDED
                </span>
              )}

              <div className="flex-1">
                <span className="mono-label text-white/30 block mb-6">{plan.name}</span>

                <div className="mb-8">
                  <span className="text-chrome-3d font-display font-extrabold text-6xl tracking-tightest">
                    ${plan.price}
                  </span>
                  <span className="mono-label-sm text-white/20 ml-2">/MO</span>
                </div>

                <div className="divider-chrome mb-6" />

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent/50 mt-2 shrink-0" />
                      <span className="font-sans text-sm font-light leading-relaxed text-white/40">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.name === 'FREE' ? (
                <div className="flex flex-col gap-3">
                  <Link href="/signup" className="btn-solid text-center">
                    SET UP MYSELF — FREE
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="mono-label-sm text-white/20">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <Link href="/get-setup" className="btn-pill text-center">
                    HAVE US DO IT — FREE
                  </Link>
                </div>
              ) : (
                <Link href={plan.href} className={plan.style}>
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
